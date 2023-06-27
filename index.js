const core = require('@actions/core');
const AWS  = require("aws-sdk");

// Set the Pipeline input
const access_key_id = core.getInput('access-key-id');
const access_key_secret = core.getInput('access-key-secret');
const region = core.getInput('region');
const image_id = core.getInput('image-id');
const instance_name = core.getInput('name');
const instance_type = core.getInput('instance-type');
const key_pair = core.getInput('key-pair');
const security_groups = new Array(core.getInput('security-groups'));
const volume_size = new Array(core.getInput('volume-size'));


// Get the current Date for a Tag
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today= yyyy + '-' + mm + '-' + dd;

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
    SecurityGroups: security_groups,
    VolumeSize: volume_size
}

// Create a promise on an EC2 service object
var instance_promise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instance_parameters).promise();

// Handle promise's fulfilled/rejected states
instance_promise.then(
    function (data) {
        console.log(data);
        var instanceId = data.Instances[0].InstanceId;
        console.log("Created instance", instanceId);
        // Add tags to the instance
        tagParams = {
            Resources: [instanceId], Tags: [
                {
                    // Name the instance
                    Key: 'Name',
                    Value: instance_name
                },
                {
                    // Tag the instance with the date it got created on
                    Key: 'Created on',
                    Value: today
                },
                {
                    // Tag the instance with the creator of the instance, in this case it is created by Pipeline
                    Key: 'creator',
                    Value: 'Created by Pipeline'
                }
            ]
        };
        // Create a promise on an EC2 service object
        var tagPromise = new AWS.EC2({ apiVersion: '2016-11-15' }).createTags(tagParams).promise();
        // Handle promise's fulfilled/rejected states
        tagPromise.then(
            function (data) {
                console.log("Instance tagged");
            }).catch(
                function (err) {
                    console.error(err, err.stack);
                });
    }
).catch(
    function (err) {
        console.error(err, err.stack);
    }
);
