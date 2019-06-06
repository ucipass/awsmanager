
import eventHub from './eventHub'

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
    StackName: stackName
  };

  try {
    await cloudformation.createStack(params).promise()
    let stack = await cloudformation.describeStacks({StackName: stackName}).promise()
    let stackId = stack.Stacks[0].StackId

    let ival = setInterval( async ()=>{
      let eventText = await cFormEvents(stackId)
      eventHub.$emit("cFormEventOverwrite", eventText) 
    },2000)

    let result = await cloudformation.waitFor('stackCreateComplete', {StackName: stackId}).promise()
    let output = JSON.stringify(result['Stacks'][0]['Outputs'][0])
    clearInterval(ival)
    return output
  } catch (error) {
    return Promise.reject(error)
  }

}


export async function deleteStack(stackName){
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


  let stack = await cloudformation.describeStacks(params).promise()
  let stackId = stack.Stacks[0].StackId

  try {
    let data = await cloudformation.deleteStack(params).promise()
    let ival = setInterval( async ()=>{
      let eventText = await cFormEvents(stackId)
      eventHub.$emit("cFormEventOverwrite", eventText) 
    },2000)
    await cloudformation.waitFor('stackDeleteComplete', {StackName: stackId}).promise()
    clearInterval(ival)
    return data;      
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
      eventText += event.StackEvents[i]['ResourceType'] + " " + event.StackEvents[i]['ResourceStatus'] +"\n"
    }
    return eventText  
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
