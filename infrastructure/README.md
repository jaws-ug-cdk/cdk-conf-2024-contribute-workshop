# workshop向けのインフラ構築

## 概要

CDKの開発を行うEC2インスタンスを構築します。
EC2への接続にはEC2 instance connect endpointを利用します。

## 構築手順

現状はCDKベースです。Cfnが好ましい場合は、生成されたテンプレートを適宜流用するつもりです。

```sh
cd infrastructure
npm install
npx cdk bootstrap aws://123456789012/ap-northeast-1
npx cdk deploy
```

- [AWSコンソール](https://ap-northeast-1.console.aws.amazon.com/ec2/home?region=ap-northeast-1#Instances:instanceState=running)にアクセスし、EC2インスタンスにEIC Endpointを経由して接続
  - Connect > EC2 Instance Connect > Connect using EC2 Instance Connect Endpoint > Connect
- EC2上で以下を実行

```sh
# VSCode Serverを起動
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

- ブラウザで[https://github.com/login/device](https://github.com/login/device)にアクセスし、コードを入力
  - 上記の例では'77BE-3128'を入力 > Continue > Continue > Authorize-Visual-Studio-Code
- EC2に戻り、表示されたURLをコピーしてブラウザで開く

```sh
[2024-05-24 11:44:59] info Creating tunnel with the name: ip-10-0-0-26ap-north

Open this link in your browser https://vscode.dev/tunnel/ip-10-0-0-26ap-north
```

- VSCodeが開くので、「このトンネルを開始するために使用したアカウントの種類は何ですか？」でGitHubを選択
  - 再度GitHubへのログインが要求されるかも
- ターミナルを開いてCDKリポジトリをclone! To be continued...
