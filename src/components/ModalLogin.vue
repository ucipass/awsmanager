<template>
  <div>
    <b-modal :id="id" class="text-center" :title="title">
        <b-container>
          <b-row align-h="center">
            <b-col class="col-4 text-right"><label for="accessKeyId" class="m-0" >accessKeyId</label></b-col>
            <b-col><b-input v-model='accessKeyId' id='accessKeyId'></b-input></b-col>
          </b-row>
          <b-row align-h="center">
            <b-col class="col-4 text-right"><label for="secretAccessKey" class="m-0" >secretAccessKey</label></b-col>
            <b-col><b-input v-model='secretAccessKey' id='secretAccessKey'></b-input></b-col>
          </b-row>
        </b-container>
        <div slot="modal-footer" class="w-100">
          <p class="float-left text-danger">{{loginError}}</p>
          <p class="float-left"></p>
          <b-button variant="primary" size="sm" class="float-right" @click="login">Login</b-button>
        </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalLogin',
  props: {
    title: {
      default: "Login",
      type: String
    },
    id: {
      default: "ModalLoginId",
      type: String
    }
  },
  data: function(){
    return{
      accessKeyId: '',
      secretAccessKey: '',
      loggedIn: false,
      loginError: ""
    }
  },
  methods:{
    show: function(){
      console.log("accessKeyId",getCookie("accessKeyId"))
      console.log("secretAccessKey",getCookie("secretAccessKey"))
      this.accessKeyId = getCookie("accessKeyId")
      this.secretAccessKey = getCookie("secretAccessKey")
      this.loginError = ""
      this.$bvModal.show(this.id)
    },
    hide: function(){
      this.$bvModal.hide(this.id)
    },
    login: function(){
      this.loginError = ""
      let region = getCookie('region')
      let _this = this

      var AWS = require('aws-sdk');
      AWS.config.update({
        region: region,
        credentials: new AWS.Credentials(this.accessKeyId, this.secretAccessKey)
      });

      var cloudformation = new AWS.CloudFormation(); 
      var params = {
        // NextToken: 'STRING_VALUE',
        // StackName: 'STRING_VALUE'
      };
      cloudformation.describeStacks(params, function(err, data) {
        if (err) {
          console.log("ERROR",err.toString()); // an error occurred
          _this.loginError = err.toString();
          // console.log("STACK", err.stack);
        }
        else{
          _this.loginError = "Login Successful"
          _this.loggedIn = true
          _this.$root.$emit('loginEvent', { loggedIn: _this.loggedIn} )
          setCookie("accessKeyId", _this.accessKeyId,365)
          setCookie("secretAccessKey", _this.secretAccessKey,365)
          console.log(data);           // successful response
          _this.hide();
        }     
      });

    }
  },
  mounted: function () {
    this.$root.$on('showLoginWindow', () => {
        // console.log("Generator", event)
        this.show()
    })
    this.$root.$on('logoutEvent', () => {
        // console.log("Generator", event)
        this.loggedIn = false
    })
  }
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
