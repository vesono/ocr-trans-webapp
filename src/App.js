import React, { useEffect, useReducer, useRef } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage, Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import { createPhotoOcr } from './graphql/mutations';
import { Header } from './Header'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import gcp_env from './gcp_config/api_gcp_config.js';

Amplify.configure(awsmobile);

// 現在時刻取得
const nowtime = () => {
  const moment = require('moment');
  return moment().format('YYYYMMDDHHmmssSSS')
}

// log out
export const logout = async () => {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

// 新規データ追加
const insertDB = async (imagename, imageobject, result) => {
  const db_newdata = {
    name: imagename ,
    photo_base64: imageobject,
    ocr_result: result
  };
  await API.graphql(graphqlOperation(createPhotoOcr, { input: db_newdata }));
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
  return resjson.responses["0"].fullTextAnnotation.text;
}

// 処理入れる
// useEffect(() => {}, [])

// main処理
export const Home = () => {

  // 写真アップロードイベント
  // onLoadに統一する。コンポーネントで送信ボタン増やす感じ
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Widget/PhotoPicker.tsx
  const CloudVisonEvent = async dataurl => {
    const datasplit = dataurl.split( ',' );
    const data64 = datasplit[1];
    // 拡張子、ContentTypeをとる
    const fileExtension = datasplit[0].toString().slice(datasplit[0].indexOf('/') + 1, datasplit[0].indexOf(';'));
    const ctType = datasplit[0].toString().slice(datasplit[0].indexOf(':') + 1, datasplit[0].indexOf(';'));
    console.log(ctType);
    // ファイル名設定
    const imagename = nowtime() + '.' + fileExtension;
    // ocr処理
    const ocrResult = await SendCloudVison(data64);
    // db追加
    await insertDB(imagename, data64, ocrResult);
    // s3追加処理
    const decodedFile = new Buffer(data64, 'base64');
    const option = { 
      level: 'private',
      contentType: ctType
    };
    const s3Result = await ImageFileUpload(imagename, decodedFile, option);
    console.log(s3Result);
  }

  return (
    <div>
      <Header />
      <PhotoPicker preview onLoad={dataURL => CloudVisonEvent(dataURL)} />
    </div>
  );
}

