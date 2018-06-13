<template>
   <div class='json'>
       <Row class='json-item-row'>
           <template v-for='key in keys'>
	       <Col :span='18/keys.length'><p>{{key}}</p></Col>
	   </template>
	   <Col span='6'>
	        <Button size='small' icon="plus" @click='add'></Button>
	   </Col>
       </Row>
       <template v-for='(row,i) in rows'>
	       <Row class='json-item-row'>
		   <template v-for='key in keys'>
		       <Col :span='18/keys.length'>
		            <Input size='small' :value='row[key]' @input='input(row,key,$event)'/>
		       </Col>
		   </template>
		   <Col span='6'>
		       <Button size='small' icon="minus" @click='del(i)'></Button>
		   </Col>
	       </Row>
       </template>
       <p class='bottom-ops'>
	   <Button size='small' icon="checkmark" @click='sync'>同步</Button>
	   <Button size='small' icon="refresh" @click='reset'>重置</Button>
       </p>
   </div>
</template>

<script>
export default {
     name : 'Json',
     props : {
         dataType : String,
         props : Array,
         data : [Object,Array]
     },
     created() {
         this.initJson();
     },
     data() {
         return {
	    source : this.data,
	    keys : [],
	    rows : []
	 }
     },
     methods : {
         initJson() {
                this.keys.length = 0;
                this.rows.length = 0;
		if (this.dataType == 'object') {
		    // 生成2列 一列为key，一列为value
		    this.keys.push(...['key', 'value']);
		    for (let key in data) {
			this.rows.push({
			    key: key,
			    value: data[key]
			});
		    }
		} else {
		    this.keys.push(...this.props);
		    this.rows.push(...this.data);
		}
	 },
         add() {
	    this.rows.push({});
	 },
	 del(index) {
	    this.rows.splice(index,1);
	 },
	 input(row,key,value) {
	    row[key] = value;
	 },
	 sync() {
	    if(this.dataType == 'object') {
	    } else {
	        this.source.splice(0,this.source.length);
		this.source.push(...this.rows.filter(row => {
		     return Object.keys(row) != [];
		}));
	    }
	 },
	 reset() {
	    
	 }
     },
     watch : {
         data() {
	    this.initJson();
	 }
     }

}
</script>
<style scoped>
  .json .json-item-row { 
      overflow:hidden;
      text-align : center;
      border : 1px #ccc solid;
      border-top : 0px;
  }
  .json .json-item-row:first-child {
      border-top : 1px #ccc solid;
  }
  .json .json-item-row .ivu-col { 
      text-align: center;
      height : 35px;
      padding: 5px;
      padding-left: 10px;
      padding-right: 10px;
      border-left : 1px #ccc solid;
  }
  .json .json-item-row .ivu-col:first-child { 
      border-left : 0px;
  }

  .json .bottom-ops {
      margin-top : 6px;
      margin-bottom : 6px;
  }

</style>