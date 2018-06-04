<template>
  <div id="app" class="app-main">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
     let that = this;
     window.onresize = function(){
	 console.log(" window resize trigged ... ");
	 that.$store.commit('setDocumentBodyClientSize');
     }
     that.$store.commit('setDocumentBodyClientSize');
  }
}
</script>

<style>
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}
.app-main{
    width: 100%;
    height: 100%;
}
</style>