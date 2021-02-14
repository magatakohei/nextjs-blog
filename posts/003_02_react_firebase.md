---
title: "React+Firebase [準備編]"
createdDate: "2021-02-13"
---

今回は、Firebase と React の連携方法に関して解説します。

# Firebase でプロジェクトを作成

1. [Firebase](https://firebase.google.com/)の公式サイトに移動します。
2. コンソールに移動をクリックしてください。（Google アカウントでログイン。ない方はこちらのページで作成してください。[Google アカウントの作成ページ](https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp)）
   <img src="/article_images/003/Firebase_top_page.webp"/>
   <br />
3. コンソールに移動できたら「プロジェクトを追加」をクリックします。
   <img src="/article_images/003/firebase_add_project.webp"/>
   <br/>
4. プロジェクト名をつけて「続行」をクリックしてください。
   <img src="/article_images/003/project_name.webp"/>
   <br/>
5. Google アナリティクスを有効化するか確認されるので、今回は無効にして「プロジェクトを作成」をクリックしてください。
   <img src="/article_images/003/firebase_google_analy.webp"/>
   <br />
6. プロジェクトの準備ができたら、続行をする。
   <img src="/article_images/003/firebase_create_project.webp"/>
   <br />
7. 次にアプリの追加をします。プロジェクトのコンソールからウェブアプリを追加する。
   <img src="/article_images/003/add_app.webp"/>
   <br/>
8. アプリに名前をつける。（todo-lesson）
   Hosting は有効化せずに、「アプリを登録」をしてください。
   <img src="/article_images/003/app_name.webp"/>
   <br/>
9. コンソールに進むをクリックしてください。

# React でプロジェクトを作成する

## create-react-app の実行、必要パッケージのインストール

1. まず、`create-react-app`でプロジェクトを作成します。

```bash
npx create-react-app <プロジェクト名> --template typescript
```

2. `firebase`npm パッケージをインストールします。

`npm`なら

```bash
npm install firebase
```

`yarn`なら

```bash
yarn add firebase
```

3. コマンドを実行して、動作確認します。([localhost:3000](http://localhost:3000/)を開く)

```bash
cd <プロジェクト名>
yarn start
```

<img src="/article_images/003/react-logo.webp"/>
<br/>
こんな感じになれば成功です。

# React と Firebase プロジェクトを連携

1. プロジェクトのコンソールで歯車マークから、「プロジェクトを設定」をクリックしてください。
   <img src="/article_images/003/firebase_project_setting.webp"/>
   <br/>
2. タブ「全般」で下までスクロールして、Firebase SDK snippet で「構成」を選択し確認してください。（※.env ファイルに設定していきます。）
   <img src="/article_images/003/firebase_sdk_snippet.webp"/>
   <br/>
3. プロジェクトの直下に「.env」ファイルを作成し、先程確認した内容を登録する。

```bash
REACT_APP_FIREBASE_APIKEY="<apiKey>"
REACT_APP_FIREBASE_DOMAIN="<authDomain>"
REACT_APP_FIREBASE_DATABASE="https://<projectId>.firebaseio.com"
REACT_APP_FIREBASE_PROJECT_ID="<projectId>"
REACT_APP_FIREBASE_STORAGE_BUCKET="<storageBucket>"
REACT_APP_FIREBASE_SENDER_ID="<messagingSenderId>"
REACT_APP_FIREBASE_APP_ID="<appId>"
```

※<>で囲った部分は、各々で確認したものに置き換えてください。

create-react-app で作成している場合、`REACT_APP`から始まるものはサーバーを立ち上げた際に自動で環境変数として読み込んでくれます。

4. src フォルダ内に firebase.ts ファイルを作成してください。

```typescript
import firebase from "firebase/app";
import "firebase/app";
import "firebase/firestore";

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
```

**解説**

- config 変数に先程「.env」ファイルに環境変数として設定した内容を読み込みます。
- firebase.initilizeApp で config 情報を引数に受け取り、アプリで Firebase を初期化します。
- 動作確認のために、Firestore を使用するので設定し export しておきます。

# 動作確認

## FireStore のデータを読み取りレンダリング

### コンソールから FireStore にデータを追加

1. プロジェクトのコンソールにアクセスしてください。
2. サイドバーから「Cloud Firestore」を選択してください。
   <img src="/article_images/003/firebase_cloud_firestore.webp"/>
   <br/>
3. 「データベースの作成」をクリック。
   <img src="/article_images/003/create_firestore.webp"/>
   <br/>
4. 「テストモードで開始する」を選択し、「次へ」。
5. ロケーションで「asia-northeast1」を選択し、「有効にする」。※「asia-northeast1」は東京です。ロケーションは GCP と同じになります。
6. Firestore の作成が完了したら、「コレクションを開始」をクリックしてください。
   <img src="/article_images/003/create_collection.webp"/>
   <br/>

7. 以下の内容でデータを追加。
   コレクション ID：tasks
   ドキュメント ID：自動 ID
   フィールド名：title 値：new task
   <img src="/article_images/003/add_firestore_data.webp"/>

   <img src="/article_images/003/add_document.webp"/>

## React から Firestore の値を読み込み

1. App.tsx を以下のように書き換え。

```typescript
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./App.css";

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  return (
    <div className="App">
      {tasks.map((task) => (
        <h3 key={task.id}>{task.title}</h3>
      ))}
    </div>
  );
};

export default App;
```

2. サーバーを起動し続けている場合は、一度「ctrl+C」で終了し、再起動。次のような画面が表示されていれば成功です。
   <img src="/article_images/003/display_collection_data.webp"/>
3. また FireStore にコンソールからデータを追加すると、ページの再読み込みをしなくても画面に反映されます！
   <img src="/article_images/003/e2e_test.webp"/>

これで、Firebase と連携できていることを確認できました。　 Firestore への CRUD 処理や　認証処理の利用方法については次回以降で解説していきます。
