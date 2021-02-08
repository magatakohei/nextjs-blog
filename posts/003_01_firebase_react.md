---
title: "React+FirebaseでTodoアプリを作成"
createdDate: "2021-02-08"
---

こんにちは、Magako です！今回は、Firebase と React を利用して Todo アプリを作成してみました。

[Kazu.T さんの Udemy 講座](https://www.udemy.com/course/firebasereact-hookstypescript-todo/)を参考にして作らせて頂きました。
無料の講座で分かりやすいのでおすすめです。

では、早速始めていきましょう！

# React のプロジェクトの作成

## Create-React-App

1. まずは今回のプロジェクトを作成するフォルダを作成します。
   フォルダの名前は自由に決めてください。
2. 作成したプロジェクトを VSCode で開きます。
3. VSCode で開けたらターミナルで下記のコマンドを実行します。

```bash
npx create-react-app . --template typescript
```

※create-react-app は React プロジェクトの雛形を作成することができるコマンドです。

4. ターミナルで下記のコマンドを実行して React のマークが表示されたら成功です。

```bash
yarn start
```

<img src="/article_images/003/react-logo.webp"/>

## パッケージの追加

今回使用するパッケージをインストールしていきます。

- @material-ui/core
- @material-ui/icons
- firebase
- react-router-dom

```bash
yarn add @material-ui/core
yarn add @material-ui/icons
yarn add firebase
yarn add react-router-dom @types/react-router-dom
```

# React と Firebase の連携

## Firebase にプロジェクトの作成

1. [firebase](https://firebase.google.com/)の公式サイトに移動。
2. コンソールに移動をクリック。（Google アカウントでログイン。ない方は作成してください。）
3. プロジェクトを追加をクリック。
   <img src="/article_images/003/firebase_add_project.webp"/>
4. プロジェクト名をつけて「続行」をクリックする。
   <img src="/article_images/003/project_name.webp"/>
5. Google アナリティクスを有効化するか確認されるので、今回は無効にして「プロジェクトを作成」をする。
6. プロジェクトの準備ができたら、続行をする。
7. 次にアプリの追加をする。プロジェクトのコンソールからウェブアプリを追加する。
   <img src="/article_images/003/add_app.webp"/>
8. アプリに名前をつける。（todo-lesson）
   Hosting は有効化せずに、「アプリを登録」をする。›
   <img src="/article_images/003/app_name.webp"/>
9. コンソールに進むをクリック。

## React と Firebase の連携

1. プロジェクトのコンソールで歯車マークから、「プロジェクトを設定」をクリック。
   <img src="/article_images/003/firebase_project_setting.webp"/>
2. タブ「全般」で下までスクロールして、Firebase SDK snippet で「構成」を選択し確認。
   <img src="/article_images/003/firebase_sdk_snippet.webp"/>
3. プロジェクトの直下に「.env」ファイルを作成する。
4. .env ファイルの中身に先程確認した内容を設定していく。

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

5. src フォルダの直下に firebase.ts ファイルを作成。

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
  strorageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messageingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = firebase.initializeApp(config);

export const db = firebaseApp.firestore();
export const auth = firebase.auth();
```

**解説**

- モジュール
  - firebase/firestore : firestore を利用する際に読み込む（データベース）
  - firebase/auth : 認証機能を利用する際に読み込む
- config 変数で先程「.env」ファイルに設定した値を読み込むす。
- firebase.initilizeApp で config 情報を引数に受け取り、アプリケーションを initialize。
- firebase.db 　と firebase.auth は他のモジュールで利用できるように export しておきます。

これで準備は完了！

## FireStore のデータを読み取りレンダリング

### コンソールから FireStore にデータを追加

1. プロジェクトのコンソールにアクセス。
2. サイドバーから「Cloud Firestore」を選択。
3. 「データベースの作成」をクリック。
   <img src="/article_images/003/create_firestore.webp"/>
4. 「テストモードで開始する」を選択し、「次へ」。
5. ロケーションで「asia-northeast1」を選択し、「有効にする」。※「asia-northeast1」は東京です。ロケーションは GCP と同じになります。
6. Firestore の作成が完了したら、「コレクションを開始」をクリック。
   <img src="/article_images/003/create_collection.webp"/>
7. 以下の内容でデータを追加。
   コレクション ID：tasks
   ドキュメント ID：自動 ID
   フィールド名：title 値：new task
   <img src="/article_images/003/add_firestore_data.webp"/>

   <img src="/article_images/003/add_document.webp"/>

8. tasks コレクションにドキュメントを追加。
   ドキュメント ID：自動 ID
   フィールド名：title 値：cording

### Firestore のデータ読み取りレンダリング

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

**解説**

- FireStore からデータを取得するため、先程エクスポートしておいた db をインポート。

- FireStore から取得したデータを State として保持するため、useState を利用。

- アプリケーションが立ち上がった際に、FireStore にアクセスしてデータを取得するため useEffect を利用。

- db.collection("tasks").onSnapshot で tasks コレクションからデータ取得する。

- useEffect の return にコンポーネントがアンマウントされた時に実行される関数を渡す。（クリーンナップ関数）

- db.collection("tasks").onSnapshot とすることで、db の変化を監視するようになります。監視を停止するための関数を、返り値で返してくれるのでクリーンナップ関数として実行する。

## FireStore へのデータの追加

次にデータの追加ができるようにします！

1. 入力フィールドの作成。　 App.tsx を以下のように書き換え。

```typescript
import { FormControl, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./App.css";

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");

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
      <h1>Todo App by React/Firebase</h1>
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="new task?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      {tasks.map((task) => (
        <h1 key={task.id}>{task.title}</h1>
      ))}
    </div>
  );
};

export default App;
```

**解説**

- material-ui の「FormControl」と「TextField」を使うためインポート。
- `<div>`タグの中に`<h1>`タグでヘッダを追加。
- 「FormControl」と「TextField」を利用して、入力フィールドを追加。
  - InputLabelProps に「shrink:true」を設定することで、label を左上に小さく表示することができる。

<div></div>

2. FireStore への追加処理をする。　 App.tsx を下記のように変更する。

```typescript
import { FormControl, TextField } from "@material-ui/core";
import AddToPhotoicons from "@material-ui/icons/AddToPhotos";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./App.css";

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: "" }]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  const newTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    db.collection("tasks").add({ title: input });
    setInput("");
  };

  return (
    <div className="App">
      <h1>Todo App by React/Firebase</h1>
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="new task?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button disabled={!input} onClick={newTask}>
        <AddToPhotoicons />
      </button>
      {tasks.map((task) => (
        <h1 key={task.id}>{task.title}</h1>
      ))}
    </div>
  );
};

export default App;
```

**解説**

- 追加のボタンとして利用するために material-ui から「AddToPhotos」をインポートします。
- 先程追加した FormControl の下に、`<button>`を追加します。
- input データが null の時には、disabled するようにします。
- クリック時に newTask という関数を呼び出すようにする。
- new Task
  - db.collection("tasks").add({title:input})で FireStore にデータを追加する。id は自動。
  - 追加後は次の入力のために、input State には空文字をセットする。

下記の画像のようにデータが入力ボックスから、Task の追加ができれば成功です！
<img src="/article_images/003/add_task.webp"/>

## FireStore のデータの更新・削除
