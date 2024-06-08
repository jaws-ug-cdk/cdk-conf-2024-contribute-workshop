import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ocf from "@open-constructs/aws-cdk";
import {
  PreinstalledAmazonLinuxInstance,
  PreinstalledSoftwarePackage,
} from "cdk-preinstalled-amazon-linux-ec2";

export class CdkConferenceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new cdk.aws_ec2.Vpc(this, "VPC", {
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 26,
          name: "Public",
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const instance = new PreinstalledAmazonLinuxInstance(this, "Instance", {
      vpc,
      instanceType: cdk.aws_ec2.InstanceType.of(
        cdk.aws_ec2.InstanceClass.C7G,
        cdk.aws_ec2.InstanceSize.XLARGE2
      ),
      blockDevices: [
        {
          deviceName: "/dev/xvda",
          volume: cdk.aws_ec2.BlockDeviceVolume.ebs(100, {
            deleteOnTermination: true,
            encrypted: false,
          }),
        },
      ],
      machineImage: new cdk.aws_ec2.AmazonLinuxImage({
        generation: cdk.aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
        cpuType: cdk.aws_ec2.AmazonLinuxCpuType.ARM_64,
      }),
      vpcSubnets: {
        subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
      },
      preinstalledSoftware: {
        packages: [
          PreinstalledSoftwarePackage.NODEJS,
          PreinstalledSoftwarePackage.VSCODE,
          PreinstalledSoftwarePackage.GIT,
        ],
      },
    });

    instance.addUserData(
      "npm install -g yarn",
      "sudo dnf groupinstall -y 'Development Tools'",
    );

    const eicEndpoint = new ocf.aws_ec2.InstanceConnectEndpoint(
      this,
      "InstanceConnectEndpoint",
      {
        vpc,
      }
    );

    // EIC Endpoint -> EC2 InstanceへのSecurity Groupの穴あけ
    eicEndpoint.connections.allowTo(instance, cdk.aws_ec2.Port.tcp(22));
  }
}
