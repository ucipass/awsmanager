<template>
  <b-container align-h="center">
    <h1>{{title}}</h1>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="files" class="m-0" >Local Files</label></b-col>
      <b-col><b-form-file directory multiple plain id='files' v-model="files"></b-form-file></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="pathPrefix" class="m-0" >AWS S3 Path</label></b-col>
      <b-col><b-input v-model='pathPrefix' id='pathPrefix'></b-input></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="fileList" class="m-0" >AWS S3 Keys</label></b-col>
      <b-col>
        <b-textarea readonly rows=5 id='fileList' v-model="fileList">
        </b-textarea>              
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="region" class="m-0" >region</label></b-col>
      <b-col><b-input readonly v-model='region' id='region'></b-input></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="bucket" class="m-0" >bucket</label></b-col>
      <b-col><b-input readonly v-model='bucket' id='bucket'></b-input></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><b-button @click='start' variant='primary'>Start</b-button></b-col>
    </b-row>

  </b-container>
</template>

<script>
let getCookie = require("./cookies.js").getCookie
let path = require('path')
export default {
  name: 'AwsUpload',
  props: {
    title: String
  },
  data: function (){
    return {
      region: "",
      bucket: "123",
      pathPrefix: ".",
      stackName: "",
      files: []
    }
  },
  computed: {
    fileList: function(){
      let output = ""
      this.files.forEach(file => {
        output += path.join( this.pathPrefix, file.name) + "\n"
      });
      return output
    },
    s3url: function(){
      return path.join(this.bucket,this.region,"s3.aws.amazon.com")
    }
  },
  methods: {
    start: function(){
      console.log("START")
    }
  },
  mounted: function(){
    this.bucket = getCookie("bucket")
    this.region = getCookie("region")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
