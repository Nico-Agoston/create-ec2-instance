🚀 Create AWS EC2 instance - GitHub Action

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