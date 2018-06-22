import Vue from 'vue'
Vue.prototype.$eventTarget= Vue.prototype.$eventTarget ||  new Vue({
     methods : {
		 on(eventName,fn) {
		    this.$on(eventName,fn); 
		 },
	     broadcast(eventName,params) {
		    this.$emit(eventName,params);
		 }
	 }
});
Vue.prototype.$layouts= Vue.prototype.$layouts || {};

import ComboSelect from '@/components/select/ComboSelect'
import H5Input from '@/components/input/H5Input'
import PropertyTable from '@/components/table/PropertyTable'
import EditableTable from '@/components/table/EditableTable'
import DynamicRender from '@/components/dynamic/DynamicRender'
import FormDynamicRender from '@/components/dynamic/form/FormDynamicRender'
import JsonStore from '@/components/data/JsonStore'
Vue.component('ComboSelect',ComboSelect)
Vue.component('H5Input',H5Input)
Vue.component('PropertyTable',PropertyTable)
Vue.component('EditableTable',EditableTable)
Vue.component('DynamicRender',DynamicRender)
Vue.component('FormDynamicRender',FormDynamicRender)
Vue.component('JsonStore',JsonStore)

// form
import FormComponent from '@/components/form/FormComponent'
import FormInput from '@/components/form/FormInput'
import FormNumberInput from '@/components/form/FormNumberInput'
import FormComboSelect from '@/components/form/select/FormComboSelect'
import FormDatePicker from '@/components/form/FormDatePicker'
import FormSwitch from '@/components/form/FormSwitch'

//import FormSelect from '@/components/form/FormSelect'
Vue.component('FormComponent',FormComponent)
Vue.component('FormInput',FormInput)
Vue.component('FormNumberInput',FormNumberInput)
Vue.component('FormComboSelect',FormComboSelect)
Vue.component('FormDatePicker',FormDatePicker)
Vue.component('FormSwitch',FormSwitch)

// panel
import Accordion from '@/components/panel/Accordion'
Vue.component('Accordion',Accordion)

