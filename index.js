const core = require('@actions/core');
const exec = require('@actions/exec');
const AWS  = require("aws-sdk");

const os = core.getInput('operating-system').toLowerCase();
const access_key_id = core.getInput('access-key-id');
const access_key_secret = core.getInput('access-key-secret');



async function run(){
    try {
        console.log('Operating System:');
        console.log(os);
    } catch (error) {
        console.log(error.message);
        core.setFailed(error.message);
    }
}

run();