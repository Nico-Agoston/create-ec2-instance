#!/bin/bash
#####################################################
## Script to create a new EC2 Instance in AWS      ##
## Creator: Nico Agoston                           ##
## Cyreen GmbH                                     ##
## Version 1.2                                     ##
## 12.05.2023                                      ##
#####################################################


## COLORS ##
# Reset
Color_Off='\033[0m'       # Text Reset

# Regular Colors
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White

## FUNCTIONS ##
## Check if an error appeard during the execution
function check_error (){
        if [ $? -eq 0 ]; then
                message="${1}"
                echo -e "[ ${Green}  OK  ${Color_Off} ] ${message}"
        else
                message="${1}"
                echo -e "[ ${Red}  Error ${Color_Off} ] ${message}"
                return 0
        fi
}
## Function which prints out info text in the right color more easy
function info-text (){
        message="${1}"
        echo -e "[ ${White} Info ${Color_Off} ] ${message}"
}

## Function to accept arguments passed to the script
## Allowed arguments:
## --name Instance_Name
## --os ubuntu / Windows
while [ $# -gt 0 ] ; do
        case $1 in
                -n | --name) instance_name="$2" ;;
                -o | --os) operating_system="$2" ;;
        esac
        shift
done

## Eliminate case sensitivity and wrong input by making the operating_system string all lower case
operating_system_lowercase=$(echo "$operating_system" | tr '[:upper:]' '[:lower:]')

## Get the instance ID and save it in the EC2_ID variable using the passed through instance name to check if the instance already exists
EC2_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=${instance_name}" \
  --query 'Reservations[].Instances[].[InstanceId]' \
  --output text)

## Check if the instance with passed over name alrady exists
if [ -z "$EC2_ID" ]
then
		## If instance does not exist
		## Check if the passed over operating system is either Linux or Windows
        case "$operating_system_lowercase" in
				## If it is windows, create EC2 instance with windows image
                ("windows")
                        info-text "Using Operating System ${operating_system_lowercase}!"
                        info-text "Creating EC2 Instance.."

                        ## Create a new EC2 instance using the defined settings
                        aws ec2 run-instances \
                        --image-id "ami-06f81ab85dd2fa968" \
                        --key-name "Pipeline-Test" \
                        --count 1 \
                        --instance-type t2.micro \
                        --key-name cyreen-ec2-key \
                        --security-group-ids sg-0a89e439d6c210759 \
                        --subnet-id subnet-378f314c \
                        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${instance_name}}]"

                       check_error "${instance_name} EC2 Instance creation"
                        ;;
				## If it is windows, create EC2 instance with windows image
				("ubuntu")
                        info-text "Using Operating System ${operating_system_lowercase}!"
                        info-text "Creating EC2 Instance.."

                        ## Create a new EC2 instance using the defined settings
                        aws ec2 run-instances \
                        --image-id "ami-0ec7f9846da6b0f61" \
                        --key-name "Pipeline-Test" \
                        --count 1 \
                        --instance-type t2.micro \
                        --key-name cyreen-ec2-key \
                        --security-group-ids sg-0a89e439d6c210759 \
                        --subnet-id subnet-378f314c \
                        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${instance_name}}]"

                       check_error "${instance_name} EC2 Instance creation"
                        ;;
        esac
else
	## Print Success message, that the instance already exists
    echo -e "[ ${Green}  OK  ${Color_Off} ] Instance ${instance_name} already exists"
fi