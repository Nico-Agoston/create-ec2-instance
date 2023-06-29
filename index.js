const core = require('@actions/core');
const AWS = require("aws-sdk");

// Set the Pipeline input
const access_key_id = core.getInput('access-key-id');
const access_key_secret = core.getInput('access-key-secret');
const region = core.getInput('region');
const image_id = core.getInput('image-id');
const instance_name = core.getInput('name');
const instance_type = core.getInput('instance-type');
const key_pair = core.getInput('key-pair');
let security_group_ids = core.getInput('security-group-ids').replace(" ","").split(',');
const volume_size = parseInt(core.getInput('volume-size'));


// Get the current Date for a Tag
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

// update the config and the credentials
AWS.config.update({ region: region });
var creds = new AWS.Credentials(access_key_id, access_key_secret);

// Create EC2 service object
var ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

var block_device_mapping = [{
    "DeviceName": "/dev/sda1",
    "Ebs": {
        "VolumeSize": volume_size
    }
}]

// Setup instance Parameters
var instance_parameters = {
    ImageId: image_id,
    InstanceType: instance_type,
    KeyName: key_pair,
    MinCount: 1,
    MaxCount: 1,
    SecurityGroupIds: security_group_ids,
    BlockDeviceMappings: block_device_mapping
}

var params = {
    Filters: [
        {
            Name: 'tag:Name',
            Values: [instance_name]
        }
    ]
};

// Call EC2 to retrieve policy for selected bucket
ec2.describeInstances(params, function (err, data) {

    // Write the content of the data into a new variable existing_instance
    var existing_instance = data;
    existing_instance = existing_instance.Reservations[0];

    // If the type of the existing_instance variable is undefined, it means that it cannot find an ec2 instance with that specific name.
    // If it returns a JSON object, it is defined and found an EC2 instance.  
    if (typeof existing_instance !== 'undefined' && existing_instance) {
        //do stuff if query is defined and not null
        console.log("EC2 Instance already exists!")
        console.log("Instance Name: " + instance_name)
        console.log("Instance ID: " + existing_instance.Instances[0].InstanceId)
    }
    else {
        console.log("EC2 Instance does not exist!")
        console.log("Creating new EC2 instance...")

        // Create a promise on an EC2 service object
        var instance_promise = new AWS.EC2({ apiVersion: '2016-11-15' }).runInstances(instance_parameters).promise();
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
                // console.error(err, err.stack);
                core.setFailed(err.message);
            }
        );
    }
});




