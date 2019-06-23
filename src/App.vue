<template>
  <div id="app">
    <NavBarMain/>
    <AwsUpload v-if='false' title="AWS Upload Files"/>

  </div>
</template>

<script>
import AwsUpload from './components/AwsUpload.vue'
import NavBarMain from './components/NavBarMain.vue'

export default {
  name: 'app',
  components: {
    AwsUpload,NavBarMain
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
</style>
