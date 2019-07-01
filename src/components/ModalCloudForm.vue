<template>
  <div>
    <b-modal :id="id"
      v-model="showModal"  
      class="text-center" 
      size="xl" 
      :title="title" >
     <b-container fluid class='p-0'>
        <!-- =================================================================== -->
        <!-- ========================= STACK NAME ============================== -->
        <!-- =================================================================== -->        
        <b-row class="mb-1">
          <b-col xl='3' lg='3' md='3'>
            Stack Name&nbsp;
            <font-awesome-icon icon="file-prescription"
              v-b-tooltip title="Select an existing canned template"
              class="float-right m-1"
              @click='checkStackName()'/>
            <font-awesome-icon icon="file"
              v-b-tooltip title="Load a local template file"
              class="float-right m-1"
              @click='checkStackName()'/>
            <font-awesome-icon icon="cloud-download-alt"
              v-b-tooltip title="Download and existing AWS stack"
              class="float-right m-1"
              @click='checkStackName()'/>
          </b-col>
          <b-col>
            <b-input v-model='stackName'></b-input>
          </b-col>
        </b-row>
        <!-- =================================================================== -->
        <!-- ========================= SOURCE SELECT ============================== -->
        <!-- =================================================================== -->        
        <b-row class="mb-1">
          <b-col xl='3' lg='3' md='3'>
            Select Source&nbsp;
          </b-col>
          <b-col>
            <b-form-select 
              v-model="sourceSelected"
              :options="sourceOptions"
              @change="loadSourceSelected()">
            </b-form-select> 
          </b-col>
        </b-row>
        <!-- =================================================================== -->
        <!-- ========================= CANNED MODE ============================= -->
        <!-- =================================================================== -->
        <b-row v-if='sourceSelected=="canned"' class="mb-1">
          <b-col xl='3' lg='3' md='3'>
            Template  
            <font-awesome-icon icon="code"
              v-b-tooltip title="Show code"
              class="float-right m-1"
              v-if='template!=""'
              @click='$bvModal.show("ModalTemplateCanned")'/>
            <font-awesome-icon icon="align-justify"
              v-b-tooltip title="Parameters"
              class="float-right m-1"
              v-if='template!=""'
              @click='$bvModal.show("ModalTemplateCanned")'/>
            <font-awesome-icon icon="network-wired"
              v-b-tooltip title="Show Diagram"
              class="float-right m-1"
              v-if='template!=""'
              @click='$bvModal.show("ModalDiagram")'/>
          </b-col>
          <b-col>
            <b-form-select 
              v-model="selectedTemplate"
              :options="optionTemplate"
              @change="loadCannedTemplate()">
            </b-form-select> 
          </b-col>
        </b-row>
        <!-- =================================================================== -->
        <!-- ========================= DOWNLOAD MODE +========================== -->
        <!-- =================================================================== -->
        <b-row v-if='sourceSelected=="aws"' class="mb-1">
          <b-col xl='3' lg='3' md='3'>
            <label>AWS Existing Stacks&nbsp;</label>
          </b-col>
          <b-col>
            <b-form-select 
              v-model="awsTemplateSelected"
              :options="awsTemplateOptions"
              @change="loadAWSTemplate()">
            </b-form-select> 
          </b-col>
        </b-row>
        <!-- =================================================================== -->
        <!-- ========================= FILE MODE =============================== -->
        <!-- =================================================================== -->
        <b-row v-if='sourceSelected=="file"' class="mb-1">
          <b-col xl='3' lg='3' md='3'>
            <label>Load File&nbsp;</label>
            <input type="file" 
              :value="file"
              @change='loadFile'
              ref="fileInput"
              style="display: none;">
            <font-awesome-icon icon="file"
              title="Open File" 
              v-b-tooltip.hover.top
              class="float-right m-1"
              @click='$refs.fileInput.click()'/>&nbsp;
            <font-awesome-icon icon="code"
              title="Show Code"
              v-if='this.template!=""'
              v-b-tooltip.hover.top
              class="float-right m-1"
              @click='$bvModal.show("ModalTemplateFile")'/>&nbsp;
            <font-awesome-icon icon="times"
              title="Reset"
              v-if='template!=""'
              v-b-tooltip.hover.top
              class="float-right m-1"
              @click='reset()'/>&nbsp;
          </b-col>
          <b-col>
            <b-input 
              v-model='currentFileName'
              readonly
              placeholder="Select a cloudformation template file..."
              @click='$refs.fileInput.click()'>
              </b-input>
          </b-col>
        </b-row>
        <!-- =================================================================== -->
        <!-- ========================= EVENTS ================================== -->
        <!-- =================================================================== -->
        <b-row class="mb-1">
          <b-col xl='3' lg='3' md='3'>
            Events&nbsp;
            <font-awesome-icon icon="sync" 
              @click="refreshEvents()" 
              class="float-right m-1"
              v-if='stackName!=""'
              v-b-tooltip title="Pull event logs" /></b-col>
          <b-col>
            <b-textarea :value=events rows=5 readonly></b-textarea>
          </b-col>
        </b-row>
        <!-- =================================================================== -->
        <!-- ========================= OUTPUT ================================== -->
        <!-- =================================================================== -->
        <b-row class="mb-1">
          <b-col xl='3' lg='3' md='3'>
            Output
          </b-col>
          <b-col>
            <b-textarea :value=output rows=5 readonly></b-textarea>
          </b-col>
        </b-row>
      </b-container>
      <!-- =================================================================== -->
      <!-- ========================= MODAL FOOTER ============================ -->
      <!-- =================================================================== -->
      <div slot="modal-footer" class="w-100">
        <p v-if='false' class="float-left text-danger">Status:</p>
        <b-button-group class="float-right">
          <b-button
            v-b-tooltip title="Create CloudFormation stack based on template"
            variant="outline-primary" 
            size="sm" 
            class="float-right" 
            @click="create()">Create
            <b-spinner v-if='stateCreating' small></b-spinner>
          </b-button>
          <b-button 
            v-b-tooltip title="Update CloudFormation stack based on template"
            variant="outline-primary"
            size="sm"
            class="float-right"
            @click="update()">Update
            <b-spinner v-if='stateUpdating' small></b-spinner>
            </b-button>
          <b-button
            variant="outline-primary"
            size="sm"
            class="float-right"
            @click="deleteC()">Delete
            <b-spinner v-if='stateDeleting' small></b-spinner>
          </b-button>
          <b-button variant="outline-primary" size="sm" class="float-right" @click="showModal=false">Close</b-button>          
        </b-button-group>
      </div>
    </b-modal>
    <!-- =================================================================== -->
    <!-- ========================= MODAL HELPERS =========================== -->
    <!-- =================================================================== -->
    <b-modal id="ModalTemplateFile" 
      :title='"Cloudformation Template: "+currentFileName' size="lg">
      <b-row class='m-0'>
        <b-textarea v-model=currentFileText rows=15 spellcheck="false" style="font-family: monospace;" ></b-textarea>
      </b-row>
    </b-modal>
    <b-modal id="ModalTemplateCanned" 
      :title='"Cloudformation Template: "' 
      size="lg">
      <b-row class='m-0'>
        <b-textarea v-model=currentCannedText rows=15 spellcheck="false" style="font-family: monospace;" ></b-textarea>
      </b-row>
    </b-modal>
    <b-modal id="ModalDiagram" 
      title="Cloudformation Diagram" 
      size="lg">
      <b-row class="justify-content-md-center"><img src="/asav.png" style="width: 400px; height: 264px;"></b-row>
    </b-modal>
    <b-modal id="ModalStacks" 
      title="Existing Stacks" 
      size="lg">
      <b-row class="justify-content-md-center">
        {{this.stacks.toString()}}
      </b-row>
    </b-modal>
    <b-modal id="modal-not-yet">This feature is not yet implemented!</b-modal>
  </div>
