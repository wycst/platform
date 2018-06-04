<template>
   <div>
	 <div :id="domId" class="paperContainer bg" tabindex="1" :style="{width: width + 'px',height: height + 'px'}">
	 </div>
	 <bpmn-setting ref="settingRef"></bpmn-setting>
   </div>
    
</template>

<script>

     // 引入库
    import $ from 'jquery'
    import 'jqueryui'
    import Raphael from 'Raphael'

    // 逻辑处理类（js）
    import FlowDesign from '../libs/flowDesign'
    // 视图核心处理js
    import bpmnUI from '../libs/bpmnUI'
    // 图片&图标
    import bpmnImg from '../libs/bpmnImg'

    // vue
    import bpmnSetting from '../components/BpmnSetting'

    export default {
        name : 'bpmn-design',
        components : {
	    bpmnSetting
	},
	props : {
	    width : {
	       type: Number,
               default: 2000
	    },
	    height : {
	       type: Number,
               default: 2000
	    },
	    displayType : {
	       type: String,
               default: 'edit'
	    }
	},
        data () {
            return {
	       setting : false,
               domId : 'paperContainer'
            }
        },
	computed : {
	},
	mounted () {
           this.init();
	},
	methods : {
	   init() {
 
               let option = {};
               // 如果不是查看，初始化事件
	       if(this.displayType != 'view') {
		    this.initEvent();
                    option = {...{
		        dblclickBlank:(process)=> {
		            this.$refs.settingRef.show();
			},
			dblclickElement:(element,e)=> {
			    this.$refs.settingRef.show();
			},
			clickBlank:(process)=> {
		            this.$refs.settingRef.updateEditData('process',process);
			},
			clickElement:(element,e)=> {
			    this.$refs.settingRef.updateEditData('element',element);
			}
		    }};
	       }
	       // 初始化
	       let paper = this.paper = new Raphael(this.domId);
	       let flowDesign = this.flowDesign = new FlowDesign(paper,option);
	       flowDesign.init();
               
	   },
	   initEvent () {
	      $(".node").draggable({
			appendTo : "#flowdesign",
			containment: [".paperContainer"],
			revert: "invalid",
			helper : "clone",
			zIndex : 9999
	      });

	      let me = this;
	      $(".paperContainer").droppable({
			accept : ".node",
			drop : function(event, ui) {
			    me.handlerDropEvent($(this), ui, event);
			}
	       });
	   },
	   handlerDropEvent(container, ui, event) {
		let x = ui.offset.left - container.offset().left ;
		let y = ui.offset.top - container.offset().top;

		let dragElement = ui.draggable;
		
		let id = ui.draggable.attr("id");
		if (id == "path") {
			let line = createFreeLine(x,y,true);
			//repaintPath(line);
		} else if (dragElement.hasClass("start")) {
			this.flowDesign.createImage(bpmnImg.start, x + 20, y,
					48, 48,"start",true);
		} else if (dragElement.hasClass("end")) {
			this.flowDesign.createImage(bpmnImg.end, x + 20,
					y, 48, 48,"end",true);
		} else if (dragElement.hasClass("diverage")) {
			this.flowDesign.createImage(bpmnImg.diverage, x + 20, y,
					48, 48,"diverage",true);
		} else if (dragElement.hasClass("converge")) {
			this.flowDesign.createImage(bpmnImg.converge, x + 20, y,
					48, 48,"converge",true);
		} else if(dragElement.hasClass("mutiSubprocess")) {
			// 多实例子流程 内嵌子流程
			this.flowDesign.createMutiSubProcess(x, y,
					400, 200,true);
		} else {
			this.flowDesign.createNode(x, y, 100, 50,true);
		}
	   }
	} 
    }
</script>

<style>
  .bg {
      background-image: url('../../../assets/flow/bg.png');
  }
</style>
 
   