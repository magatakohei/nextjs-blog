---
title: "React+Firebase [Auth編]"
createdDate: "2021-02-18"
---

今回は、Firebase と React の Authentication の利用方法に関して解説します。
Firebase との連携ができていない方は、(準備編)[./003_02_react_firebase.md]を確認しながら設定してみてください。

# Firebase config に Auth を追加

- 今回は Auth 機能を利用するため、準備編で src の直下に作成した firebase.ts ファイルを修正します。

```typescript
import firebase from "firebase/app";
import "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messageingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.firestore();
export const auth = firebase.auth();
```
