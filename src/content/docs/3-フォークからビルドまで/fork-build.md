---
title: フォークからビルドまで
description: AWS CDK のリポジトリをフォークし、ビルドするまでの手順を説明します。
---

## リポジトリのフォーク

まずは、AWS CDK のリポジトリをご自身の GitHub アカウントにフォークします。

しかし本ワークショップでは、**本家の AWS CDK リポジトリではなく、ワークショップ用の擬似リポジトリを使用します。** そのため、以下のリポジトリをフォークしてください。

- <https://github.com/jaws-ug-cdk/aws-cdk-for-workshop>

### ブラウザでリポジトリを開き、右上の`Fork`ボタンを押す

![workshop-01](./images/workshop-01.png)

### 入力値はそのままで、右下の`Create fork`ボタンを押す

![workshop-02](./images/workshop-02.png)

### 自分のアカウントにフォークされたリポジトリが開かれる

![workshop-03](./images/workshop-03.png)

## リポジトリのクローン

次は、フォークしたリポジトリを開発環境にクローン(複製)します。

本ワークショップでは先ほど構築した EC2 で実際に開発を行うため、EC2 の VS Code 上でクローンをしてみます。

まず、EC2 の VS Code に移り、左側に表示されているバーから「リポジトリの複製」をクリックします。

すると上の入力欄に「GitHub から複製」という項目が表示されるので、クリックします。

![workshop-05](./images/workshop-05.png)

![workshop-06](./images/workshop-06.png)

そして、先ほどフォークしたご自身のリポジトリ(`ユーザー名/aws-cdk-for-workshop`)を入力・選択します。

![workshop-07](./images/workshop-07.png)

表示されたものに沿ってそのままクリックしていき、リポジトリを VS Code 上で開きます。

![workshop-08](./images/workshop-08.png)

![workshop-09](./images/workshop-09.png)

![workshop-10](./images/workshop-10.png)

これでクローンが完了し、VS Code でコードを開けるようになりました。

## ターミナルを開いておく

ここで VS Code でターミナルを開いておきます。

以降で説明するインストールやビルドなどのコマンドは、このターミナルで実行します。

![workshop-11](./images/workshop-11.png)

## モジュールのインストール

さて、ここでクローンした AWS CDK リポジトリのコードを開いてみましょう。

まず、左側のディレクトリ一覧から、`packages/aws-cdk-lib`をクリックして中身を表示してみてください。

これは`aws-cdk-lib`モジュールといい、AWS CDK のコンストラクトなど CDK を構成する大部分のコードが含まれています。

※他のディレクトリでは、`@aws-cdk`には alpha モジュールなど、`@aws-cdk-testing`には integration テストなどのテストコードが入っています。

![workshop-14](./images/workshop-14.png)

試しに、Amazon SQS のコンストラクトファイル(`packages/aws-cdk-lib/aws-sqs/lib/queue.ts`)を開いてみましょう。

すると SQS のコンストラクトなどのコードが入ったファイルが表示されます。しかし、最初の数行の import 文でエラーが出ていることがわかります。

![workshop-15](./images/workshop-15.png)

これは、まだ aws-cdk が依存するモジュールなどのインストールをしていないからです。次のコマンドでインストールしてみましょう。

```sh
yarn install
```

![workshop-16](./images/workshop-16.png)

すると依存モジュールのインストールがされ、一部のエラーが解消されました。

## ビルド

しかし、まだエラーが出ているようです。`CfnQueue` (`sqs.generated`)という部分で出力されています。

![workshop-17](./images/workshop-17.png)

これは**L1 コンストラクトのモジュール**になりますが、AWS CDK では**L1 コンストラクトのファイルはビルドの際に自動生成**されます。

ここまでリポジトリのクローンから依存モジュールのインストールまでしましたが、**実はまだ「ビルド」をしていません**。

そこで、次の**ビルドコマンド**を投げてみましょう。

```sh
npx lerna run build --concurrency 4
```

※上記コマンドでは、**AWS CDK を構成するすべてのモジュール**をビルドしますが、たとえば`aws-cdk-lib`モジュールだけビルドする場合は、`--scope=aws-cdk-lib`オプションを指定することで、**ビルドするスコープを絞る**ことができます。

また、今回は並列実行数の上限を4に設定しています。これは実行環境に応じて適宜変更してください。

デフォルトのビルドでは**一度ビルドしたものはキャッシュされ**、次回ビルド時はそのキャッシュを使用します。しかし、このキャッシュにより思わぬビルドエラーになることも稀にあるため、その際は`--skip-nx-cache`というオプションを指定することで、**キャッシュを使わずにビルド**することができます。

またビルドの際、以下のようなエラーが起こることがあるため、その際は`export NODE_OPTIONS="--max-old-space-size=8192"`のように使用するメモリサイズを増加させることでエラーを回避することができます。**それを見越して、本ワークショップでは、あらかじめ EC2 で上記の環境変数の設定を行っています。**

```txt
ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

その他ビルドに関する説明は、[本家のコントリビュートガイド](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#building-aws-cdk-lib)をご覧ください。

![workshop-18](./images/workshop-18.png)

初回のフルビルドはとても時間がかかりますが、しばらく待ちましょう。

![workshop-19](./images/workshop-19.png)

無事ビルドが完了し、L1 コンストラクトの import で出力されていたエラーも解消されました。

※フルビルドの際に以下の差分が発生していますが、これらは破棄してしまって構いません。

![workshop-20](./images/workshop-20.png)

![workshop-21](./images/workshop-21.png)

![workshop-22](./images/workshop-22.png)

これで各ファイルを実際に変更する準備が整いました。

※各ファイルをダブルクリックすると、それぞれのファイルを新規タブで開けます。

- ユニットテストファイル: `packages/aws-cdk-lib/aws-sqs/test/sqs.test.ts`

![workshop-23](./images/workshop-23.png)

- integration テストファイル: `packages/@aws-cdk-testing/aws-sqs/test/integ.sqs.ts`

![workshop-24](./images/workshop-24.png)

## ※ブランチの作成・チェックアウト

:::note

**本ワークショップでは、後ほど実施する 「4. 機能追加PRの作成」 で実際にブランチの作成・チェックアウトを行うので、ここでは行う必要はありません。**

説明の便宜上こちらに載せていますが、実際にコントリビュートする際には以下を参考にして実行してください。

:::

以下のコマンドを実行して、プルリクエストのための任意の名前のブランチを作成します。`git branch`コマンドで作成したブランチが確認できます。

```sh
git switch -c workshop-guide-1

git branch
```
