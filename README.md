# 🚀 Create AWS EC2 instance - GitHub Action

## How this Action works
This Action is used to create an EC2 instance in your AWS Organization if it does not already exist!
So If there is no existing EC2 instance with the configured name (see parameters) it will skip this step and output the name and the instance ID.
If it does not already exist, it creates a new EC2 instance with the provided settings.

## Parameters

|   Input Parameter   |                                         Description                                               | Default Value |
| :---                |                                             :---                                                  | :---:         |
| `access-key-id`     | The Access Key Id used to authenticate against AWS                                                | NONE          |
| `access-key-secret` | The Access Key secret used to authenticate against AWS                                            | NONE          |
| `region`            | The region where the EC2 instance should get created                                              | NONE          |
| `image-id`          | Provide the Operating system image ID used on the EC2 instance                                    | ami-0329d3839379bfd15 (ubuntu x64)      |
| `name`              | The name of the new EC2 instance                                                                  | NONE          |
| `instance-type`     | The Type of the new instance which should get launched                                            | t2.micro      |
| `key-pair`          | Keypair which should get attached to the ec2 instance for SSH connection                          | NONE          |
| `security-group-ids`| The IDs of the Security Groups which should get attached to the new EC2 instance divided by comma | NONE          |
| `volume-size`       | The size of the attached volume in Gib                                                            | 8 (Gib)       |


## Usage

```yaml
name: Testing
on:
  push:
    branches:
      - main
env:
  # Access key and secrets have to be defined as an environment variable. 
  # The JavaScript SDK recognizez these only through env variables.
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
jobs:
  show-values:
    name: Create EC2 instance
    runs-on: ubuntu-latest
    steps:
      - name: Create EC2 instance
        uses: Nico-Agoston/create-ec2-instance@main
        with:
          access-key-id: ${{ env.AWS_ACCESS_KEY_ID }}
          access-key-secret: ${{ env.AWS_SECRET_ACCESS_KEY }} 
          region: eu-central-1
          image-id: ami-04e601abe3e1a910f
          instance-type: t2.micro
          key-pair: cyreen-ec2-key
          security-group-ids: <ID-1>, <ID-2>
          name: Test-EC2-instance
          volume-size: 12
```
output:

```json
{
  Groups: [],
  Instances: [
    {
      AmiLaunchIndex: 0,
      ImageId: 'ami-04e601abe3e1a910f',
      InstanceId: 'i-xxxxxxxxxxxxxxxxx',
      InstanceType: 't2.micro',
      KeyName: '<Your entered key name>',
      LaunchTime: 2023-06-28T14:31:14.000Z,
      Monitoring: [Object],
      Placement: [Object],
      PrivateDnsName: 'ip-xxx-xxx-xxx-xxx.<region>.compute.internal',
      PrivateIpAddress: 'xxx.xxx.xxx.xxx',
      ProductCodes: [],
      PublicDnsName: '',
      State: [Object],
      StateTransitionReason: '',
      SubnetId: 'subnet-id',
      VpcId: 'vpc-9id',
      Architecture: 'x86_64',
      BlockDeviceMappings: [],
      ClientToken: '<token>',
      EbsOptimized: false,
      EnaSupport: true,
      Hypervisor: 'xen',
      ElasticGpuAssociations: [],
      ElasticInferenceAcceleratorAssociations: [],
      NetworkInterfaces: [Array],
      RootDeviceName: '/dev/sda1',
      RootDeviceType: 'ebs',
      SecurityGroups: [Array],
      SourceDestCheck: true,
      StateReason: [Object],
      Tags: [],
      VirtualizationType: 'hvm',
      CpuOptions: [Object],
      CapacityReservationSpecification: [Object],
      Licenses: [],
      MetadataOptions: [Object],
      EnclaveOptions: [Object],
      PrivateDnsNameOptions: [Object],
      MaintenanceOptions: [Object],
      CurrentInstanceBootMode: 'legacy-bios'
    }
  ],
  OwnerId: '<Your Owner ID>',
  ReservationId: '<Reservation ID>'
}
Created instance i-ID
Instance tagged
```