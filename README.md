## 概要

- 写真をアップロードすると、OCRで英語を読み取り自動で翻訳までしてくれるアプリケーション

## 作成方針

- s3に画像を上げる
- 上げた後にurlを取得して、google cloud vision apiに投げて結果を取得
- 英訳結果を整形した後に、aws translateに投げて翻訳結果を得る
- 画像ファイル名と結果はdynamoDBに入れる
- 画面にocr結果と翻訳結果を表示する

## 環境

- aws amplify
- react
- node.js

## パッケージ一覧
```bash
# bootstrap
npm install react-bootstrap bootstrap jquery
# amplify系(安定版)
npm install aws-amplify@^1.3.3 aws-amplify-react@^2.6.3
# google cloud vision api
npm install --save @google-cloud/vision
# moment.js
npm install moment
```