</template>

<script>
import asav from '!raw-loader!@/assets/asav.yaml' 
import lambda from '!raw-loader!@/assets/lambda.yaml' 
import vpc from '!raw-loader!@/assets/vpc.yaml'
import vpc2 from '!raw-loader!@/assets/vpc2.yaml'

import { getStacks, createStack, updateStack, deleteStack, cFormEvents } from '@/components/cloudform.js'
import {  getCookie } from "./cookies2"
import { readFile } from "./file"
import { setInterval, clearTimeout } from 'timers';
const yaml = require('js-yaml');

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
      refreshTime: 2000,              // Refresh interval for events
      stateCreating: false,
      stateUpdating: false,
      stateDeleting: false,
      stackName: "",
      events: "",
      output: "",
      currentCannedText: "",
      currentFileText: "",
      currentFileName: "",
      showModal: false,
      file: null,
      files: [],
      filesText: "",
      accessKeyId: '',
      secretAccessKey: '',
      AWS: null,
      stacks: [],
      selectedFile: 0,
      cannedTemplates: {
        asav: asav,
        vpc: vpc,
        vpc2: vpc2,
        lambda: lambda
      },
      awsTemplateSelected: null,
      awsTemplateOptions: [
        { value: null, text: 'No AWS Templates found'}
      ],
      sourceSelected: "canned",
      sourceOptions: [
        { value: "canned", text: 'Template from built-in repository'},
        { value: "aws", text: 'Template from live AWS stacks'},
        { value: "file", text: 'Template from local file system'}
      ],
      selectedTemplate: "vpc",
      optionTemplate: [
        { value: "vpc", text: 'Single VPC - 1 subnet'},
        { value: "vpc2", text: 'Single VPC 4 subnets'},
        { value: "asav", text: 'ASAv with a single segment'},
        { value: "lambda", text: 'API Gateway running a Lambda function'}
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
      if ( this.sourceSelected == 'canned'){
        return this.currentCannedText
      }
      else if ( this.sourceSelected == 'file'){
        return this.currentFileText
      }
      else if ( this.sourceSelected == 'aws'){
        return ""
      }
      else {
        return ""
      }
    }
  },    
  methods:{
    awstest(){
      console.log(this.template)
    },
    loadSourceSelected: async function(){
      console.log("LOAD SOURCE:", this.sourceSelected)
      if (this.sourceSelected == "aws"){
        let options = []
        let stacks = await getStacks()
        if (stacks.length > 0){
          console.log(stacks)
          stacks.forEach( stack => {options.push( {value: stack.StackName, text: stack.StackName} )});
          this.awsTemplateSelected = stacks[0].StackName
          this.stackName = stacks[0].StackName
        }else{
          console.log("No stacks found!")
          options = [ { value: null, text: 'No AWS Templates found'} ]
          this.awsTemplateSelected = null
          this.stackName = ""
        }
        this.awsTemplateOptions = options
      }

    },
    async loadAWSTemplate(){
      let stacks = await getStacks()
      console.log("STACKS",stacks)
    },
    async checkStackName(){
      let stacks = await getStacks()
      this.stacks = stacks
      this.$root.$bvModal.show("ModalStacks")
      console.log("STACKS",stacks)
      for (let i= 0 ; i< stacks.length; i++) {
        let cname = stacks[i].StackName
        if( this.stackName == cname) {
          this.events = "Stack already exists"
          return true
        }
      }
      this.events = "Stack name not found"
    },
    refreshEvents: async function () {
      this.events = await cFormEvents(this.stackName).catch((err)=> err.toString() )
    },
    reset: function () {
      this.currentFileName = ""
      this.selectedTemplate = null
      this.currentCannedText = ""
      this.events = ""
      this.output = ""
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
      this.output = ""
      this.events = ""
      this.stateCreating = true
      let refresh = setInterval(() => { this.refreshEvents(); console.log("Refresh events...") }, this.refreshTime);
      createStack(this.stackName,this.template)
      .then((output)=>{
        console.log("CFORM CREATE SUCCESS",output);
        clearTimeout(refresh)
        this.output = output
        this.stateCreating = false
      })
      .catch((err)=>{
        console.log("CFORM CREATE ERROR",err);
        clearTimeout(refresh)
        this.output = err.toString()
        this.stateCreating = false
      })
    },
    update: function(){
      console.log("Create")
      this.output = ""
      this.events = ""
      this.stateUpdating = true
      let refresh = setInterval(() => { this.refreshEvents(); console.log("Refresh events...") }, this.refreshTime);
      updateStack(this.stackName,this.template)
      .then((output)=>{
        console.log("CFORM UPDATE SUCCESS",output);
        clearTimeout(refresh)
        this.output = output
        this.stateUpdating = false
      })
      .catch((err)=>{
        console.log("CFORM UPDATE ERROR",err);
        clearTimeout(refresh)
        this.output = err.toString()
        this.stateUpdating = false
      })
    },
    deleteC: function(){
      console.log("Delete")
      this.output = ""
      this.events = ""
      this.stateDeleting = true
      let refresh = setInterval(() => { this.refreshEvents(); console.log("Refresh events...") }, this.refreshTime);
      deleteStack(this.stackName)
      .then((output)=>{
        console.log("CFORM DELETE SUCCESS",output);
        clearTimeout(refresh)
        this.output = output
        this.stateDeleting = false
      })
      .catch((err)=>{
        console.log("CFORM DELETE ERROR",err);
        clearTimeout(refresh)
        this.output = err.toString()
        this.stateDeleting = false
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
    loadCannedTemplate: function(){
      let text =this.cannedTemplates[this.selectedTemplate]
      try {
        let json = yaml.safeLoad(text);
        json.Parameters.EnvironmentName = {}
        json.Parameters.EnvironmentName.Description = 'AAn environment name that will be prefixed to resource names'
        json.Parameters.EnvironmentName.Type = "String"
        json.Parameters.EnvironmentName.Default = this.stackName ? this.stackName : "NONAMESET"
        if(json.Parameters.KeyPairName){
          json.Parameters.KeyPairName.Description = "Default EC2 Key Pair"
          json.Parameters.KeyPairName.Type = "AWS::EC2::KeyPair::KeyName"
          json.Parameters.KeyPairName.Default = this.$root.settings.keypair ? this.$root.settings.keypair : "NOKEYSET"
        }
        this.currentCannedText = yaml.safeDump(json)   
      } catch (error) {
        console.log("LOAD CANNED ERROR",error)
        this.events = error.toString()
      }
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
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if (modalId == this.id) { 
        this.stackName = getCookie('prefix')
        this.loadCannedTemplate()
      }
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
