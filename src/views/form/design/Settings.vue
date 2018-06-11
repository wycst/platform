<style scoped>
.settings {
    height : 100%;
    width : 100%;
}
</style>

<template>
  <div class="settings">
      <FormSetting v-show='designOption.type == "form"'></FormSetting>
      <StateSetting v-show='designOption.type == "state"'></StateSetting>
  </div>
</template>
<script>

import FormSetting from '@/views/form/design/FormSetting.vue'
import StateSetting from '@/views/form/design/StateSetting.vue'

export default {
    name : 'Settings',
    components: {
        StateSetting,
        FormSetting
    },
    data() {
        return {
           
        }
    },
    methods: {
        
    },
    computed: {
        designOption() {
            return this.$store.state.form.designOption;
        }
    }
}

</script>
