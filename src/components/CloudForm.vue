<template>
  <b-container align-h="center">
    <h1>{{title}}</h1>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="stackName" class="m-0" >stackName</label></b-col>
      <b-col><b-input v-model='stackName' id='stackName'></b-input></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="VpcCIDR" class="m-0" >VpcCIDR</label></b-col>
      <b-col><b-input v-model='VpcCIDR' id='VpcCIDR'></b-input></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="PublicSubnet1CIDR" class="m-0" >PublicSubnet1CIDR</label></b-col>
      <b-col><b-input v-model='PublicSubnet1CIDR' id='PublicSubnet1CIDR'></b-input></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="PrivateSubnet1CIDR" class="m-0" >PrivateSubnet1CIDR</label></b-col>
      <b-col><b-input v-model='PrivateSubnet1CIDR' id='PrivateSubnet1CIDR'></b-input></b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right"><label for="output" class="m-0" >Output</label></b-col>
      <b-col>
        <b-textarea readonly rows=5 id='output' v-model="output">
        </b-textarea>              
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right">
        <label for="cFormLog" class="m-0" >cFormLog</label>
      </b-col>
      <b-col>
        <b-textarea readonly rows=5 id='cFormLog' v-model="cFormLog">
        </b-textarea>              
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-left float-left">
        <b-button-group>
          <b-button v-if='false' @click='test' variant='outline-primary'>Test</b-button>
          <b-button @click='create' variant='outline-primary'>Create</b-button>
          <b-button @click='update' variant='outline-primary'>Update</b-button>
          <b-button @click='remove' variant='outline-primary'>Remove</b-button>
          <label 
            class='btn btn-outline-primary mb-0'>Load Files
            <input type="file" multiple :value="file" @change='loadFiles' style="display: none;">
          </label>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-1">
      <b-col class="col-4 text-right">
        <label for="fileList" class="m-0" >File List</label>
        <font-awesome-icon icon="file" />
      </b-col>
      <b-col>
        <b-textarea readonly rows=5 id='fileList' :value="filesText">
        </b-textarea>              
      </b-col>
    </b-row> 

  </b-container>
</template>

<script>
import template from '!raw-loader!@/assets/asav.yaml'
import {createStack, deleteStack, stackOutput } from '@/components/cloudform.js'
import eventHub from '@/components/eventHub.js'
const yaml = require('js-yaml');
let getCookie = require("./cookies.js").getCookie
let path = require('path')


export default {
  name: 'CloudForm',
  props: {
    title: String
  },
  data: function (){
    return {
      region: "",
      bucket: "",
      VpcCIDR: "",
      PrivateSubnet1CIDR: "",
      PublicSubnet1CIDR: "",
      stackName: "ASAVSTACK",
      cFormLog: "",
      output: "",
      files: [],
      file: null,
      fileNames: [],
      filesText: ""
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
    test: async function(){
      console.log("Test3")

    },
    formatNames(files) {
      if (files.length === 1) {
        return files[0].name
      } else {
        return `${files.length} files selected`
      }
    },
    loadFiles: async function(event){
      this.files = event.target.files;
      this.filesText = ""
      for (let index = 0; index < this.files.length; index++) {
        let current = this.files[index].name
        this.filesText += current + "\n" 
      }
    },
    create: function(){
      console.log("Create")
      let json = yaml.safeLoad(template);
      json.Parameters.VpcCIDR.Default= this.VpcCIDR
      json.Parameters.PrivateSubnet1CIDR.Default= this.PrivateSubnet1CIDR
      json.Parameters.PublicSubnet1CIDR.Default= this.PublicSubnet1CIDR
      console.log(json)
      //let newyaml = yaml.safeDump(json)
      let jsontext = JSON.stringify(json, null, 2);
      createStack(this.stackName,jsontext)
      .then((output)=>{
        console.log("CFORM SUCCESS",output);
        this.output = output
      })
      .catch((err)=>{
        eventHub.$emit("cFormEvent",err.toString())
        console.log("CFORM ERROR",err);
      })
    },
    update: function(){
      console.log("Update")
    },
    remove: function(){
      console.log("Delete")
      deleteStack(this.stackName)
    }
  },
  mounted: async function(){
    this.bucket = getCookie("bucket")
    this.region = getCookie("region")
    eventHub.$on('cFormEvent', (event) => {
        console.log("cFormEvent", event)
        this.cFormLog += event + "\n"
    })
    eventHub.$on('cFormEventOverwrite', (event) => {
        console.log("cFormEventOverwrite", event)
        this.cFormLog = event    })
    let json = yaml.safeLoad(template);
    this.VpcCIDR = json.Parameters.VpcCIDR.Default
    this.PrivateSubnet1CIDR = json.Parameters.PrivateSubnet1CIDR.Default
    this.PublicSubnet1CIDR = json.Parameters.PublicSubnet1CIDR.Default
    try {
      let output = await stackOutput(this.stackName)
      this.output = JSON.stringify(output,null,2)
    } catch (error) {
      this.output = error.toString()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
