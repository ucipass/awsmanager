<template>
  <div>
    <b-modal :id="id" size="lg" class="text-center" title="Default Settings">
        <b-container>
          <b-row align-h="center">
            <b-col class="col-3 text-right">
              <label for="prefix" class="m-0" >Common Prefix</label>&nbsp;   
            <font-awesome-icon icon="info-circle"
              title="This prefix is used to name all resources created" 
              v-b-tooltip.hover.top
              @click="$bvModal.show('modal-not-yet')"/>           
            </b-col>
            <b-col><b-input v-model='prefix' id='prefix'></b-input></b-col>
          </b-row>
          <b-row align-h="center">
            <b-col class="col-3 text-right">
              <label for="region" class="m-0" >AWS Region</label>&nbsp;   
            <font-awesome-icon icon="info-circle"
              title="Default region where all resources managed" 
              v-b-tooltip.hover.top
              @click="$bvModal.show('modal-not-yet')"/>    
            </b-col>
            <b-col>
              <b-form-select 
                v-model="region"
                @change="keyPairFill()"
                :options="regionOptions">
              </b-form-select>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col class="col-3 text-right">
              <label for="keypair" class="m-0" >EC2 Key Pair</label>&nbsp;   
            <font-awesome-icon icon="info-circle"
              title="Default key pair used for EC2 authentication" 
              v-b-tooltip.hover.top
            />&nbsp;   
            <font-awesome-icon icon="check"
              title="Check if key pair is valid" 
              v-b-tooltip.hover.top
              @click="$bvModal.show('modal-picker-keys')"/>&nbsp;
            </b-col>
            <b-col>
              <b-form-select v-model="keypair" :options="keypairOptions"></b-form-select>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col class="col-3 text-right">
              <label for="bucket" class="m-0" >S3 Bucket</label>&nbsp;   
            <font-awesome-icon icon="info-circle"
              title="S3 bucket used to store files(keys)" 
              v-b-tooltip.hover.top
              @click="$bvModal.show('modal-not-yet')"/>    
            </b-col>
            <b-col><b-input v-model='bucket' id='bucket'></b-input></b-col>
          </b-row>
        </b-container>
        <div slot="modal-footer" class="w-100">
          <p class="float-left"></p>
          <b-button variant="primary" size="sm" class="float-right" @click='setSettings'>OK</b-button>
        </div>
    </b-modal>

    <b-modal id="modal-not-yet">This feature is not yet implemented!</b-modal>

    <b-modal id="modal-picker-keys">Pick your existing key Pair</b-modal>
  </div>
</template>

<script>
import { getCookie, setCookie } from '@/components/cookies2.js'
import { describeKeyPairs, describeRegions } from '@/components/cloudform.js'

export default {
  name: 'ModalSettings',
  props: {
    title: {
      default: "Settings",
      type: String
    },
    id: {
      default: "ModalSettings",
      type: String
    }
  },
  data: function(){
    return{    
      loggedIn: false,
      prefix: "AACF",
      bucket: "AACF_S3",
      keypair: null,
      keypairOptions: [ ],
      region: "us-east-1",
      regionOptions:[ ]
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
      this.$bvModal.hide(this.id)
    },
    keyPairFill: async function(){
      console.log("Region Change caused key change")
      let keys = await describeKeyPairs(this.region)
      let AWSKeyNames = keys.map( (item)=> item.KeyName)
      let AWSKeypairOptions = keys.map( (item)=> {
        let json = { value: item.KeyName, text: item.KeyName }
        return json;
      })

      this.keypairOptions = AWSKeypairOptions
      if( AWSKeyNames.includes(this.keypair)){
        console.log("OLD KEY MATCH FOUND!")
      } else if (AWSKeyNames.length == 0){
        console.log("NO KEYS FOUND!")
      }else{
        console.log("OLD KEY NOT FOUND! USING FIRST AVAILABLE!")
        this.keypair = AWSKeyNames[0]
        this.$root.settings.keypair = this.keypair
      }
    },
    regionFill: async function(){
      let regions = await describeRegions()
      let AWSRegionOptions = regions.map( (item)=> {
        let json = { value: item.RegionName, text: item.RegionName }
        return json;
      })
      this.regionOptions = AWSRegionOptions
    }
  },
  mounted: function () {
    this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
      if (modalId == this.id) { 
        this.regionOptions = this.$root.settings.regionOptions
        // RETRIEVE OLD SETTINGS
        this.prefix = getCookie("prefix") ? getCookie("prefix") : this.prefix
        this.keypair = getCookie("keypair") ? getCookie("keypair") : this.prefix
        this.region = getCookie("region") ? getCookie("region") : this.region
        this.bucket = getCookie("bucket") ? getCookie("bucket") : this.bucket
        if(! this.$root.settings) this.$root.settings = {}
        this.$root.settings.prefix = this.prefix
        this.$root.settings.keypair = this.keypair
        this.$root.settings.region = this.region
        this.$root.settings.bucket = this.bucket
        this.keyPairFill()
      }

    })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
