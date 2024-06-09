import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ocf from "@open-constructs/aws-cdk";
import {
  PreinstalledAmazonLinuxInstance,
  PreinstalledSoftwarePackage,
} from "cdk-preinstalled-amazon-linux-ec2";
import * as iam from "aws-cdk-lib/aws-iam";

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
      ssmSessionPermissions: true,
      blockDevices: [
        {
          // Attach as a root device
          deviceName: "/dev/xvda",
          volume: cdk.aws_ec2.BlockDeviceVolume.ebs(30, {
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
      "npm install -g yarn aws-cdk",
      // Install make and other build tools for setup of CDK
      "sudo dnf groupinstall -y 'Development Tools'",
      // Increase memory for Node.js
      "echo 'export NODE_OPTIONS=--max-old-space-size=8192' >> /etc/profile.d/myenv.sh",
      "chmod +x /etc/profile.d/myenv.sh",
      "sudo loginctl enable-linger ec2-user",
    );

    // TODO Temporarily grant full permissions. Restrict to appropriate permissions if time allows.
    instance.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["*"],
        resources: ["*"],
      })
    );

    const eicEndpoint = new ocf.aws_ec2.InstanceConnectEndpoint(
      this,
      "InstanceConnectEndpoint",
      {
        vpc,
      }
    );

    // Opening Security Group from EIC Endpoint to EC2 Instance
    eicEndpoint.connections.allowTo(instance, cdk.aws_ec2.Port.tcp(22));
  }
}
