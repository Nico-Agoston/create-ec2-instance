# 🚀 Create AWS EC2 instance - GitHub Action

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