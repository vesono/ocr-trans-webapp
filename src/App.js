import React, { Component } from 'react';
import { PhotoPicker } from 'aws-amplify-react';
import Amplify, { Storage, Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import './App.css';
import { Header } from './Header'
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure(awsmobile);

// log out
export const logout = () => {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

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
export const Home = () => {

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
    <div>
      <Header />
      <PhotoPicker preview onPick={data => onPickEvent(data)} />
    </div>
  );
}

