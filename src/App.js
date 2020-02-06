import React, { Component } from 'react';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage, Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import './App.css';
import { Header } from './Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import gcp_env from './gcp_config/api_gcp_config.js';

Amplify.configure(awsmobile);

// 現在時刻取得
const nowtime = () => {
  const moment = require('moment');
  return moment().format('YYYYMMDDHHmmssSSS')
}

// log out
export const logout = () => {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

// DB追加
const addDB = () => {

}

// file upload処理関数
const ImageFileUpload = async (key, object, type) => {
  const result = await Storage.put(key, object, type);
  return result;
}

// google cloud vision api呼び出し関数
const SendCloudVison = async data => {
  // json body作成
  const body = JSON.stringify({
    requests: [
      {
        features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
        image: { content: data }
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
  const resjson = await response.json();
  console.log(resjson.responses["0"].fullTextAnnotation.text);
}

// main処理
export const Home = () => {

  // 写真アップロードイベント
  // onLoadに統一する。コンポーネントで送信ボタン増やす感じ
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Widget/PhotoPicker.tsx
  const onPickEvent = async data => {
    const { file } = data;
    console.log(file);
    const option = { 
      level: 'private',
      contentType: file.type
    };
    await ImageFileUpload(file.name, file, option)
  }

  // cloud vision api呼び出しイベント
  const CloudVisonEvent = async dataurl => {
    const datasplit = dataurl.split( ',' );
    const data64 = datasplit[1];
    await SendCloudVison(data64);
    console.log(nowtime());
  }

  return (
    <div>
      <Header />
      <PhotoPicker preview onPick={data => onPickEvent(data)}
                           onLoad={dataURL => CloudVisonEvent(dataURL)} />
    </div>
  );
}

