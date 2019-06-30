
//import eventHub from './eventHub'
import {getCookie} from './cookies2'

export async function createStack(stackName,template){
  let getCookie = require("./cookies.js").getCookie
  let region = getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });

  var cloudformation = new AWS.CloudFormation();

  var params = {
    TemplateBody: template,
    StackName: stackName,
    Capabilities: ['CAPABILITY_NAMED_IAM']
  };
  try {
    await cloudformation.createStack(params).promise()
    let stack = await cloudformation.describeStacks({StackName: stackName}).promise()
    let stackId = stack.Stacks[0].StackId
    let result = await cloudformation.waitFor('stackCreateComplete', {StackName: stackId}).promise()
    let output = JSON.stringify(result['Stacks'][0]['Outputs'][0])
    return output
  } catch (error) {
    return Promise.reject(error)
  }

}

export async function updateStack(stackName,template){
  let getCookie = require("./cookies.js").getCookie
  let region = getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });

  var cloudformation = new AWS.CloudFormation();

  var params = {
    TemplateBody: template,
    StackName: stackName
  };
  try {
    await cloudformation.updateStack(params).promise()
    let stack = await cloudformation.describeStacks({StackName: stackName}).promise()
    let stackId = stack.Stacks[0].StackId
    let result = await cloudformation.waitFor('stackUpdateComplete', {StackName: stackId}).promise()
    let output = JSON.stringify(result['Stacks'][0]['Outputs'][0])
    return output
  } catch (error) {
    return Promise.reject(error)
  }

}

export async function deleteStack(stackName){
  let region = getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });
  var cloudformation = new AWS.CloudFormation(); 
  var params = {
    StackName: stackName
  };

  try {
    let stack = await cloudformation.describeStacks(params).promise()
    let stackId = stack.Stacks[0].StackId
    await cloudformation.deleteStack(params).promise()
    await cloudformation.waitFor('stackDeleteComplete', {StackName: stackId}).promise()
    return("Delete completed");      
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function cFormEvents(stackName){
  let getCookie = require("./cookies.js").getCookie
  let region = getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });
  try {
    var cloudformation = new AWS.CloudFormation(); 
    let event = await cloudformation.describeStackEvents({StackName: stackName}).promise()
    let eventText = ""
    for ( let i = 0 ; i < event.StackEvents.length ; i++){
      let ResourceStatusReason = event.StackEvents[i]['ResourceStatusReason'] ? event.StackEvents[i]['ResourceStatusReason'] : ""
      eventText += event.StackEvents[i]['ResourceType'] + " " + event.StackEvents[i]['ResourceStatus'] + " " + ResourceStatusReason +"\n"
    }
    return eventText  
  } 
  catch (error) {
    return Promise.reject(error)
  }
}

export async function getStacks(){
  let getCookie = require("./cookies.js").getCookie
  let region = getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });
  try {
    let cloudformation = new AWS.CloudFormation(); 
    let response = await cloudformation.describeStacks().promise()
    // for ( let i = 0 ; i < event.StackEvents.length ; i++){
    //   let ResourceStatusReason = event.StackEvents[i]['ResourceStatusReason'] ? event.StackEvents[i]['ResourceStatusReason'] : ""
    //   eventText += event.StackEvents[i]['ResourceType'] + " " + event.StackEvents[i]['ResourceStatus'] + " " + ResourceStatusReason +"\n"
    // }
    return response.Stacks  
  } 
  catch (error) {
    return Promise.reject(error)
  }
}

export async function describeRegions(){
  let getCookie = require("./cookies.js").getCookie
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: "us-east-1",
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });
  try {
    let ec2 = new AWS.EC2()
    let response = await ec2.describeRegions().promise()
    return response.Regions  
  } 
  catch (error) {
    console.log(1,error)
    return Promise.reject(error)
  }
}


export async function describeKeyPairs(regionParam){
  let getCookie = require("./cookies.js").getCookie
  let region = regionParam ? regionParam : getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });
  try {
    let ec2 = new AWS.EC2()
    let response = await ec2.describeKeyPairs().promise()
    // for ( let i = 0 ; i < event.StackEvents.length ; i++){
    //   let ResourceStatusReason = event.StackEvents[i]['ResourceStatusReason'] ? event.StackEvents[i]['ResourceStatusReason'] : ""
    //   eventText += event.StackEvents[i]['ResourceType'] + " " + event.StackEvents[i]['ResourceStatus'] + " " + ResourceStatusReason +"\n"
    // }
    return response.KeyPairs  
  } 
  catch (error) {
    return Promise.reject(error)
  }
}

export async function stackOutput(stackName){
  let getCookie = require("./cookies.js").getCookie
  let region = getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  var AWS = require('aws-sdk');
  AWS.config.update({
    region: region,
    credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
  });

  var cloudformation = new AWS.CloudFormation();

  var params = {
    StackName: stackName
  };

  try {
    let stack = await cloudformation.describeStacks(params).promise()
    let output = stack.Stacks[0].Outputs
    return output
  } catch (error) {
    return Promise.reject(error)
  }

}

export async function dirBucket(bucket){
  console.log("Test")
  let getCookie = require("./cookies.js").getCookie
  let region = getCookie('region')
  let accessKeyId = getCookie('accessKeyId')
  let secretAccessKey = getCookie('secretAccessKey')
  console.log("Test")
      
  var AWS = require('aws-sdk');
  AWS.config.update({accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: region});
  var s3 = new AWS.S3();

  var params = { 
  Bucket: bucket
  // ,
  // Delimiter: '/',
  // Prefix: 's/5469b2f5b4292d22522e84e0/ms.files/'
  }


  try {
    let data = await s3.listObjects(params).promise()
    console.log("OK")
    return data
  } catch (error) {
    console.log("ERROR")
    return Promise.reject(error)
  }

}
