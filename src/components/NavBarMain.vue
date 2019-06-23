<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="dark">
      <b-navbar-brand v-if='false' href="#">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" ></b-navbar-toggle>

      <b-collapse size='lg' id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-dropdown left variant="outline-primary"  text='Menu'>
            <b-dropdown-item v-b-modal.ModalCloudForm>CloudFormation Manager</b-dropdown-item>
            <b-dropdown-item v-b-modal.settings>Settings</b-dropdown-item>
            <b-dropdown-item v-if='false' v-b-modal.modalLogging>Logging</b-dropdown-item>
            <b-dropdown-item v-if='false' @click="test">Test</b-dropdown-item>
          </b-dropdown>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-button variant='outline-primary'         v-if='!loggedIn' @click="showLoginWindow()">Login</b-button>
          <b-button variant='outline-success' v-if='loggedIn' @click="logout()">Logout</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal id="settings" v-model='showSettings' class="text-center" title="Default Settings">
        <b-container>
          <b-row align-h="center">
            <b-col class="col-4 text-right"><label for="prefix" class="m-0" >Common Prefix</label></b-col>
            <b-col><b-input v-model='prefix' id='prefix'></b-input></b-col>
          </b-row>
          <b-row align-h="center">
            <b-col class="col-4 text-right"><label for="region" class="m-0" >AWS Region</label></b-col>
            <b-col>
              <b-form-select v-model="region" :options="regionOptions"></b-form-select>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col class="col-4 text-right"><label for="keypair" class="m-0" >EC2 Key Pair</label></b-col>
            <b-col><b-input v-model='keypair' id='keypair'></b-input></b-col>
          </b-row>
          <b-row align-h="center">
            <b-col class="col-4 text-right"><label for="bucket" class="m-0" >S3 Bucket</label></b-col>
            <b-col><b-input v-model='bucket' id='bucket'></b-input></b-col>
          </b-row>
        </b-container>
        <div slot="modal-footer" class="w-100">
          <p class="float-left"></p>
          <b-button variant="primary" size="sm" class="float-right" @click='setSettings'>OK</b-button>
        </div>
    </b-modal>

    <b-modal id="modalLogging"  class="text-center" title="Logging">
        <b-container>
          <b-textarea rows=10></b-textarea>
        </b-container>
    </b-modal>

    <ModalLogin id='loginModal'></ModalLogin>
    <ModalTest id='testModal' title='Test' :json="this.getjson"></ModalTest>
    <ModalCloudForm id='ModalCloudForm' title='Cloudformation Manager' :json="this.getjson"></ModalCloudForm>
  </div>
</template>

<script>
import ModalLogin from './ModalLogin.vue'
import ModalTest from './ModalTest.vue'
import ModalCloudForm from './ModalCloudForm.vue'
let setCookie = require("./cookies.js").setCookie
let getCookie = require("./cookies.js").getCookie
//import {dirBucket } from '@/components/cloudform.js'



export default {
  name: 'NavBarMain',
  components: {
    ModalLogin, ModalTest, ModalCloudForm
  },
  props: {
    title: {
      default: "Login",
      type: String
    },
    id: {
      default: "NavBarMain",
      type: String
    }
  },
  data: function(){
    return{
      showSettings: false,
      loggedIn: false,
      prefix: "AACF",
      bucket: "AACF_S3",
      region: "us-east-1",
      keypair: "AACF_KP",
      regionOptions:[
          { value: 'us-east-1', text: 'us-east-1' },
          { value: 'us-east-2', text: 'us-east-2' },
          { value: 'us-west-1', text: 'us-west-1' },
          { value: 'us-west-2', text: 'us-west-2' } 
        ]
    }
  },
  methods:{
    setSettings: function(){
      setCookie("keypair", this.keypair,365)
      setCookie("prefix", this.prefix,365)
      setCookie("bucket", this.bucket,365)
      setCookie("region", this.region,365)
      this.$root.settings.prefix = this.prefix
      this.$root.settings.keypair = this.keypair
      this.$root.settings.region = this.region
      this.$root.settings.bucket = this.bucket
      this.$bvModal.hide("settings")
    },
    testfn: function(){
      console.log("TEST")
    },
    showLoginWindow: function(){
      this.$root.$emit('showLoginWindow')
    },
    showTestWindow: function(){
      this.$root.$emit('showTestWindow')
    },
    checkedtmpEvent: function(){
      this.$root.$emit('checkedtmpEvent', this.checkedtmp )
    },
    checkedcsvEvent: function(){
      this.$root.$emit('checkedcsvEvent', this.checkedcsv )
    },
    checkedresultsEvent: function(){
      this.$root.$emit('checkedresultsEvent', this.checkedresults )
    },
    loadExample1Event: function(){
      this.$root.$emit('loadExample1Event', this.checkedtmp )
      console.log("Example")
    },
    logout: function(){
      this.$root.$emit('logoutEvent')
      console.log("Logout Event")
    },
    async test(){
      console.log("test")
      this.showTestWindow()
    }
  },
  computed:{
    getjson(){
      return{ prefix:this.prefix,region:this.region}
    }
  },
  mounted: function () {
    this.$root.$on('loginEvent', (event) => {
        console.log("loginEvent", event)
        this.loggedIn = event.loggedIn
    })
    this.$root.$on('logoutEvent', () => {
        console.log("logoutEvent")
        this.loggedIn = false
    })
    this.prefix = getCookie("prefix") ? getCookie("prefix") : this.prefix
    this.keypair = getCookie("keypair") ? getCookie("keypair") : this.prefix
    this.region = getCookie("region") ? getCookie("region") : this.region
    this.bucket = getCookie("bucket") ? getCookie("bucket") : this.bucket
    if(! this.$root.settings) this.$root.settings = {}
    this.$root.settings.prefix = this.prefix
    this.$root.settings.keypair = this.keypair
    this.$root.settings.region = this.region
    this.$root.settings.bucket = this.bucket
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
