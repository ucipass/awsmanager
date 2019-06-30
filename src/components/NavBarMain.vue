<template>
  <div>
    <b-navbar toggleable="sm" type="dark" variant="dark">
      <b-navbar-brand v-if='false' href="#">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" ></b-navbar-toggle>

      <b-collapse size='lg' id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-dropdown left variant="outline-primary" v-if="loggedIn" text='Menu'>
            <b-dropdown-item v-b-modal.ModalCloudForm>CloudFormation Manager</b-dropdown-item>
            <b-dropdown-item v-b-modal.ModalSettings>Settings</b-dropdown-item>
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
    <b-modal id="modalLogging"  class="text-center" title="Logging">
        <b-container>
          <b-textarea rows=10></b-textarea>
        </b-container>
    </b-modal>

    <ModalLogin id='loginModal'></ModalLogin>
    <ModalSettings id='ModalSettings' title='AWS Default Settings'></ModalSettings>
    <ModalCloudForm id='ModalCloudForm' title='Cloudformation Manager' :json="this.getjson"></ModalCloudForm>
    <ModalTest id='testModal' title='Test' :json="this.getjson"></ModalTest>

  </div>
</template>

<script>
import ModalLogin from './ModalLogin.vue'
import ModalSettings from './ModalSettings.vue'
import ModalCloudForm from './ModalCloudForm.vue'
import ModalTest from './ModalTest.vue'


export default {
  name: 'NavBarMain',
  components: {
    ModalLogin, ModalTest, ModalCloudForm, ModalSettings
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
      loggedIn: false
    }
  },
  methods:{
    testfn: async function(){
      console.log("TEST")
    },
    showLoginWindow(){
      this.$root.$emit('showLoginWindow')
    },
    showTestWindow: function(){
      this.$root.$emit('showTestWindow')
    },
    logout: function(){
      this.$root.$emit('logoutEvent')
      console.log("Logout Event")
    }
  },
  computed:{
    getjson(){
      return{ prefix:this.prefix,region:this.region}
    }
  },
  mounted: async function () {
    this.$root.$on('loginEvent', () => {
        console.log("loginEvent")
        this.loggedIn = true
    })
    this.$root.$on('logoutEvent', () => {
        console.log("logoutEvent")
        this.loggedIn = false
    })




  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
