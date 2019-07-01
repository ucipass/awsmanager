<template>
  <div id="app">
    <NavBarMain/>
    <AwsUpload v-if='false' title="AWS Upload Files"/>
    <Clock/>

  </div>
</template>

<script>
import AwsUpload from './components/AwsUpload.vue'
import NavBarMain from './components/NavBarMain.vue'
import Clock from './components/Clock.vue'

export default {
  name: 'app',
  components: {
    AwsUpload,NavBarMain,Clock
  },
  mounted: function(){
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

@media (min-width: 850px) {

    .modal-dialog {
      max-width: 800px; 
    }

}



</style>
