const core = require('@actions/core');
const exec = require('@actions/exec');
const AWS  = require("aws-sdk");

// Set the Pipeline input
const access_key_id = core.getInput('access-key-id');
const access_key_secret = core.getInput('access-key-secret');
const region = core.getInput('region');
const image_id = core.getInput('image-id');
const instance_type = core.getInput('instance-type');
const key_pair = core.getInput('key-pair');
const security_groups = new Array(core.getInput('security-groups'));

// Load credentials and set region from pipeline input
AWS.config.update({
    credentials: {
     access_key_id: access_key_id,
     secret_access_key: access_key_secret,
     region: region
    }
   })

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

// Setup instance Parameters
var instance_parameters = {
    ImageId: image_id,
    InstanceType: instance_type,
    KeyName: key_pair,
    MinCount: 1,
    MaxCount: 1,
    SecurityGroups: security_groups
}

// var instance_promise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();
// Run
async function run(){
    try {
        console.log('Check If values are passed through as expected:');
        console.log(access_key_id);
        console.log(access_key_secret);
        console.log(region);
        console.log(image_id);
        console.log(instance_type);
        console.log(key_pair);
        console.log(security_groups);
    } catch (error) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();