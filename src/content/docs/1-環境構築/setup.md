---
title: 開発環境のセットアップ
---

ここでは開発環境となるEC2インスタンスをセットアップします。
EC2への接続にはEC2 instance connect endpointを利用します。

## 構築手順

### 環境

```sh
$ node --version
v20.14.0
$ npm --version
10.7.0
$ aws --version
aws-cli/2.16.1 Python/3.11.9 Darwin/23.3.0 source/arm64
```

### 下準備

AWS CLIの認証情報設定及びCDKのInstall, Bootstrapを行います。

既に実施済みの方は[スタックのデプロイ](#スタックのデプロイ)に進んでください。

```sh
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: ap-northeast-1
Default output format [None]: json

$ npm install -g aws-cdk
$ cdk --version
v2.142.1
$ cdk bootstrap aws://123456789012/ap-northeast-1
```

### スタックのデプロイ

開発環境スタックのデプロイを行います。コマンド実行後、およそ5分ほどでデプロイが完了します。

```sh
cd infrastructure
npm install
npx cdk deploy --require-approval never
```

### EC2へのアクセス

[AWSコンソールのEC2管理画面](https://ap-northeast-1.console.aws.amazon.com/ec2/home?region=ap-northeast-1#Instances:instanceState=running)にアクセスし、EC2インスタンスにEIC Endpointを経由して接続します

Instance IDを選択 > Connect > EC2 Instance Connect > Connect using EC2 Instance Connect Endpoint > Connect

以下の画面が表示されればOKです。

![EC2コンソール画面](../../../assets/ec2-console.png)

### VSCode Serverへのブラウザアクセスの確立

EC2上で以下のコマンドを実行し、VSCode Serverを起動します。

```sh
$ code tunnel
*
* Visual Studio Code Server
*
* By using the software, you agree to
* the Visual Studio Code Server License Terms (https://aka.ms/vscode-server-license) and
* the Microsoft Privacy Statement (https://privacy.microsoft.com/en-US/privacystatement).
*
[2024-05-24 11:41:45] info Using GitHub for authentication, run `code tunnel user login --provider <provider>` option to change this.
To grant access to the server, please log into https://github.com/login/device and use code 77BE-3128
```

続いて、ブラウザで[https://github.com/login/device](https://github.com/login/device)にアクセスし、コードを入力し認証を完了させます。

- 上記の例では'77BE-3128'を入力 > Continue > Continue > Authorize-Visual-Studio-Code

EC2に戻り、以下のように表示されたURLをブラウザで開きます。

```sh
[2024-05-24 11:44:59] info Creating tunnel with the name: ip-10-0-0-26ap-north

Open this link in your browser https://vscode.dev/tunnel/ip-10-0-0-26ap-north
```

VSCodeが開くので、「このトンネルを開始するために使用したアカウントの種類は何ですか？」でGitHubを選択します。

ターミナルを開けば準備完了です。

![VSCode画面](../../../assets/vscode.png)
