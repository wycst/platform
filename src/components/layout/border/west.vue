<template>
    <div class='layout-border-west' :style='{ width : width + "px"}'>
        <slot></slot>
    </div>
</template>

<script>
   export default {
       name  : 'West',
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
.layout-border-west {
    width  : 100%;
    height : 100%;
}
</style>