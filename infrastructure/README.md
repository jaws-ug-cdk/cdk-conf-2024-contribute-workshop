# 開発環境構築用CDK

ここでは開発環境となるEC2インスタンスをセットアップする、AWSCDK Applicationを定義しています。
実際のワークショップではcloudformationテンプレートを用いてデプロイを行うため、CDKから生成したCfnテンプレートを流用します。

## Cfnテンプレート構築手順

- `cd infrastructure && yarn`
- `npx cdk synth` コマンドでCfnテンプレートを生成
- `cdk.out/CdkConferenceStack.template.json`から以下の要素を削除する
  - Rulesセクション
  - Conditionsセクション
  - Parameters.BootstrapVersion
  - Resources.CDKMetadata
  - Resources.CustomVpcRestrictDefauleSGCustomResourceProviderRole
  - Resources.CustomVpcRestrictDefauleSGCustomResourceProviderHandler

