<template>
  <div>
    <b-modal v-model="showModal"  :id="id" class="text-center" size="lg" :title="title" >
     <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">Stack Name</b-col>
          <b-col>
            <b-input v-model='stackName'></b-input>
          </b-col>
        </b-row>
        <b-row v-if='!switchFile' class="mb-1">
          <b-col cols="3">Pick Template </b-col>
          <b-col>
            <b-form-select v-model="selectedTemplate" :options="optionTemplate"></b-form-select>
          </b-col>
        </b-row>
        <b-row v-if='switchFile' class="mb-1">
          <b-col cols="3">
            <label>Load File&nbsp;
              <font-awesome-icon icon="file" />
              <font-awesome-icon icon="file-code" />
              <input type="file" :value="file" @change='loadFile' style="display: none;">
            </label>
          </b-col>
          <b-col>
            <b-input v-model='currentFileName' readonly></b-input>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">Template</b-col>
          <b-col>
            <b-textarea :value=template></b-textarea>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">Events&nbsp;<font-awesome-icon icon="sync" @click="refreshEvents()" /></b-col>
          <b-col>
            <b-textarea :value=events readonly></b-textarea>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">Output</b-col>
          <b-col>
            <b-textarea :value=output readonly></b-textarea>
          </b-col>
        </b-row>
        <b-row v-if='false' class="mb-1">
          <b-col cols="3">Main Template </b-col>
          <b-col>
            <b-form-select v-model="selectedFile" :options="optionFile" @change='pickFile'></b-form-select>
          </b-col>
        </b-row>
      </b-container>
      <div v-if='false' role="tablist">
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-1 variant="outline-primary">Template</b-button>
          </b-card-header>
          <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>I start opened because <code>visible</code> is <code>true</code></b-card-text>
              <b-card-text>{{ text }}</b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-2 variant="outline-primary">Logs</b-button>
          </b-card-header>
          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
              <b-textarea></b-textarea>
          </b-collapse>
        </b-card>
        <b-card no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block href="#" v-b-toggle.accordion-3 variant="outline-primary">Files</b-button>
          </b-card-header>
          <b-collapse id="accordion-3" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>{{ text }}</b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
      <div slot="modal-footer" class="w-100">
        <p v-if='false' class="float-left text-danger">Status:</p>
        <p v-if='false' class="float-left"></p>
        <b-form-checkbox v-model="switchFile" name="check-button" class='d-inline' switch>
          File
        </b-form-checkbox>

        <b-button-group class="float-right">
          <b-button variant="outline-primary" size="sm" class="float-right" @click="create()">Create</b-button>
          <b-button variant="outline-primary" size="sm" class="float-right" @click="awstest()">Update</b-button>
          <b-button variant="outline-primary" size="sm" class="float-right" @click="deleteC()">Delete</b-button>
          <b-button variant="outline-primary" size="sm" class="float-right" @click="showModal=false">Close</b-button>          
        </b-button-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
import asav from '!raw-loader!@/assets/asav.yaml' 
import vpc from '!raw-loader!@/assets/vpc.yaml'
import {createStack, deleteStack, cFormEvents } from '@/components/cloudform.js'
import {  getAWS } from "./cookies2"
import { readFile } from "./file"

let cannedTemplates = {
  asav: asav,
  vpc: vpc
}

export default {
  name: 'ModalTest',
  props: {
    json: {
      type: Object
    },
    title: {
      default: "Login",
      type: String
    },
    id: {
      default: "ModalTestId",
      type: String
    }
  },
  data: function(){
    return{
      stackName: "",
      events: "testevents",
      output: "testouput",
      currentFileText: "",
      currentFileName: "",
      showModal: false,
      file: null,
      files: [],
      filesText: "",
      accessKeyId: '',
      secretAccessKey: '',
      AWS: null,
      selectedFile: 0,
      selectedTemplate: "vpc",
      optionTemplate: [
        { value: "asav", text: 'ASAv with a single segment'},
        { value: "vpc", text: 'Single VPC Test'}
      ],
      optionFile: [
        { value: null, text: 'No file loaded yet...' }
      ],
      pressed: false,
      switchFile: false
    }
  },
  computed:{
    template:  function(){
      if (this.switchFile){
        return this.currentFileText
      }
      else{
        return cannedTemplates[this.selectedTemplate]
      }
    }
  },    
  methods:{
    awstest(){
      console.log(this.template)
    },
    refreshEvents: async function () {
      this.events = await cFormEvents(this.stackName).catch((err)=> err.toString() )
    },
    create: function(){
      console.log("Create")
      // let json = yaml.safeLoad(template);
      // json.Parameters.VpcCIDR.Default= this.VpcCIDR
      // json.Parameters.PrivateSubnet1CIDR.Default= this.PrivateSubnet1CIDR
      // json.Parameters.PublicSubnet1CIDR.Default= this.PublicSubnet1CIDR
      // console.log(json)
      // //let newyaml = yaml.safeDump(json)
      // let jsontext = JSON.stringify(json, null, 2);

      createStack(this.stackName,this.template)
      .then((output)=>{
        console.log("CFORM CREATE SUCCESS",output);
        this.output = output
      })
      .catch((err)=>{
        // eventHub.$emit("cFormEvent",err.toString())
        console.log("CFORM CREATE ERROR",err);
        this.output = err.toString()
      })
    },
    deleteC: function(){
      console.log("Delete")
      deleteStack(this.stackName)
      .then((output)=>{
        console.log("CFORM DELETE SUCCESS",output);
        this.output = output
      })
      .catch((err)=>{
        // eventHub.$emit("cFormEvent",err.toString())
        console.log("CFORM DELETE ERROR",err);
        this.output = err.toString()
      })
    },
    pickFile: async function(){
      console.log(12)
      let index = this.selectedFile
      console.log("index",index)
      let file = this.files[index];
      console.log("file",file)
      this.currentFileText = await readFile(file).catch(()=> "File read error") 
    },
    loadFile: async function(event){
      console.log("NAMNE:",file)
      this.files = event.target.files;
      let file = this.files[0];
      console.log("NAMNE:",file)
      this.currentFileName = file.name
      this.currentFileText = await readFile(file).catch(()=> "File read error") 
    },
    loadFiles: async function(event){
      this.files = event.target.files;
      this.filesText = ""
      this.optionFile = []
      for (let index = 0; index < this.files.length; index++) {
        this.selected = 0;
        let current = this.files[index].name
        this.filesText += current + "\n"         
        this.optionFile.push( { value: index, text: current }   )
      }
      let file = this.files[0];
      this.currentFileText = await readFile(file).catch(()=> "File read error") 
    },
    setJson (payload) {
      this.json = payload
    },    
    show: function(){
      this.loginError = ""
      this.$bvModal.show(this.id)
    },
    hide: function(){
      this.$bvModal.hide(this.id)
    }
  },
  mounted: function () {
    this.$root.$on('showTestWindow', () => {
      // console.log("Generator", event)
      this.AWS = getAWS()
      this.show()
      console.log("JSON",this.json)
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>
