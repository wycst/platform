<template>
    <div class='layout-border-center' :style='{ width : width + "px"}'>
        <slot></slot>
    </div>
</template>

<script>
   export default {
       name  : 'Center',
       props : {
          width : {
	      type : Number,
	      default : 200
	  }
       },
       data () {
          return {}
       }
   }
</script>

<style scoped>
.layout-border-center {
    width  : 100%;
    height : 100%;
}
</style>