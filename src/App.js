import React, { useEffect, useReducer, useRef } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage, Auth } from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsmobile from './aws-exports';
import { createPhotoOcr } from './graphql/mutations';
import { Header } from './Header'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import gcp_env from './gcp_config/api_gcp_config.js';

Amplify.configure(awsmobile);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

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

// エスケープ文字を戻す置換処理
const escapeWordRep = str => {
  return str
          .replace(/\\'/g, "'")
          .replace(/\\"/g, '"')
          .replace(/\\\//g, '/')
          .replace(/\\x3c/g, '<')
          .replace(/\\x3e/g, '>')
          .replace(/\\\\/g, '\\')
          .replace(/\n/g, ' ')
          .replace('\n', ' ');
};

// 新規データ追加
const insertDB = async (imageName, imageObject, ocrResult, trResult) => {
  const dbNewdata = {
    name: imageName ,
    photo_base64: imageObject,
    ocr_result: ocrResult,
    translate_result: trResult
  };
  await API.graphql(graphqlOperation(createPhotoOcr, { input: dbNewdata }));
}

// file upload処理関数
const imageFileUpload = async (key, object, type) => {
  const result = await Storage.put(key, object, type);
  return result;
}

// google cloud vision api呼び出し関数
const sendCloudVison = async data => {
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

// 翻訳処理
const translate = async trText => {
  const result = Predictions.convert({
                   translateText: {
                     source: {
                       text: trText,
                       language: "en" // defaults configured on aws-exports.js
                       // supported languages https://docs.aws.amazon.com/translate/latest/dg/how-it-works.html#how-it-works-language-codes
                     },
                     targetLanguage: "ja"
                   }
                 })
  return result
}

// main処理
export const Home = () => {

  // 写真アップロードイベント
  // onLoadに統一する。コンポーネントで送信ボタン増やす感じ
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react/src/Widget/PhotoPicker.tsx
  const cloudVisonEvent = async dataurl => {
    const datasplit = dataurl.split( ',' );
    const data64 = datasplit[1];
    // 拡張子、ContentTypeをとる
    const fileExtension = datasplit[0].toString().slice(datasplit[0].indexOf('/') + 1, datasplit[0].indexOf(';'));
    const ctType = datasplit[0].toString().slice(datasplit[0].indexOf(':') + 1, datasplit[0].indexOf(';'));
    console.log(ctType);
    // ファイル名設定
    const imagename = nowtime() + '.' + fileExtension;
    // ocr処理
    const ocrResult = await sendCloudVison(data64);
    const repOcrResult = escapeWordRep(ocrResult);
    console.log(repOcrResult);
    // 翻訳処理
    const translateResult = await translate(repOcrResult);
    console.log(translateResult.text);
    // db追加
    await insertDB(imagename, data64, repOcrResult, translateResult.text);
    // s3追加処理
    const decodedFile = new Buffer(data64, 'base64');
    const option = { 
      level: 'private',
      contentType: ctType
    };
    const s3Result = await imageFileUpload(imagename, decodedFile, option);
    console.log(s3Result);
  }

  // 処理入れる
  // useEffect(() => {}, [])

  return (
    <div>
      <Header />
      <PhotoPicker preview onLoad={dataURL => cloudVisonEvent(dataURL)} />
    </div>
  );
}

