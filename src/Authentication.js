import React from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { Auth } from 'aws-amplify';
import awsmobile from './aws-exports';
import './App.css';
import { I18n } from 'aws-amplify';
import { Home } from './App'

Amplify.configure(awsmobile);

const dict = {
  'ja': {
    'Sign in to your account': "ログイン",
    'Create a new account': "新規作成",
    'Username': "ユーザー名(メールアドレス)",
    'Password': "パスワード"
   }
};

I18n.putVocabularies(dict);
I18n.setLanguage('ja');

export default withAuthenticator(Home, {
  signUpConfig: {
    hiddenDefaults: ["email", "phone_number"]
}});
