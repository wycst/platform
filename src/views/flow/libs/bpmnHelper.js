// 引入jquery
import $ from 'jquery';

 // 引入jqueryUI
import 'jqueryui';

import FlowDesign from '../libs/flowDesign'
import bpmnUI from '../libs/bpmnUI'

import Raphael from 'Raphael'

import startImgSrc from '../img/48/start_event_empty.png'
import bpmnImg from '../libs/bpmnImg'

// 1 对象初始化
// 2 事件初始化
let BpmnHelper = {
    designInstance : null,
    init (containerClass) {
		$(".node").draggable({
			//appendTo : "#contentContainer",
			appendTo : "#flowdesign",
			containment: ["#contentContainer"],
			revert: "invalid",
			helper : "clone",
			zIndex : 9999,
			start : function (event, ui) {
                 //ui.helper.appendTo($("#contentContainer"));
			},
			drag (event, ui) {

			},
		    stop (event, ui) {
			}
		});

        let me = this;
		$("#contentContainer").droppable({
			accept : ".node",
			drop : function(event, ui) {
				me.handlerDropEvent($(this), ui, event);
			}
		});

        // 画板
        let paper = new Raphael("contentContainer");
        this.designInstance = new FlowDesign(paper);
        this.designInstance.init();

	},
	handlerDropEvent(container, ui, event) {

		let x = ui.offset.left - container.offset().left ;
		let y = ui.offset.top - container.offset().top;

		let dragElement = ui.draggable;
		
		var id = ui.draggable.attr("id");
		if (id == "path") {
			let line = createFreeLine(x,y,true);
			repaintPath(line);
		} else if (dragElement.hasClass("start")) {
			this.designInstance.createImage(bpmnImg.start, x + 20, y,
					48, 48,"start",true);
		} else if (dragElement.hasClass("end")) {
        	this.designInstance.createImage(bpmnImg.end, x + 20,
					y, 48, 48,"end",true);
		} else if (dragElement.hasClass("diverage")) {
			this.designInstance.createImage(bpmnImg.diverage, x + 20, y,
					48, 48,"diverage",true);
		} else if (dragElement.hasClass("converge")) {
        	this.designInstance.createImage(bpmnImg.converge, x + 20, y,
					48, 48,"converge",true);
		} else if(dragElement.hasClass("mutiSubprocess")) {
			// 多实例子流程 内嵌子流程
			this.designInstance.createMutiSubProcess(x, y,
					400, 200,true);
		} else {
	        this.designInstance.createNode(x, y, 100, 50,true);
		}
	},
	clearPaper() {
	   // this.bpmnHelper.clearPaper();
	},
    save() {
	   let processData = this.designInstance.getProcessData();
       console.log(processData);
	},
	repaint() {
	   this.designInstance.repaint();
	}

};

export default BpmnHelper;