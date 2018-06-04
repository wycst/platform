<template>
   <div>
      <Button @click='update'>update</Button>
      <Button @click='getModify'>getModify</Button>
      <Button @click='commit'>commit</Button>
      <Button @click='reject'>reject</Button>
|
      <Button @click='getPropertys'>getPropertys</Button>

<!--

-->
      <EditableTable data-bindable ref='et' border size="small" :columns="propertyColumns1" :data="elementValues1"></EditableTable>
      <PropertyTable data-bindable ref='pt' border size="small" :propertyColumns="propertyColumns" :propertyValues="elementValues"></PropertyTable>
      
   </div>
   
   
</template>
<script>

    import EditableTable from '@/components/table/EditableTable'
    import PropertyTable from '@/components/table/PropertyTable'
    export default {
        name : 'workflow-instance',
	components : {
	    EditableTable,
	    PropertyTable
	},
	methods : {
	    update() {
	        this.elementValues = [];
	    },
	    getModify() {
	        let modify = this.$refs.pt.getModifyRecords();
		console.log(modify);
	    },
            commit() {
	        this.$refs.pt.commitChanges();
		this.getModify();
	    },
	    reject() {
	        this.$refs.pt.rejectChanges();
		this.getModify();
	    },
	    getPropertys() {
	        console.log(this.$refs.pt.getProperties());
	    }
	},
        data () {
            return {
                propertyColumns: [{
                        title: '名称',
			width : 160,
                        key: 'propertyName'
                    },{
                        title: '值',
                        key: 'propertyValue',
			editor : 'Input'
                    },{
                        title: 'desc',
                        key: 'propertyDesc',
			editor : 'InputNumber'
                    }
                ],
		propertyColumns1: [{
                        title: '名称',
			width : 160,
                        key: 'propertyName'
                    },{
                        title: '值',
                        key: 'propertyValue',
			editor : {
		         type : 'ComboSelect',
			 props: {
				     data:[
					{key : 'teacher1',label : '教师1'},
					{key : 'teacher2',label : '教师2'},
					{key : 'teacher3',label : '教师3'},
					{key : 'teacher4',label : '教师4'},
					{key : 'docker',label : '医生'}
				     ]
				 }
			      },
		      formatter : (v)=> {
		         let selectOptions = [
			        {key : 'teacher1',label : '教师1'},
				{key : 'teacher2',label : '教师2'},
				{key : 'teacher3',label : '教师3'},
				{key : 'teacher4',label : '教师4'},
				{key : 'docker',label : '医生'}
			     ].filter(option=>{
			        if(option.key == v) return v;
			     });
		         return selectOptions[0] ? selectOptions[0].label : v;
		      }
                    },{
                        title: 'desc',
                        key: 'propertyDesc',
			editor : 'InputNumber'
                    }
                ],
		elementValues : [{
		      propertyName : '姓名',
		      propertyValue : 'zhangsan',
		      propertyKey : 'username',
		      propertyDesc : 333
		},{
		      propertyName : '年龄',
		      propertyValue : 18,
		      propertyKey : 'age',
		      editor : 'InputNumber',
		      propertyDesc : 222
		},{
		      propertyName : '职业',
		      propertyValue : 'teacher4',
		      propertyKey : 'job',
		      formatter : (v)=> {
		         let selectOptions = [
			        {key : 'teacher1',label : '教师1'},
				{key : 'teacher2',label : '教师2'},
				{key : 'teacher3',label : '教师3'},
				{key : 'teacher4',label : '教师4'},
				{key : 'docker',label : '医生'}
			     ].filter(option=>{
			        if(option.key == v) return v;
			     });
		         return selectOptions[0] ? selectOptions[0].label : v;
		      },
		      editor : {
		         type : 'ComboSelect',
			 props: {
			     data:[
			        {key : 'teacher1',label : '教师1'},
				{key : 'teacher2',label : '教师2'},
				{key : 'teacher3',label : '教师3'},
				{key : 'teacher4',label : '教师4'},
				{key : 'docker',label : '医生'}
			     ]
			 }
		      },
		      propertyDesc : 222
		},{
		      propertyName : '出生日期',
		      propertyValue : '2018-11-28',
		      propertyKey : 'date',
		      readOnly : true,
		      propertyDesc : 222
		}],

		elementValues1 : [{
		      propertyName : '职业',
		      propertyValue : 'teacher4',
		      propertyKey : 'job',
		      propertyDesc : 222
		}]
            }
        }
    }
</script>
