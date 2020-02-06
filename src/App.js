import React, { Component } from 'react';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage, Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import './App.css';
import { Header } from './Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import gcp_env from './gcp_config/api_gcp_config.js';

Amplify.configure(awsmobile);

// log out
export const logout = () => {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

// file upload処理関数
const ImageFileUpload = async (key, object, type) => {
  try {
      const result = await Storage.put(key, object, type);
      return result;
  } catch (err) {
    console.log(err);
  }
}

// google cloud vision api呼び出し関数
const SendCloudVison = async dataurl => {
  const datasplit = dataurl.split( ',' );
  const data64 = datasplit[1];
  console.log(data64);
  // json body作成
  const body = JSON.stringify({
    requests: [
      {
        features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
        image: {
          content: data64
        }
      }
    ]
  });
  // cloud vision api呼び出し
  const response = await fetch(
    "https://vision.googleapis.com/v1/images:annotate?key=" +
    gcp_env["GOOGLE_CLOUD_VISION_API_KEY"],
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: body
    }
  );
  const resJson = await response.json();
  console.log(resJson);
}

// main処理
export const Home = () => {

  // 保存処理イベント
  const onPickEvent = data => {
    const { file } = data;
    const option = { 
      level: 'private',
      contentType: file.type
    };
    ImageFileUpload(file.name, file, option).then((result) => {
      // google apiを呼び出す
      console.log(result);
    })
  }

  return (
    <div>
      <Header />
      <PhotoPicker preview onPick={data => onPickEvent(data)}
                           onLoad={dataURL => SendCloudVison(dataURL)} />
    </div>
  );
}

