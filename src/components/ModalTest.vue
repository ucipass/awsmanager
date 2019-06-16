<template>
  <div>
    <b-modal :id="id" class="text-center" size="lg" :title="title">
     <b-container fluid>
        <b-row class="mb-1 text-center">
          <b-col cols="3"></b-col>
          <b-col>Parameters</b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">Template Name</b-col>
          <b-col>
            <b-input></b-input>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">Template</b-col>
          <b-col>
            <b-textarea></b-textarea>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">Logs</b-col>
          <b-col>
            <b-textarea></b-textarea>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">Status</b-col>
          <b-col>
            <b-input></b-input>
          </b-col>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <p class="float-left text-danger">Status:</p>
        <p class="float-left"></p>
        <b-button-group class="float-right">
          <b-button variant="outline-primary" size="sm" class="float-right">Upload</b-button>
          <b-button variant="outline-primary" size="sm" class="float-right">Create</b-button>
          <b-button variant="outline-primary" size="sm" class="float-right">Update</b-button>
          <b-button variant="outline-primary" size="sm" class="float-right">Delete</b-button>
          <b-button variant="outline-primary" size="sm" class="float-right">Cancel</b-button>          
        </b-button-group>
      </div>
      <div role="tablist">
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
    </b-modal>
  </div>
</template>

<script>
import { getCookie, setCookie, getAWS } from "./cookies2"
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
      accessKeyId: '',
      secretAccessKey: '',
      AWS: null
    }
  },
  methods:{
    awstest(){
      console.log(1111)
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
