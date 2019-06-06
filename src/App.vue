<template>
  <div id="app">
    <NavBarMain/>
    <AwsUpload v-if='false' title="AWS Upload Files"/>
    <CloudForm  v-if='true' title="CloudFormation ASAv"/>

  </div>
</template>

<script>
import AwsUpload from './components/AwsUpload.vue'
import CloudForm from './components/CloudForm.vue'
import NavBarMain from './components/NavBarMain.vue'

export default {
  name: 'app',
  components: {
    AwsUpload,NavBarMain,CloudForm
  },
  mounted: function(){
    // let region = 'us-east-1'
    // let accessKeyId = 'AKIAJ74V4EMMNOD52DXQ'
    // let secretAccessKey = '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'
    // // eslint-disable-next-line no-console
    // console.log("APP STARTED!" )
    // var AWS = require('aws-sdk');
    


    // AWS.config.update({
    //   region: region,
    //   credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
    // });

    // var params = {
    //     StackName: 'TESTSTACK', /* required */
    //     TemplateBody: `Resources:
    //     VPC:
    //       Type: AWS::EC2::VPC
    //       Properties:
    //         CidrBlock: "172.18.0.0/16" 
    //         EnableDnsSupport: true
    //         EnableDnsHostnames: true
    //         Tags:
    //           - Key: Name
    //             Value: "TESTVPC"`
    //   };
    // var cloudformation = new AWS.CloudFormation(); 
    // cloudformation.createStack(params, function(err, data) {
    //     if (err) console.log(err, err.stack); // an error occurred
    //     else     console.log(data);           // successful response
    //   });
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
