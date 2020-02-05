import React, { Component } from 'react';
import { withAuthenticator, PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage } from 'aws-amplify';
import awsmobile from './aws-exports';
import './App.css';

Amplify.configure(awsmobile);

// const Header = () => {
// 
// }

// file upload処理
const ImageFileUpload = async (key, object, type) => {
  try {
      const result = await Storage.put(key, object, type);
      return result;
  } catch (err) {
      throw err;
  }
}

// main処理
const App = () => {

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
    ImageFileUpload(file.name, file, option).catch((err) => {
      console.log(err);
    })
  }

  return (
    <PhotoPicker preview onPick={data => onPickEvent(data)} />
  );
}

// export default App;
export default withAuthenticator(App);
