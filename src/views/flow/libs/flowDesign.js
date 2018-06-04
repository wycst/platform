// 定义一些常量
var DESIGN_SETTINGS = {
    defaultLinkName : '',
    defaultNodeName : '任务名称',
    defaultMutiSubProcessName : '子流程',
    defaultNodeBackgroundColor : '#FCFCDD',
    defaultRuleNodeName : '规则名称',
    defaultServiceName : '服务名称',
    defaultServiceGroupName : '服务组',
    defaultRuleNodeBackgroundColor : 'white'
};
$(function() {
	let noop = function(e){
		if(['INPUT','TEXTAREA'].indexOf(e.target.tagName) > -1) {
		    return true;
		}
		return false;
	};
	document.body.onselectstart = noop;
	//document.body.ondrag = noop;
});

if(!Object.getOwnPropertyNames) {
	Object.getOwnPropertyNames = function (obj) {
		if(obj) {
			var propertyNames = [];
			for (var i in obj) {
				propertyNames.push(i);
			}
			return propertyNames;
		}
		return [];
	};
}

import $ from 'jquery'
import Raphael from 'Raphael'
// import '../libs/raphael.inline_text_editing'
import bpmnImg from '../libs/bpmnImg'
// 视图核心处理js
import bpmnUI from '../libs/bpmnUI'

class FlowDesign {
    // 构造器
	constructor(paper,option) {
		this.classId = 'FlowDesign[' + this.getUUID() + '@1.1.1]';
		this.designMode = 'bpmn2';
        this.selectElement = null;
        this.activeFromElement = null;
        this.paper = paper;
		this.initProcess();
        this.idPond = [];
        this.option = {...option};
    };
	initProcess() {
		this.process = {
			processType : "workflow",
		    properties  : {
			    processName : '这是一个测试流程',
				processCode : 'testProcess',
			    editDesc : '流程描述信息',
				version     : '1.0'
			},
			elements    : {},
			containers  : {}
		};
	};
	init () {
		 // 鼠标点击空地隐藏
		let me = this;
		$(me.paper.canvas).click(function(e) {
			let selectElement = me.selectElement;
			if (selectElement) {
				 if(selectElement.data("editing")) {
					 selectElement.removeData("editing");
				 } else {
				     // hideEditElements(selectElement);
				     me.unSelectAll();
				 }
			} 
			if(me.activeFromElement) {
				me.activeFromElement = null;
			}

            me.option.clickBlank && me.option.clickBlank(me.process);

		});
		$(me.paper.canvas).contextmenu(function(){
			return false;
		});

        $(me.paper.canvas).dblclick(()=>{
		    me.option.dblclickBlank(me.process);
		});

        // 监听键盘的delete事件
		$(document).keydown((e)=>{
			if (e.keyCode == 46) { 
				me.delSelectElement();
			} else if(e.keyCode == 8) {
				let active = $(document.activeElement);
				if(active.attr("readonly") == "readonly") {
					return false;
				}
			}
		});

	    // 初始化处理新建和编辑流程的数据初始化
	    //initPaper();
	    
	    // 初始化属性面板
		//initProcessPropertyTable();
		
	    // 设置属性面板内容默认显示流程的属性
		//changePropertys(2,paper);
	    
	    // 给tabs绑定事件
	    /* $("#tabs").tabs({
	    	onSelect : function (title,index) {
	    		if(index == 1) {
	    			_toBpmn();
	    		}
	    	}
	    });*/
	    
		// 解决document初次加载完成，第一次必须要点击一次页面才会触发按键的onkeydown
		// 原因document没有获取焦点
	    // $(me.paper.canvas).parent().focus().blur();

	};
	getUUID() {
		return Raphael.createUUID();
	};
	setDesignMode(designMode) {
		this.designMode = designMode;
	};
	getDesignMode() {
	    return this.designMode;
	};
	getCoordinate(x1, y1, x2, y2, x) {
		if (x2 == x1) {
            alert("call getCoordinate error for x2 == x1");
			return ;
		}
		return x * (y2 - y1) / (x2 - x1) + (y1 * x2 - y2 * x1) / (x2 - x1);
	};
	getLinePathData(raphaelElementStart, raphaelElementEnd, arrow) {

		let pathData = {};
		let pathD = "";

		let startX = raphaelElementStart.attr("x") - 5;
		let startY = raphaelElementStart.attr("y") - 5;
		let startWidth = raphaelElementStart.attr("width") + 10;
		let startHeight = raphaelElementStart.attr("height") + 10;

		let endX = raphaelElementEnd.attr("x") - 5;
		let endY = raphaelElementEnd.attr("y") - 5;
		let endWidth = raphaelElementEnd.attr("width") + 10;
		let endHeight = raphaelElementEnd.attr("height") + 10;

		// 计算2个重心连接与2个元素的交点 一共4个交点（分8中情况，8个方位）
		let startCenterX = startX + startWidth / 2;
		let startCenterY = startY + startHeight / 2;

		let endCenterX = endX + endWidth / 2;
		let endCenterY = endY + endHeight / 2;
		
		let pathStart = {} ;
		let pathEnd = {};
		if(endCenterX < startCenterX && endCenterY < startCenterY) {
			
			let horizontalStartPoint = {};
			horizontalStartPoint.y = startY;
			horizontalStartPoint.x = 
				this.getCoordinate(startCenterY,startCenterX,endCenterY,endCenterX,horizontalStartPoint.y);
			
			if(horizontalStartPoint.x >= startX) {
				pathStart = horizontalStartPoint;
			} else {
				let verticalStartPoint = {};
				verticalStartPoint.x =  startX;
				verticalStartPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalStartPoint.x);
				pathStart = verticalStartPoint;
			}
				
			let horizontalEndPoint = {}; 
			horizontalEndPoint.y = endY + endHeight;
			horizontalEndPoint.x = this.getCoordinate(startCenterY, startCenterX,
					endCenterY, endCenterX, horizontalEndPoint.y);
			if(horizontalEndPoint.x >= endX && horizontalEndPoint.x <= endX + endWidth) {
				pathEnd = horizontalEndPoint;
			} else {
				let verticalEndPoint = {};
				verticalEndPoint.x = endX + endWidth;
				verticalEndPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalEndPoint.x);
				pathEnd = verticalEndPoint;
			}
			
		} else if(endCenterX < startCenterX && endCenterY == startCenterY) {
			
			pathStart.x = startX;
			pathStart.y = startCenterY;
			
			pathEnd.x = endX + endWidth;
			pathEnd.y = endCenterY;
			
		} else if(endCenterX < startCenterX && endCenterY > startCenterY) {
			
			let horizontalStartPoint = {};
			horizontalStartPoint.y = startY + startHeight;
			horizontalStartPoint.x = 
				this.getCoordinate(startCenterY,startCenterX,endCenterY,endCenterX,horizontalStartPoint.y);
			
			if(horizontalStartPoint.x >= startX) {
				pathStart = horizontalStartPoint;
			} else {
				let verticalStartPoint = {};
				verticalStartPoint.x =  startX;
				verticalStartPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalStartPoint.x);
				pathStart = verticalStartPoint;
			}
				
			let horizontalEndPoint = {}; 
			horizontalEndPoint.y = endY;
			horizontalEndPoint.x = this.getCoordinate(startCenterY, startCenterX,
					endCenterY, endCenterX, horizontalEndPoint.y);
			if(horizontalEndPoint.x >= endX && horizontalEndPoint.x <= endX + endWidth) {
				pathEnd = horizontalEndPoint;
			} else {
				let verticalEndPoint = {};
				verticalEndPoint.x = endX + endWidth;
				verticalEndPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalEndPoint.x);
				pathEnd = verticalEndPoint;
			}

		} else if(endCenterX == startCenterX && endCenterY < startCenterY) {
			
			pathStart.x = startCenterX;
			pathStart.y = startY;
			
			pathEnd.x = endCenterX;
			pathEnd.y = endY + endHeight;
			
		} else if(endCenterX == startCenterX && endCenterY > startCenterY) {
			
			pathStart.x = startCenterX;
			pathStart.y = startY + startHeight;
			
			pathEnd.x = endCenterX;
			pathEnd.y = endY;
			
		} else if(endCenterX > startCenterX && endCenterY < startCenterY) {
			
			let horizontalStartPoint = {};
			horizontalStartPoint.y = startY ;
			horizontalStartPoint.x = 
				this.getCoordinate(startCenterY,startCenterX,endCenterY,endCenterX,horizontalStartPoint.y);
			
			if(horizontalStartPoint.x <= startX + startWidth ) {
				pathStart = horizontalStartPoint;
			} else {
				let verticalStartPoint = {};
				verticalStartPoint.x =  startX + startWidth;
				verticalStartPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalStartPoint.x);
				pathStart = verticalStartPoint;
			}
				
			let horizontalEndPoint = {}; 
			horizontalEndPoint.y = endY + endHeight;
			horizontalEndPoint.x = this.getCoordinate(startCenterY, startCenterX,
					endCenterY, endCenterX, horizontalEndPoint.y);
			if(horizontalEndPoint.x >= endX) {
				pathEnd = horizontalEndPoint;
			} else {
				let verticalEndPoint = {};
				verticalEndPoint.x = endX;
				verticalEndPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalEndPoint.x);
				pathEnd = verticalEndPoint;
			}
			
			
		} else if(endCenterX > startCenterX && endCenterY == startCenterY) {
			
			pathStart.x = startX + startWidth;
			pathStart.y = endCenterY;
			
			pathEnd.x = endX;
			pathEnd.y = endCenterY;
			
		} else {
			// endCenterX > startCenterX && endCenterY > startCenterY
			let horizontalStartPoint = {};
			horizontalStartPoint.y = startY + startHeight;
			horizontalStartPoint.x = 
				this.getCoordinate(startCenterY,startCenterX,endCenterY,endCenterX,horizontalStartPoint.y);
			
			if(horizontalStartPoint.x <= startX + startWidth ) {
				pathStart = horizontalStartPoint;
			} else {
				let verticalStartPoint = {};
				verticalStartPoint.x =  startX + startWidth;
				verticalStartPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalStartPoint.x);
				pathStart = verticalStartPoint;
			}
				
			let horizontalEndPoint = {}; 
			horizontalEndPoint.y = endY ;
			horizontalEndPoint.x = this.getCoordinate(startCenterY, startCenterX,
					endCenterY, endCenterX, horizontalEndPoint.y);
			if(horizontalEndPoint.x >= endX) {
				pathEnd = horizontalEndPoint;
			} else {
				let verticalEndPoint = {};
				verticalEndPoint.x = endX;
				verticalEndPoint.y = this.getCoordinate(startCenterX, startCenterY,
						endCenterX, endCenterY, verticalEndPoint.x);
				pathEnd = verticalEndPoint;
			}
		} 
		
		pathD += "M" + pathStart.x + "," + pathStart.y;
		pathD += "L" + pathEnd.x + "," + pathEnd.y;

		// 箭头处理
		if (arrow) {
			let x3 = pathEnd.x,y3 = pathEnd.y,Par = 10.0,slopy = Math.atan2((pathStart.y - pathEnd.y),
					(pathStart.x - pathEnd.x)),cosy = Math.cos(slopy),siny = Math.sin(slopy);

			pathD += " L" + (Number(x3) + Number(Par * cosy - (Par / 2.0 * siny)))
					+ "," + (Number(y3) + Number(Par * siny + (Par / 2.0 * cosy)));

			pathD += " L"
					+ (Number(x3) + Number(Par * cosy + Par / 2.0 * siny) + "," + (Number(y3) - Number(Par
							/ 2.0 * cosy - Par * siny)));
			pathD += " L" + x3 + "," + y3;
		}
		pathData.data = pathD;
		pathData.start = pathStart;
		pathData.end = pathEnd;
		return pathData;
	};
    distanceFromPointToLine(x0,y0,x1,y1,x2,y2) {
		// 求3个边长
		let a = Math.sqrt((x0-x1) * (x0-x1) + (y0-y1) * (y0-y1));
		let b = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
		let c = Math.sqrt((x2-x0) * (x2-x0) + (y2-y0) * (y2-y0));
		// 根据海伦公式求3个点围成的面积
		// S=√[p(p-a)(p-b)(p-c)]
		let halfP = (a + b + c) / 2;
		let s =  Math.sqrt(halfP * (halfP - a) * (halfP - b) * (halfP - c));
		let h = 2*s/b;
		return h;
	};
	unBindMouseOverOutEvent(targetElement) {
		let type = targetElement.type;
		if(type == "rect" || type == "image") {
			targetElement.unmouseover();
			targetElement.unmouseout();
		}
	};
	delSelectElement() {
		if(this.selectElement) {
			this.removeElement(this.selectElement);
		}
	};
	removeElement(targetElement) {
	
		let type = targetElement.type;
		let dataObject = targetElement.data();
		if(type == "rect" || type == "image") {
			// 元素，注意需要移除关联的连线
			for ( let i in dataObject) {
				let dataProp = dataObject[i];
				if(i != "container") {
					dataProp && dataProp.remove && dataProp.remove();
				}
				if((i == "in" || i == "out") && dataProp && dataProp instanceof Object){
					for (var i in dataProp) {
						this.removeElement(dataProp[i]);
						delete dataProp[i];
					}
				}
			}
			// 解绑鼠标移除事件
			this.unBindMouseOverOutEvent(targetElement);
			let elementId = targetElement.id;
			
			// 删除元素时与子流程有关的需要特殊解除关系
			let dataType = dataObject["type"];
			let container = dataObject["container"];
			if(dataType == "mutiSubProcess" || dataType == "serviceGroup") {
				// 删除的是容器，获取所有的子节点先删除
				let containerObj = this.process.containers[targetElement.id];
				let childElements = containerObj.elements;
				for (let i in childElements) {
					let childElement = childElements[i];
					this.removeElement(childElement);
				}
				this.removeContainer(containerObj);
			} else {
				this.unregisterElement(elementId);
			}
			// 如果删除的元素时包含在container里面的子节点，解除关系
			if(container) {
				// 解除关系
				this.unbindElementFromContainer(targetElement,container);
			}
			// 最后删除元素
			targetElement.remove();
			
		} else if(type == "path") {
			// 连线 ，移除箭头及连线中的矩形
			// 移除元素关系
			
			let fromElement = targetElement.data("from");
			let toElement = targetElement.data("to");
			
			if(fromElement && fromElement.data("out")) {
				let outLines = fromElement.data("out");
				delete outLines[targetElement.id];
			}
			
			if(toElement && toElement.data("in")) {
				let inLines = toElement.data("in");
				delete inLines[targetElement.id];
			}
			
			let startElement = targetElement.data("start");
			let nextElement = startElement.data("right");
			startElement.remove();
			while(nextElement) {
				let temp = nextElement;
				let leftRect = temp.data("leftRect");
				leftRect.undrag();
				leftRect.remove();
				nextElement = nextElement.data("right");
				temp.undrag();
				temp.remove();
			}
			targetElement.data("arrow").remove();
			targetElement.data("pathText").remove();
			
			let elementId = targetElement.id;
			targetElement.remove();
			this.unregisterElement(elementId);
			
		} else {
			
		}
	};
    unSelectAll() {
	   let selectElement = this.selectElement;
	   if(selectElement) {
	      this.hideEditElements(selectElement);
		  this.selectElement = null;
	   }
	};
    bindSelectEvent(targetElement) {
		// 添加单击事件
		let me = this;
		targetElement.click(function (e) {
			
			let elementType = targetElement.type;
			let selectElement = me.selectElement;
			if(selectElement) {
				me.hideEditElements(selectElement);
			}
			me.showEditElements(me.selectElement = targetElement);
			// 阻止冒泡
			e.stopPropagation();
			
			if(elementType != "path") {
				let activeFromElement = me.activeFromElement;
				if(activeFromElement && activeFromElement != targetElement){
					// 创建activeFromElement-->targetElement的连线
					me.createLink(activeFromElement,targetElement);
					me.activeFromElement = null;
					return ;
				}
			}
			
			if(elementType == "rect") {
			//	changePropertys(1,targetElement);
			} else if(elementType == "path") {
			//	changePropertys(3,targetElement);
			    
			} else if(elementType == "image") {
			/*	var dataType = targetElement.data("type");
				if(dataType == "diverage" || dataType == "converge") {
					changePropertys(4,targetElement);
				} else if(dataType == "start" || dataType == "end") {
					changePropertys(5,targetElement);
				}*/
			}

            me.option.clickElement && me.option.clickElement(targetElement,e);

		});
		
        if(targetElement.data('text')) {
		    targetElement.data('text').click(function(e) {
				me.option.clickElement && me.option.clickElement(targetElement,e);
				e.stopPropagation();
			});
			targetElement.data('text').dblclick(function(e) {
				me.option.dblclickElement && me.option.dblclickElement(targetElement,e);
				e.stopPropagation();
			});
		}

	    // 添加右键事件
		/*
		$(targetElement.node).contextMenu && $(targetElement.node).contextMenu(getContextMenuFn(targetElement),{
			isStatic : false
		});*/
        
        targetElement.dblclick(function (e) {
		     me.option.dblclickElement && me.option.dblclickElement(targetElement,e);
			 e.stopPropagation();
		});


	};
	bindMouseOverOutEvent(targetElement) {
		let type = targetElement.type;
		let me = this;
		if(type == "rect" || type == "image") {
			targetElement.mouseover(function () {
				me.dropNode = null;
				// 如果存在拖动中的的连线，存在显示接收
				if(!me.dragingLine) {
					return ;
				}
				this.data("showDropRect")();
				me.dropNode = this;
			}).mouseout(function () {
				this.data("hideDropRect")();
				this.attr("cursor", "default");
				me.dropNode = null;
			});
		}
	};
	beginCreateLink(targetElement) {
		if(this.selectElement && this.selectElement != targetElement) {
			this.hideEditElements(this.selectElement);
		}
		this.showEditElements(selectElement = targetElement);
		// 设置激活状态
		this.activeFromElement = targetElement;
		this.showFadeOutText("点击节点完成连线,空白区域取消！");
    };
    showFadeOutText(text,color) {
		alert(text);
	};
    createLink(activeFromElement,targetElement) {
	
		if(activeFromElement == targetElement) {
			this.showFadeOutText("不能自连接","red");
			return ;
		}
		// 校验
		let sameContainer = activeFromElement.data("container") == targetElement.data("container");
		if(!sameContainer) {
			this.showFadeOutText("不在同一个容器不能相连","red");
			return ;
		}
		let fromDateType = activeFromElement.data("type");
		let toDateType = targetElement.data("type");
		// 开始节点只能单出
		if(toDateType == "start") {
			this.showFadeOutText("开始节点不能作为目的节点","red");
			return ;
		}
		// 判断from和to2个点之间是否已经存在了连线 
		// 遍历from的out即可
		let outLines =  activeFromElement.data("out") ;
		if(outLines) {
			for (var i in outLines) {
				let outLine = outLines[i];
				let tempToElement = outLine.data("to");
				if(tempToElement == targetElement) {
					// 已存在
					this.showFadeOutText("连线已存在","red");
					return  ;
				}
			}
		}
		let useBpmn2 = this.designMode != "open";
		// 如果使用的bpmn2模式校验分支及单进单出
		if(useBpmn2) {
			// 除去分支节点外，其他节点只能单出
			if(fromDateType != "diverage") {
				let outLines = activeFromElement.data("out");
				let len = 0 || (outLines && Object.getOwnPropertyNames(outLines).length);
				if(len > 0) {
					this.showFadeOutText("非分支节点只能单出","red");
					return ;
				}
			}
			if(toDateType != "converge") {
				let inLines = targetElement.data("in");
				let len = 0 || (inLines && Object.getOwnPropertyNames(inLines).length);
				if(len > 0) {
					this.showFadeOutText("非聚合节点只能单进","red");
					return  ;
				}
			}
		}
		this.createPath(activeFromElement,targetElement);
		return true;
	};

    getContextMenuFn(targetElement) {
		let elementType = targetElement.type;
		let dataType = targetElement.data("type");

		let me = this;
		let contextMenuFn = function (id) {
			let contextData = [{
				text : "删除",
				iconCls : 'icon-stop',
				click : function () {
					me.removeElement(targetElement);
				}
			}];
			
			if(elementType == "rect" || elementType == "image") {
				
				if(dataType != "end") {
					contextData.push("-");
					contextData.push({
						text : "连接到",
						click : function () {
							me.beginCreateLink(targetElement);
						}
					});
				}
				
				let inLines = targetElement.data("in");
				let horizontalItems = [];
				if(inLines != null) {
					let inLinkIds = Object.getOwnPropertyNames(inLines);
					if(inLinkIds.length > 0) {
						for (let i = 0 ; i < inLinkIds.length ; i ++) {
							let lineElement = inLines[inLinkIds[i]];
							let fromElement = lineElement.data("from");
							horizontalItems.push({
								text : fromElement.data("properties").nodeName,
								target : fromElement,
								click : function () {
									me.horizontalAlign(targetElement,this.target);
								}
							});
						}
					}
				}
				let outLines = targetElement.data("out");
				if(outLines != null) {
					let outLinkIds = Object.getOwnPropertyNames(outLines);
					if(outLinkIds.length > 0) {
						for (let i = 0 ; i < outLinkIds.length ; i ++) {
							let lineElement = outLines[outLinkIds[i]];
							let toElement = lineElement.data("to");
							horizontalItems.push({
								text : toElement.data("properties").nodeName,
								target : toElement,
								click : function () {
									me.horizontalAlign(targetElement,this.target);
								}
							});
						}
					}
				}
				if(horizontalItems.length > 0) {
					contextData.push("-");
					if(horizontalItems.length == 1) {
						contextData.push({
							text : "水平对齐",
							target : horizontalItems[0].target,
							click : function () {
								me.horizontalAlign(targetElement,this.target);
							}
						},{
							text : "垂直对齐",
							target : horizontalItems[0].target,
							click : function () {
								me.verticalAlign(targetElement,this.target);
							}
						});
					} else {
						let verticalItems = [];
						$(horizontalItems).each(function() {
							let horizontalItem = this;
							verticalItems.push({
								text : horizontalItem.text,
								target : horizontalItem.target,
								click : function () {
									me.verticalAlign(targetElement,this.target);
								}
							});
						});
						contextData.push({
							text : "水平对齐",
							items : horizontalItems
						},{
							text : "垂直对齐",
							items : verticalItems
						});
					}
				}
				return contextData;
			} else if(elementType == "path") {
				return contextData;
			} 
		};
		return contextMenuFn;
	};
    createImage(src, x, y, w, h, type,editable) {
		let image = this.paper.image(src, x, y, w, h);
		// id需要第一时间修改
		image.id = this.createElementId();
		image.data("type", type);
		this.autoContainerSelect(image);
		if(!editable) {
			// 非编辑模式直接返回不绑定事件
			return image;
		}
		this.initElement(image);
		return image;
	};
	createNode(x, y, width, height,editable) {
		let rect = this.paper.rect(x, y, width, height, 15);
		rect.id = this.createElementId();
		rect.attr({
			"stroke" : "#BFBFBF",
			"title" : "id:" + rect.id,
			fill : DESIGN_SETTINGS.defaultNodeBackgroundColor
		});
		if(!editable) {
			return rect;
		}

		this.autoContainerSelect(rect);
		this.initElement(rect);
		return rect;
	};
	createMutiSubProcess(x, y, width, height,editable) {
		let rect = this.paper.rect(x, y, width, height);
		rect.attr({
			"stroke" : "black",
			fill : "white"
		});
		rect.id = this.createElementId();
		rect.data("type","mutiSubProcess");
		rect.data("nodeId",this.getNumberBy(rect.id) + "");
		if(!editable) {
			return rect;
		}
		this.initElement(rect);
		return rect;
	};
	createNodeWithNodeData(nodeData,editable) {
		let node = this.paper.rect(0, 0, 0, 0, 0);
		node.id = nodeData.id;
		if(isNaN(Number(node.id))) {
			node.id = this.createElementId();
		} else {
			node.id = this.numberToElementId(node.id);
		}
		if(nodeData.attrs.rx) {
			nodeData.attrs.r = nodeData.attrs.rx;
		}
		// 设置nodeId
		if(nodeData.nodeId) {
			node.data("nodeId",nodeData.nodeId + "");
		} else {
			node.data("nodeId",this.getNumberBy(node.id) + "");
		}
		let dataType = nodeData.dataType;
		if(dataType) {
			node.data("type",dataType);
		}
		node.attr(nodeData.attrs);
		let nodeText = this.paper.text("").attr(nodeData.textAttrs);
		nodeText.id = this.getUUID();
		node.data("text",nodeText);
		if(!editable) {
			return node;
		}
		node.attr("title","id:" + node.id);
		this.textEditing(nodeText);
		this.initElement(node);
		return node;
	};
	createImageWithAttrs(node,editable) {
		let attrs = node.attrs;
		let id = node.id;
		let dataType = node.dataType;
		attrs.src = bpmnImg[dataType];

		let image = this.paper.image("", 0, 0, 0, 0);
		if(isNaN(Number(id))) {
			image.id = this.createElementId();
		} else {
			image.id = this.numberToElementId(id);
		}
		// 设置nodeId
		if(node.nodeId) {
			image.data("nodeId",node.nodeId + "");
		} else {
			image.data("nodeId",this.getNumberBy(image.id) + "");
		}
		image.data("type", dataType);
		image.attr(attrs);
		if(!editable) {
			// 非编辑模式直接返回不绑定事件
			return image;
		}
		image.attr("title","id:" + image.id);
		this.initElement(image);
		return image;
	};

	createLinkWithLinkData(linkData,fromElement,toElement,editable) {
		let link = this.paper.path("").attr(linkData.attrs);
		let id = this.getUUID();
		link.id = id;
		
		// 箭头
		let arrow = this.paper.path("").attr(linkData.arrowAttrs);
		arrow.id = this.getUUID();
		link.data("arrow",arrow);
		
		// 文本
		let linkText = this.paper.text("").attr(linkData.textAttrs);
		linkText.id = this.getUUID();
		link.data("pathText",linkText);
		
		if(!editable) {
			return link;
		}
		// 启用编辑
		this.textEditing(linkText);
		
		// 绑定数据关系
		link.data("from",fromElement);
		link.data("to",toElement);
		
		let outLines = fromElement.data("out") || {};
		outLines[id] = link;
		fromElement.data("out",outLines);
		
		let inLines = toElement.data("in") || {};
		inLines[id] = link;
		toElement.data("in",inLines);
		
		// link 设置容器
		if(fromElement.data("container")) {
			link.data("container",fromElement.data("container"));
		}
		
		// 创建控制点并绑定关系
		let points = linkData.attrs.path;
		let len = points.length;
		let startElement,endElement;
		
		let controlElements = [];
		for(let i = 0 ; i < len ; i ++) {
			let point = points[i];
			let controlElement = this.createControlDragRect(point[1],point[2],link);
			controlElement.data("controlPointIndex",-1);
			if(link.data("container")) {
				this.relativePosition(controlElement,link.data("container"));
			}
			controlElements.push(controlElement);
			if(i == 0) {
				startElement = controlElement;
				startElement.data("fromNode",fromElement);
				startElement.data("type","start");
				link.data("start",startElement);
			} else {
				let prevControlElement = controlElements[i - 1];
				prevControlElement.data("right",controlElement);
				controlElement.data("left",prevControlElement);
				
				let centerDragRect = this.createControlDragRect((prevControlElement.attr("x") + controlElement.attr("x") + 5) / 2,(prevControlElement.attr("y") + controlElement.attr("y") + 5) / 2,link); 
				centerDragRect.data("controlPointIndex",0);
				centerDragRect.data("left",prevControlElement);
				centerDragRect.data("right",controlElement);
				
				prevControlElement.data("rightRect",centerDragRect);
				controlElement.data("leftRect",centerDragRect);
			}
			if(i == len - 1) {
				endElement = controlElement;
				endElement.data("toNode",toElement);
				endElement.data("type","end");
				link.data("end",endElement);
			} 
		}
		// 隐藏编辑
		this.hideEditElements(link);
		// 绑定事件
		this.bindSelectEvent(link);
		this.registerElement(link);
		return link;
	};

	createPath(fromNode,toNode) {
		let linkPath = this.paper.path("").attr({
			"stroke" : "#808080",
			"stroke-width" : 2
		});
		linkPath.id = this.getUUID();
		// 同步容器
		if(fromNode.data("container")) {
			linkPath.data("container",fromNode.data("container"));
		}
		
		linkPath.data("from",fromNode);
		linkPath.data("to",toNode);
		
		let outLines = fromNode.data("out") || {};
		outLines[linkPath.id] = linkPath;
		fromNode.data("out",outLines);
		
		let inLines = toNode.data("in") || {};
		inLines[linkPath.id] = linkPath;
		toNode.data("in",inLines);
		
		// 初始化连线
		this.initPath(linkPath,fromNode,toNode);
		// 绑定事件
		this.bindSelectEvent(linkPath);
		// 隐藏元素编辑状态
		this.hideEditElements(fromNode);
		this.hideEditElements(toNode);
		// 选中
		this.selectElement = linkPath;
		// 注册连线
		this.registerElement(linkPath);
		// return
		return linkPath;
	};
	initPath(pathElement,fromElement,toElement) {
		
		let linePathData = this.getLinePathData(fromElement, toElement,false);
		pathElement.attr("path",linePathData.data);
		
		let pathStartPoint = linePathData.start;
		let pathEndPoint = linePathData.end;
		let startElement = this.createControlDragRect(pathStartPoint.x,pathStartPoint.y,pathElement);
		let endElement = this.createControlDragRect(pathEndPoint.x,pathEndPoint.y,pathElement);
		
		startElement.data("fromNode",fromElement);
		endElement.data("toNode",toElement);
		
		pathElement.data("start",startElement);
		pathElement.data("end",endElement);
		
		startElement.data("right",endElement);
		endElement.data("left",startElement);
		
		startElement.data("type","start");
		endElement.data("type","end");
		
		this.repaintPath(pathElement);
	};
	repaintPath(pathElement) {

		// 连线的开始元素
		let startElement = pathElement.data("start");
		// 连线的结束元素
		let endElement = pathElement.data("end");
		
		// 创建中间拖动的矩形
		let centerDragRect = this.createControlDragRect((startElement.attr("x") + endElement.attr("x") + 5) / 2,(startElement.attr("y") + endElement.attr("y") + 5) / 2,pathElement); 
		centerDragRect.data("controlPointIndex",0);
		centerDragRect.data("left",startElement);
		centerDragRect.data("right",endElement);
		
		startElement.data("rightRect",centerDragRect);
		endElement.data("leftRect",centerDragRect);
		
		let pathText = this.paper.text(centerDragRect.attr("x") - 10, centerDragRect.attr("y") - 10);
		pathText.attr({
			"font-size" : 13,
			"text-anchor" : "middle",
			"font-style" : "normal",
			text : DESIGN_SETTINGS.defaultLinkName || " "
		});
		this.textEditing(pathText);
		
		pathText.id = this.getUUID();
		pathElement.data("pathText",pathText);
		
		// 创建箭头
		let arrowPathData = this.getArrowPathData(startElement.attr("x") + 2.5,startElement.attr("y") + 2.5,endElement.attr("x") + 2.5,endElement.attr("y") + 2.5);
		let arrowPath = this.paper.path(arrowPathData).attr({
			"stroke" : "#808080",
			"stroke-width" : 2,
			"fill" : "#808080"
		});
		arrowPath.id = this.getUUID();
		pathElement.data("arrow",arrowPath);
	};
	createControlDragRect(x,y,pathElement) {
		let controlDragRect = this.paper.rect(x  - 2.5, y - 2.5, 5,
				5).attr({
					fill : "#000000",
					stroke : "#ffffff",
					cursor : 'move'
				});
		controlDragRect.id = this.getUUID();
		controlDragRect.data("type","center");
		if(pathElement) {
			controlDragRect.data("host",pathElement);
		}

		let me = this;
		// 绑定事件
		controlDragRect.drag(function(dx, dy, x, y) {
			me.controlOnMove(this,dx, dy, x, y);
		}, function () {
			me.controlOnStart(this);
		}, function() {
			me.controlOnUp(this);
		});
		
		return controlDragRect;
	};
    controlOnMove(controlRect,dx, dy, x, y) {
		controlRect.attr({
			x : controlRect.ox + dx,
			y : controlRect.oy + dy
		});
		let type = controlRect.data("type");
		let host = controlRect.data("host");
		
		if(host.data("container")) {
			// 更新相对位置
			this.relativePosition(controlRect,host.data("container"));
		}
		
		if(type == "start") {
			// 解决zindex导致move事件不响应问题
			controlRect.hide();
			let rightElement = controlRect.data("right");
			let rightDropRect = controlRect.data("rightRect");
			rightDropRect.attr({
				x : (controlRect.attr("x") + rightElement.attr("x")) / 2,
				y : (controlRect.attr("y") + rightElement.attr("y")) / 2
			});
			// update path
			this.updatePath(host);
		} else if(type == "end") {
			controlRect.hide();
			let leftElement = controlRect.data("left");
			let leftDropRect = controlRect.data("leftRect");
			leftDropRect.attr({
				x : (controlRect.attr("x") + leftElement.attr("x")) / 2,
				y : (controlRect.attr("y") + leftElement.attr("y")) / 2
			});
			// update path
			this.updatePath(host);
		} else {
			this.updatePathByControlRect(controlRect);
		}
		this.validateDropLink(host,type == "start");
	};
    controlOnStart(controlRect) {
		controlRect.ox = controlRect.attr("x");
		controlRect.oy = controlRect.attr("y");
		controlRect.data("dragging",true);
		
		let hostElement = controlRect.data("host");
		hostElement.data("editing",true);
		
		let type = controlRect.data("type");
		if(type == "start" || type == "end") {
			this.dragingLine = hostElement;
		}
	};
	controlOnUp(controlRect) {
		// 当鼠标落地后还原设置的相关控制属性
		controlRect.data("disableRestore",null);
		if(controlRect.data("restore")) {
			controlRect.data("restore",null);
			controlRect.data("controlPointIndex",0);
		}
		
		let type = controlRect.data("type");
		let hostElement = controlRect.data("host");
		// 判断是否含可接收的节点
		let dropNode = this.dropNode;
		if(dropNode) {
			
			if(!this.validateDropLink(hostElement,type == "start")) {
				// 还原
				this.updatePathBound(hostElement);
				this.updatePath(hostElement);
				return ;
			}
			
			let selectPath = hostElement;
			if(type == "start") {
				controlRect.show();
				/* 清除当前连线原from节点的内存关系*/
				let oldFromNode = controlRect.data("fromNode");
				if(oldFromNode.data("out")) {
					delete oldFromNode.data("out")[selectPath.id];
				}
				/* 设置当前拖动连线新from节点并建立关系*/
				let newFromNode = dropNode;
				selectPath.data("from",newFromNode);
				controlRect.data("fromNode",newFromNode);
				
				let outLines = newFromNode.data("out") || {};
				outLines[selectPath.id] = selectPath;
				newFromNode.data("out",outLines);
				
				this.updatePathBound(selectPath);
				this.updatePath(selectPath);
				
			} else if (type == "end") {
				controlRect.show();
				/* 清除当前连线原目的节点的内存关系*/
				let oldToNode = selectPath.data("to");
				if(oldToNode.data("in")) {
					delete oldToNode.data("in")[selectPath.id];
				}
				let newToNode = dropNode;
				/* 设置当前拖动连线新的目的节点并建立关系*/
				selectPath.data("to",newToNode);
				controlRect.data("toNode",newToNode);
				
				let inLines = newToNode.data("in") || {};
				inLines[selectPath.id] = selectPath;
				newToNode.data("in",inLines);
				
				this.updatePathBound(selectPath);
				this.updatePath(selectPath);
			}
		} else {
			// 还原
			this.updatePathBound(hostElement);
			this.updatePath(hostElement);
		}
		
		this.dragingLine = null;
		
	};
	getArrowPathData(x1,y1,x3,y3) {
	
		let Par = 10.0;
		let slopy = Math.atan2((y1 - y3),
				(x1 - x3));
		let cosy = Math.cos(slopy);
		let siny = Math.sin(slopy);
		let pathD = "M" + (Number(x3) + Number(Par * cosy - (Par / 2.0 * siny)))
				+ "," + (Number(y3) + Number(Par * siny + (Par / 2.0 * cosy)));
		pathD += " L"
				+ (Number(x3) + Number(Par * cosy + Par / 2.0 * siny) + "," + (Number(y3) - Number(Par
						/ 2.0 * cosy - Par * siny)));
		pathD += " L" + x3 + "," + y3;
		return pathD;
	};
	textEditing(text) {
		/*this.paper.inlineTextEditing(text);
		text.click(function(e){
			// Retrieve created <input type=text> field
			let input = this.inlineTextEditing.startEditing();
			$(input).attr("id","_textEditInput").on("blur",function () {
				text.inlineTextEditing.stopEditing();
				$(this).off("blur");
			});
			// 阻止冒泡
			e.stopPropagation();
		});*/
	};
	blurTextEditing() {
		/*if($("#_textEditInput").length > 0) {
			// jquery 的trigger方法会触发2次，这里采用原生的
			$("#_textEditInput")[0].blur();
		}*/
	};
	initElement(target) {
		let me = this;
		target.drag((dx,dy) => {
			me.elementDragMove(target,dx,dy);
		}, ()=> {
			me.elementDragStart(target);
		}, ()=> {
		    target.attr({opacity : 1});
		});
		this.updateElements(target, true);
		this.hideEditElements(target);
		// 绑定事件
		this.bindSelectEvent(target);
		// 绑定鼠标over和out事件
		this.bindMouseOverOutEvent(target);
		// 注册
		this.registerElement(target);
	};
    elementDragMove (element,dx,dy) {
		let location =  {
			x : element.ox + dx,
			y : element.oy + dy
		};
        if(location.x < 0 || location.y < 0) {
		    return ;
		}
		// 判断元素是否在容器内，如果在容器内的元素禁止拖到容器外
		let container = element.data("container");
		if(container) {
			let outContainerBoundary = this.isOutContainerBoundary(element.ox + dx,element.oy + dy,element.attr("width") ,element.attr("height"),container);
			if(!outContainerBoundary) {
				element.attr(location);
				// 如果么有越过边界，记录位置
				element.data("location",location);
			} else {
				return ;
				// 越过边界后还原location
				// location = element.data("location");
				// element.attr(location);
			}
		} else {
			// 非容器里面的节点暂时不进行碰撞校验
			element.attr(location);
		}

		this.updateElements(element);
	};
	elementDragStart(element) {
		// storing original coordinates
		element.ox = element.attr("x");
		element.oy = element.attr("y");
		element.attr({
			opacity : .5
		});
		this.blurTextEditing();
	};
    resizeOnStart(rect) {
		// storing original coordinates
		rect.ox = rect.attr("x");
		rect.oy = rect.attr("y");
		rect.data("host").data("editing",true);
	};
	resizeOnMove(rect,dx, dy, x, y) {
		rect.attr({
			x : rect.ox + dx,
			y : rect.oy + dy
		});
		let newx,newy,width,height;
		let diagonal = rect.data("diagonal");
		let selectRect = rect.data("host");
		if(diagonal) {
			
			newx = Math.min(rect.attr("x"),diagonal.attr("x")) + 7.5;
			newy = Math.min(rect.attr("y"),diagonal.attr("y")) + 7.5;
			width = Math.abs(rect.attr("x") - diagonal.attr("x")) - 10;
			height = Math.abs(rect.attr("y") - diagonal.attr("y")) - 10;

			// 子流程设置最小宽高 300 150
			if(selectRect.data("type") == "mutiSubProcess") {
				// 获取容器边界信息
				let boundary = this.getContainerBoundary(selectRect.id);
				if(boundary) {
					width = Math.max(width,(boundary.boundaryX - newx));
					height = Math.max(height,(boundary.boundaryY - newy));
				}
			} else {
				// 其他默认最小 80 30 
				width = Math.max(width,80);
				height = Math.max(height,30);
			}
			
			var direction = rect.data("direction");
			if(direction == "w" || direction == "e") {
			   // 水平移动	
				selectRect.attr({
					"x" : newx,
					"width" : width
				});
			} else if(direction == "n" || direction == "s"){
			   // 垂 直移动
				selectRect.attr({
					"y" : newy,
					"height" : height
				});
			} else {
				// 对角移动
				selectRect.attr({
					"x" : newx,
					"y" : newy,
					"width" : width,
					"height" : height
				});
			}
		} 
		this.updateElements(selectRect);
	};
	linkToolOnDragMove(linkTool,element,dx,dy,x,y,e) {
		// move 修改鼠标
		let mx = e.layerX || e.x;
		let my = e.layerY || e.y;
		// 创建一个透明的点
		var dropEndRect = linkTool.data("dropEndRect");
		if(dropEndRect == null) {
			dropEndRect = this.paper.rect(mx, my, 20, 5)
			.attr({
				fill : "#000000",
				cursor : 'move',
				opacity: 0
			}).hide();
			dropEndRect.id = this.getUUID();
			linkTool.data("dropEndRect",dropEndRect);
		} else {
			dropEndRect.attr({
				x : mx,
				y : my
			});
		}
		let virtualData = this.getLinePathData(element,dropEndRect,true);
		let virtualPath = linkTool.data("virtualPath");
		if(virtualPath == null) {
			virtualPath = this.paper.path(virtualData.data).attr({
				"stroke" : "#808080",
				"stroke-width" : 2,
				"fill" : "#808080"
			});
			virtualPath.id = this.getUUID();
			linkTool.data("virtualPath",virtualPath);
		} else {
			virtualPath.attr("path",virtualData.data);
		}
		virtualPath.show();
		
		virtualPath.data("from",element);
		this.dragingLine = virtualPath;
		
		// 设置禁用样式
		this.validateDropLink(virtualPath);

	};
	linkToolOnDragUp(linkTool) {
		let virtualPath = linkTool.data("virtualPath");
		if(virtualPath) {
			virtualPath.hide();
		} else {
			// alert(" error catch !");
		}
		// debug("drop / " + this.dropNode);
		let dropNode = this.dropNode;

		if(dropNode) {
			
			if(!this.validateDropLink(virtualPath)) {
                console.log(" ----------------- validateDropLink false ");
				return ;
			}
			let fromNode = virtualPath.data("from");
			if(fromNode == dropNode) {
				// 如果to环节和当前from环节相同直接返回
				return ;
			}
			// 创建link之前判断是否from和to是否连通（不一定是直接相连）
			let isConnect = this.isConnect(fromNode, dropNode, true);
			let outPath = this.createPath(fromNode,dropNode);
			this.dropNode = null;
			this.dragingLine = null;
			
			// 如果from和to已经连通，有可能是回退或新增的分支连线，处理用户体验方面的问题（连线被遮住）
			if(isConnect) {
				// 移动中央控制点，终点位置取fromNode和dropNode连线线段的2点做中垂线，偏离2点的15度角度
				let x1 = outPath.data("start").attr("x");
				let y1 = outPath.data("start").attr("y");
				
				let x2 = outPath.data("end").attr("x");
				let y2 = outPath.data("end").attr("y");
				
				let x0 = 0,y0 = 0,len,PI = 3.141592653;
				if(y1 == y2) {
					// 同一水平线上
					x0 = (x1 + x2) / 2; 
					len = Math.abs(x2 - x1);
					y0 = y1 - len / 2  * Math.tan(15 / 180 * PI);
					y0 = Math.max(y0,1);
				} else if(x1 == x2) {
					// 暂时不处理
				} else {
					len = Math.sqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1));
					let h = len / 2 * Math.tan(15 / 180 * PI);
					
					let centerX = (x1 + x2) / 2;
					let centerY = (y1 + y2) / 2;
					
					// 中垂线斜率 = -1/k',k' = (y2 - y1 / x2 - x1)
					let k = -(x2 - x1) / (y2 - y1) ;
					let angle = Math.atan(k);
					let sinValue = Math.sin(angle);
					let cosValue = Math.cos(angle);
					
					let dy = h * sinValue;
					let dx = h * cosValue;
					
					x0 = dx + centerX;
					y0 = dy + centerY;
				}
				
				if(x0 || y0) {
					let controlElement = outPath.data("start").data("rightRect");
					controlElement.attr({
						x : x0,
						y : y0
					});
					if(outPath.data("container")) {
						this.relativePosition(controlElement, outPath.data("container"));
					}
					this.updatePathByControlRect(controlElement);
				}
			}
		} else {
			
		}
	};
	validateDropLink(pathElement,reverse) {
	
		let useBpmn2 = this.designMode != "open";
		let me = this,dropNode = me.dropNode;
		if(dropNode) {
			
			let isSameContainer = function (fromElement,toElement) {
				let sameContainer = fromElement.data("container") == toElement.data("container");
				if(!sameContainer) {
					dropNode.attr("cursor", "not-allowed");
				}
				return sameContainer;
			};
			
			// 除去分支节点外，其他节点只能单出
			let from = pathElement.data("from");
			let to = pathElement.data("to");
			
			let fromDataType = from.data("type");
			let dateType = dropNode.data("type");
			// 开始节点只能单出
			if(dateType == "start" && !reverse) {
				dropNode.attr("cursor", "not-allowed");
				return false;
			}
			
			// 如果2个容器不一致，直接禁用
			let sameContainer = reverse ? isSameContainer(dropNode,to) : isSameContainer(from,dropNode);
			if(!sameContainer) {
				return false;
			}
			
			// 判断from和to2个点之间是否已经存在了连线 
			// 遍历from的out即可
			let outLines = reverse ? dropNode.data("out") : from.data("out");
			if(outLines) {
				for (let i in outLines) {
					let outLine = outLines[i];
					let tempToElement = outLine.data("to");
					if(tempToElement == (reverse ? to : dropNode)) {
						// 已存在
						dropNode.attr("cursor", "not-allowed");
						return false ;
					}
				}
			}
			
			// 如果使用的open模式不进行后续的校验，直接通过
			if(!useBpmn2) {
				return true;
			}
			
			// 如果reverse为true说明是反向连接，dropNode即将是pathElement的from端
			if(reverse) {
				// 判断pathElement是否本来就是dropNode的from（连线的开始点拉出来后又还原回去），如果是返回true
				if(from == dropNode) {
					// 还原
					return true;
				}
				// 除去分支节点外，其他节点只能单出
				if(dateType != "diverage") {
					let outLines = dropNode.data("out");
					let len = 0 || (outLines && Object.getOwnPropertyNames(outLines).length);
					if(len > 0) {
						dropNode.attr("cursor", "not-allowed");
						return false ;
					}
				}
				// end节点不能作为from端
				if(dateType == "end") {
					dropNode.attr("cursor", "not-allowed");
					return false;
				}
				from = dropNode;
			} else {
				// 除去聚合节点外，其他节点只能单进
				if(dateType != "converge") {
					if(to == dropNode) {
						// 还原
						return true;
					}
					let inLines = dropNode.data("in");
					let len = 0 || (inLines && Object.getOwnPropertyNames(inLines).length);
					if(len > 0) {
						dropNode.attr("cursor", "not-allowed");
						return false ;
					}
				}
				
				if(fromDataType != "diverage") {
					if(to) {
						// 如果to存在说明是已经存在的link,当前操作可能是变更连接to端，而非virthPath
						return isSameContainer(from,dropNode);
					}
					let outLines = from.data("out");
					let len = 0 || (outLines && Object.getOwnPropertyNames(outLines).length);
					if(len > 0) {
						dropNode.attr("cursor", "not-allowed");
						return false ;
					}
				}

			}
		}
		return true;
	};
	hideEditElements(targetElement) {
		let dataObject = targetElement.data();
		let type = targetElement.type;
		if(type == "rect" || type == "image") {
			// 元素
			for ( let i in dataObject) {
				if (i != "text" && i != "in" && i != "out" && i != "from" && i != "to" && i != "arrow" && i != "container")
					dataObject[i] && dataObject[i].hide && dataObject[i].hide();
			}
		} else if(type == "path") {
			// 连线
			let startElement = targetElement.data("start");
			startElement.hide();
			let nextElement = startElement.data("right");
			while(nextElement) {
				nextElement.hide();
				let leftRect = nextElement.data("leftRect");
				leftRect.hide();
				nextElement = nextElement.data("right");
			}
		}
		targetElement.attr("cursor", "auto");
	};
	showEditElements(targetElement) {
		let dataObject = targetElement.data();
		let type = targetElement.type;
		if(type == "rect" || type == "image") {
			// 元素
			for ( let i in dataObject) {
				if (i != "text" && i != "in" && i != "out" && i != "from" && i != "to" && i != "arrow" && i != "container") {
					dataObject[i] && dataObject[i].show && dataObject[i].show();
				}
			}
		} else if(type == "path") {
			// 连线
			let startElement = targetElement.data("start");
			startElement.show();
			let nextElement = startElement.data("right");
			while(nextElement) {
				nextElement.show();
				let leftRect = nextElement.data("leftRect");
				leftRect.show();
				nextElement = nextElement.data("right");
			}
		}
		targetElement.attr("cursor", "move");
	};
	updateElements(targetElement,isNew) {
	
		let me = this;
		let type = targetElement.data("type");

		let isImage = type && (type == "start" || type == "end" || 
			type == "diverage" || type == "converge");
		
		let text = targetElement.data("text");
		let x = targetElement.attr("x");
		let y = targetElement.attr("y");
		let width = targetElement.attr("width");
		let height = targetElement.attr("height");

		// 创建一个矩形path和8个矩形点
		let hiddenPathStartX = x - 5;
		let hiddenPathStartY = y - 5;
		let hiddenPathEndX = x + width + 5;
		let hiddenPathEndY = y + height + 5;

		let hiddenPathWidth = hiddenPathEndX - hiddenPathStartX;
		let hiddenPathHeight = hiddenPathEndY - hiddenPathStartY;

		let textX = x + width / 2;
		let textY = y + height / 2;
		let initText = DESIGN_SETTINGS.defaultNodeName;
		if(type == "mutiSubProcess") {
			// 如果类型是子流程,文本位置置顶
			textY = y + 10;
			// initText = "子流程";
			initText = DESIGN_SETTINGS.defaultMutiSubProcessName;
		} else if(type == "rule") {
			initText = DESIGN_SETTINGS.defaultRuleNodeName;
		} else if(type == "service") {
			initText = DESIGN_SETTINGS.defaultServiceName;
		} else if(type == "serviceGroup") {
			// 如果类型是服务组,文本位置置顶
			textY = y + 10;
			initText = DESIGN_SETTINGS.defaultServiceGroupName;
		}
		
		// 初始化properties
		var properties = targetElement.data("properties") || {};
		targetElement.data("properties",properties);
		
		if (isNew) {

			if(!isImage) {
				
				if(!text) {
					text = me.paper.text(textX, textY);
					text.attr({
						"font-size" : 13,
						"text-anchor" : "middle",
						"font-style" : "normal",
						"width" : 3,
						text : initText
					});
					me.textEditing(text);
					text.id = me.getUUID();
					targetElement.data("text", text);
				}
				// 属性环节名称
				properties.nodeName = text.attr("text");
				// 矩形
				let hiddenPath = me.paper.path(
						"M" + hiddenPathStartX + "," + hiddenPathStartY + "L"
						+ hiddenPathStartX + "," + hiddenPathEndY + "L"
						+ hiddenPathEndX + "," + hiddenPathEndY + "L"
						+ hiddenPathEndX + "," + hiddenPathStartY + "L"
						+ hiddenPathStartX + "," + hiddenPathStartY).attr({
							fill : "none",
							stroke : "#000000"
						});
				hiddenPath.id = me.getUUID();
				targetElement.data("path", hiddenPath);
				
				// 8个矩形点
				let nw = me.paper.rect(hiddenPathStartX - 2.5, hiddenPathStartY - 2.5, 5,
						5).attr({
							fill : "#000000",
							stroke : "#ffffff",
							cursor : 'nw-resize'
						});
				nw.id = me.getUUID();
				targetElement.data("nw", nw);
				
				let w = me.paper.rect(hiddenPathStartX - 2.5,
						hiddenPathStartY + hiddenPathHeight / 2 - 2.5, 5, 5).attr({
							fill : "#000000",
							stroke : "#ffffff",
							cursor : 'w-resize'
						});
				w.id = me.getUUID();
				targetElement.data("w", w);
				
				let sw = me.paper.rect(hiddenPathStartX - 2.5, hiddenPathEndY - 2.5, 5, 5)
				.attr({
					fill : "#000000",
					stroke : "#ffffff",
					cursor : 'sw-resize'
				});
				sw.id = me.getUUID();
				targetElement.data("sw", sw);
				
				let n = me.paper.rect(hiddenPathStartX + hiddenPathWidth / 2 - 2.5,
						hiddenPathStartY - 2.5, 5, 5).attr({
							fill : "#000000",
							stroke : "#ffffff",
							cursor : 'n-resize'
						});
				n.id = me.getUUID();
				targetElement.data("n", n);
				
				let s = me.paper.rect(hiddenPathStartX + hiddenPathWidth / 2 - 2.5,
						hiddenPathEndY - 2.5, 5, 5).attr({
							fill : "#000000",
							stroke : "#ffffff",
							cursor : 's-resize'
						});
				s.id = me.getUUID();
				targetElement.data("s", s);
				
				let ne = me.paper.rect(hiddenPathEndX - 2.5, hiddenPathStartY - 2.5, 5, 5)
				.attr({
					fill : "#000000",
					stroke : "#ffffff",
					cursor : 'ne-resize'
				});
				ne.id = me.getUUID();
				targetElement.data("ne", ne);
				
				let e = me.paper.rect(hiddenPathEndX - 2.5,
						hiddenPathStartY + hiddenPathHeight / 2 - 2.5, 5, 5).attr({
							fill : "#000000",
							stroke : "#ffffff",
							cursor : 'e-resize'
						});
				e.id = me.getUUID();
				targetElement.data("e", e);
				
				let se = me.paper.rect(hiddenPathEndX - 2.5, hiddenPathEndY - 2.5, 5, 5)
				.attr({
					fill : "#000000",
					stroke : "#ffffff",
					cursor : 'se-resize'
				});
				se.id = me.getUUID();
				targetElement.data("se", se);
				
                let resizeOnMove = function(dx, dy, x, y){
                    me.resizeOnMove(this,dx, dy, x, y);
				};
				
				let resizeOnStart = function() {
					me.resizeOnStart(this);
				};

				let resizeOnUp = me.resizeOnUp;

				nw.data("host" ,targetElement).data("direction","nw").data("diagonal",se).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				w.data( "host" ,targetElement).data("direction","w").data("diagonal",e).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				sw.data("host" ,targetElement).data("direction","sw").data("diagonal",ne).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				n.data( "host" ,targetElement).data("direction","n").data("diagonal",s).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				s.data( "host" ,targetElement).data("direction","s").data("diagonal",n).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				ne.data("host" ,targetElement).data("direction","ne").data("diagonal",sw).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				e.data( "host" ,targetElement).data("direction","e").data("diagonal",w).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				se.data("host" ,targetElement).data("direction","se").data("diagonal",nw).drag(resizeOnMove, resizeOnStart, resizeOnUp);
				
			} else {
				if(type == "start") {
					properties.nodeName = "StartProcess";
				} else if(type == "end") {
					properties.nodeName = "EndProcess";
				} else {
					properties.nodeName = type + "[" + targetElement.id + "] GateWay";
				}
			}
			
			let dropNw = me.paper.path("M" + (hiddenPathStartX + 5) + "," + hiddenPathStartY + "H" + hiddenPathStartX + "V" +  (hiddenPathStartY + 5)).attr({
						"stroke" : "#1DC967",
						"stroke-width" : 2
					});
			dropNw.id = me.getUUID();
			targetElement.data("dropNw", dropNw);
			
			let dropNe = me.paper.path("M" + (hiddenPathEndX - 5) + "," + hiddenPathStartY + "H" + hiddenPathEndX + "V" +  (hiddenPathStartY + 5)).attr({
				"stroke" : "#1DC967",
				"stroke-width" : 2
			});
			dropNe.id = me.getUUID();
			targetElement.data("dropNe", dropNe);
			
			let dropSw = me.paper.path("M" + (hiddenPathStartX + 5) + "," + hiddenPathEndY + "H" + hiddenPathStartX + "V" +  (hiddenPathEndY - 5)).attr({
				"stroke" : "#1DC967",
				"stroke-width" : 2
			});
			dropSw.id = me.getUUID();
			targetElement.data("dropSw", dropSw);
			
			let dropSe = me.paper.path("M" + (hiddenPathEndX - 5) + "," + hiddenPathEndY + "H" + hiddenPathEndX + "V" +  (hiddenPathEndY - 5)).attr({
				"stroke" : "#1DC967",
				"stroke-width" : 2
			});
			dropSe.id = me.getUUID();
			targetElement.data("dropSe", dropSe);
			
			targetElement.data("showDropRect",function () {
				dropNw.show();
				dropNe.show();
				dropSw.show();
				dropSe.show();
			}).data("hideDropRect",function () {
				dropNw.hide();
				dropNe.hide();
				dropSw.hide();
				dropSe.hide();
			});
			
			// 创建工具栏副本
			// 结束节点不创建工具连线
			if(type != "end") {
				let linkToolImage = me.paper.image(bpmnImg.sequenceflow, hiddenPathEndX + 10, hiddenPathStartY,
						16, 16);
				linkToolImage.attr({
					opacity : .5
				}).mouseover(function () {
					this.attr("opacity",1);
				}).mouseout(function () {
					this.attr("opacity",.5);
				});
				linkToolImage.id = me.getUUID();
				linkToolImage.data("type","link");		
				targetElement.data("tool",linkToolImage);
				// 绑定事件 当拖动到可接受的节点时生成一个连线
				linkToolImage.drag(function(dx,dy,x,y,e) {
					// move
					me.linkToolOnDragMove(this,targetElement,dx,dy,x,y,e);
				},function () {
					// start
					// me.linkToolOnDragStart(this);
				},function () {
					// up
					me.linkToolOnDragUp(this);
				});
			}
		} else {
			
			if(!isImage) {
				
				// 更新text位置
				text.attr("x", textX).attr("y", textY);
				
				// text.attr("text","hellp");
				let d = "M" + hiddenPathStartX + "," + hiddenPathStartY + "L"
				+ hiddenPathStartX + "," + hiddenPathEndY + "L"
				+ hiddenPathEndX + "," + hiddenPathEndY + "L" + hiddenPathEndX
				+ "," + hiddenPathStartY + "L" + hiddenPathStartX + ","
				+ hiddenPathStartY;
				targetElement.data("path").attr("path", d);
				
				targetElement.data("nw").attr("x", hiddenPathStartX - 2.5).attr("y",
						hiddenPathStartY - 2.5);
				targetElement.data("w").attr("x", hiddenPathStartX - 2.5).attr("y",
						hiddenPathStartY + hiddenPathHeight / 2 - 2.5);
				targetElement.data("sw").attr("x", hiddenPathStartX - 2.5).attr("y",
						hiddenPathEndY - 2.5);
				targetElement.data("n").attr("x", hiddenPathStartX + hiddenPathWidth / 2 - 2.5)
				.attr("y", hiddenPathStartY - 2.5);
				targetElement.data("s").attr("x", hiddenPathStartX + hiddenPathWidth / 2 - 2.5)
				.attr("y", hiddenPathEndY - 2.5);
				targetElement.data("ne").attr("x", hiddenPathEndX - 2.5).attr("y",
						hiddenPathStartY - 2.5);
				targetElement.data("e").attr("x", hiddenPathEndX - 2.5).attr("y",
						hiddenPathStartY + hiddenPathHeight / 2 - 2.5);
				targetElement.data("se").attr("x", hiddenPathEndX - 2.5).attr("y",
						hiddenPathEndY - 2.5);
				
			}
			targetElement.data("dropNw").attr("path","M" + (hiddenPathStartX + 5) + "," + hiddenPathStartY + "H" + hiddenPathStartX + "V" +  (hiddenPathStartY + 5));
			targetElement.data("dropNe").attr("path","M" + (hiddenPathEndX - 5) + "," + hiddenPathStartY + "H" + hiddenPathEndX + "V" +  (hiddenPathStartY + 5));
			targetElement.data("dropSw").attr("path","M" + (hiddenPathStartX + 5) + "," + hiddenPathEndY + "H" + hiddenPathStartX + "V" +  (hiddenPathEndY - 5));
			targetElement.data("dropSe").attr("path","M" + (hiddenPathEndX - 5) + "," + hiddenPathEndY + "H" + hiddenPathEndX + "V" +  (hiddenPathEndY - 5));
			
			if(targetElement.data("tool")) {
				targetElement.data("tool").attr("x",hiddenPathEndX + 10).attr("y",hiddenPathStartY);
			}
			
		}

		if (targetElement.data("in")) {
			let inLines = targetElement.data("in");
			for (let i in inLines) {
				me.updateLine(inLines[i]);
			}
		}
		if (targetElement.data("out")) {
			let outLines = targetElement.data("out");
			for (let j in outLines) {
				me.updateLine(outLines[j]);
			}
		}
		if(type == "mutiSubProcess" || type == "serviceGroup") {
			// 如果移动的是容器，更新子元素的坐标(相对位置不变）
			let container = me.process.containers[targetElement.id];
			let elements = container && container.elements;
			if(elements) {
				for (let childId in elements) {
					let childElement = elements[childId];
					let relativePosition = childElement.data("relativePosition");
					childElement.attr({
						x : container.target.attr("x") + relativePosition.x,
						y : container.target.attr("y") + relativePosition.y	
					});
					me.updateElements(childElement);
				}
			}
		}
		
		if(targetElement.data("container")) {
			// 如果移动的是容器里面的元素，更新相对位置
			let containerElement = targetElement.data("container");
			let p = {
				x : targetElement.attr("x") - containerElement.attr("x"),
				y : targetElement.attr("y") - containerElement.attr("y")
			};
			targetElement.data("relativePosition",p);
		}
		
	};
	updateLine(hostElement) {

		let startElement = hostElement.data("start");
		let endElement = hostElement.data("end");

		if(startElement.data("fromNode")) {
			let fromElement = startElement.data("fromNode");
			let fromElementRight = startElement.data("right");
			
			let isToNode = endElement == fromElementRight && endElement.data("toNode") != null;
			let linePathData = this.getLinePathData(fromElement, isToNode ? endElement.data("toNode") : fromElementRight,false);
			let pathStartPoint = linePathData.start;
			startElement.attr({
				x : pathStartPoint.x - 2.5,
				y : pathStartPoint.y - 2.5
			});
			
			if(hostElement.data("container")) {
				this.relativePosition(startElement,hostElement.data("container"));
			}
			
			// 跟新rightrect的位置
			let rightControlRect = startElement.data("rightRect");
			rightControlRect.attr({
				x : (startElement.attr("x") + fromElementRight.attr("x")) / 2,
				y : (startElement.attr("y") + fromElementRight.attr("y")) / 2
			});
		}
		
		if(endElement.data("toNode")) {
			let toElement = endElement.data("toNode");
			let toElementLeft = endElement.data("left");
			
			let isFromNode = startElement == toElementLeft && startElement.data("fromNode") != null;
			let linePathData = this.getLinePathData(isFromNode ? startElement.data("fromNode") : toElementLeft,toElement,false);
			let pathEndPoint = linePathData.end;
			endElement.attr({
				x : pathEndPoint.x - 2.5,
				y : pathEndPoint.y - 2.5
			});
			
			if(hostElement.data("container")) {
				this.relativePosition(endElement,hostElement.data("container"));
			}
			
			// 更新rightrect的位置
			let leftControlRect = endElement.data("leftRect");
			leftControlRect.attr({
				x : (toElementLeft.attr("x") + endElement.attr("x")) / 2,
				y : (toElementLeft.attr("y") + endElement.attr("y")) / 2
			});
		}
		
		this.updatePath(hostElement);
	};
	updatePath(hostElement) {
	
		// 连线的开始元素
		let startElement = hostElement.data("start");
		let startRightRect = startElement.data("rightRect");
		// path文本位置更新
		hostElement.data("pathText").attr({
			x : startRightRect.attr("x") - 10,
			y : startRightRect.attr("y") - 10
		});
		
		let pathData = "M" + (startElement.attr("x") + 2.5) + "," + (startElement.attr("y") + 2.5);
		
		let arrowPathEnd = hostElement.data("end");
		let arrowPathStart = startElement;
		let nextElement = startElement.data("right");
		while(nextElement) {
			let temp = nextElement;
			
			if(hostElement.data("container")) {
				let containerElement = hostElement.data("container");
				let relativePosition = nextElement.data("relativePosition");
				// 更新坐标
				nextElement.attr({
					x : containerElement.attr("x") + relativePosition.x ,
					y : containerElement.attr("y") + relativePosition.y 
				});
				// 更新中点的坐标
				let leftElement = nextElement.data("left");
				let centerRect = nextElement.data("leftRect");
				if(centerRect) {
					centerRect.attr({
						x : leftElement.attr("x") / 2 + nextElement.attr("x") / 2,
						y : leftElement.attr("y") / 2 + nextElement.attr("y") / 2
					});
				};
			}
			
			pathData += " L" + (nextElement.attr("x") + 2.5) + "," + (nextElement.attr("y") + 2.5) + " ";
			nextElement = nextElement.data("right");
			if(nextElement != null) {
				arrowPathStart = temp;
			}
		}
		//console.log(pathData);
		hostElement.attr("path",pathData);
		
		// 绘制箭头
		let arrowPath = hostElement.data("arrow");
		let arrowPathData = this.getArrowPathData(arrowPathStart.attr("x") + 2.5,arrowPathStart.attr("y") + 2.5,arrowPathEnd.attr("x") + 2.5,arrowPathEnd.attr("y") + 2.5);
		arrowPath.attr("path",arrowPathData);
	};

    updatePathByControlRect(controlElement) {
	
		let hostElement = controlElement.data("host");
		
		// 控制点标志
		let controlPointIndex = controlElement.data("controlPointIndex");
		let leftElement = controlElement.data("left");
		let rightElement = controlElement.data("right");

		let disableRestore = controlElement.data("disableRestore");
		let restore = controlElement.data("restore");
		if(restore) {
			controlElement.attr({
				x : (leftElement.attr("x") + rightElement.attr("x")) / 2,
				y : (leftElement.attr("y") + rightElement.attr("y")) / 2
			});
			if(hostElement.data("container")) {
				this.relativePosition(controlElement,hostElement.data("container"));
			}
			return ;
		}
		
		if(leftElement && leftElement.data("fromNode")) {
			let fromElement = leftElement.data("fromNode");
			let linePathData = this.getLinePathData(fromElement, controlElement,false);
			let pathStartPoint = linePathData.start;
			leftElement.attr({
				x : pathStartPoint.x - 2.5,
				y : pathStartPoint.y - 2.5
			});
	//		if(hostElement.data("container")) {
	//			relativePosition(leftElement,hostElement.data("container"));
	//		}
		}
		
		if(rightElement && rightElement.data("toNode")) {
			let toElement = rightElement.data("toNode");
			let linePathData = this.getLinePathData(controlElement,toElement,false);
			let pathEndPoint = linePathData.end;
			rightElement.attr({
				x : pathEndPoint.x - 2.5,
				y : pathEndPoint.y - 2.5
			});
			if(hostElement.data("container")) {
				this.relativePosition(rightElement,hostElement.data("container"));
			}
		}
		
		if(controlPointIndex == -1) {
			
			// 更新左边的center控制矩形坐标
			let leftDragRect = controlElement.data("leftRect");
			
			leftDragRect.attr("x",(leftElement.attr("x") + controlElement.attr("x") ) / 2);
			leftDragRect.attr("y",(leftElement.attr("y") + controlElement.attr("y") ) / 2);
			
			// 更新右边的center控制矩形坐标
			let rightDragRect = controlElement.data("rightRect");
			
			rightDragRect.attr("x",(rightElement.attr("x") + controlElement.attr("x") ) / 2);
			rightDragRect.attr("y",(rightElement.attr("y") + controlElement.attr("y") ) / 2);
			
	//		if(hostElement.data("container")) {
	//			relativePosition(leftDragRect,hostElement.data("container"));
	//			relativePosition(rightDragRect,hostElement.data("container"));
	//		}
			
			if(!disableRestore) {
				// 当拖动的矩形元素接近left和right所在的直线时，自动还原到当前直线上
				// 还原处理的操作：
				// a 删除leftDragRect和rightDragRect
				// b controlElement.data("controlPointIndex",0);
				// c 更新left和right2个元素的 left，leftRect，right，rightRect
				
				// 如何判断？根据直线的斜率?点到直线的距离判断？（更科学）
				
				let x0 = controlElement.attr("x"),y0 = controlElement.attr("y"),
				x1 = leftElement.attr("x"),y1 = leftElement.attr("y"),
				x2 = rightElement.attr("x"),y2 = rightElement.attr("y");
				
				let h = this.distanceFromPointToLine(
						x0,y0,
						x1,y1,
						x2,y2
				);
				let isOutBoundLine = (x0 - x1) * (x0 - x2) > 0 && (y0 - y1) * (y0 - y2) > 0;
				if(h <= 3 && !isOutBoundLine) {
					leftDragRect.remove();
					rightDragRect.remove();
					controlElement.data("restore",true);
					// controlElement.data("controlPointIndex",0);
					
					leftElement.data("right",rightElement);
					leftElement.data("rightRect",controlElement);
					rightElement.data("left",leftElement);
					rightElement.data("leftRect",controlElement);
					controlElement.attr({
						x : (leftElement.attr("x") + rightElement.attr("x")) / 2,
						y : (leftElement.attr("y") + rightElement.attr("y")) / 2
					});
	//				if(hostElement.data("container")) {
	//					relativePosition(controlElement,hostElement.data("container"));
	//				}
				}
			}
		} else {
			// 设置标志
			controlElement.data("disableRestore",true);
			
			// 创建一个控制点和2个伪矩形
			let leftCenterDragRect = this.createControlDragRect((leftElement.attr("x") + controlElement.attr("x") + 5) / 2,(leftElement.attr("y") + controlElement.attr("y") + 5) / 2,hostElement); 
			leftCenterDragRect.data("controlPointIndex",0);
			leftCenterDragRect.data("left",leftElement);
			leftCenterDragRect.data("right",controlElement);
			
			let rightCenterDragRect = this.createControlDragRect((rightElement.attr("x") + controlElement.attr("x") + 5 ) / 2,(rightElement.attr("y") + controlElement.attr("y") + 5) / 2,hostElement); 
			rightCenterDragRect.data("controlPointIndex",0);
			rightCenterDragRect.data("left",controlElement);
			rightCenterDragRect.data("right",rightElement);
			
	//		if(hostElement.data("container")) {
	//			relativePosition(leftCenterDragRect,hostElement.data("container"));
	//			relativePosition(rightCenterDragRect,hostElement.data("container"));
	//		}
			
			controlElement.data("leftRect",leftCenterDragRect);
			controlElement.data("rightRect",rightCenterDragRect); 
			rightElement.data("leftRect",rightCenterDragRect);
			leftElement.data("rightRect",leftCenterDragRect);
				
			// 更新关系位置
			rightElement.data("left",controlElement);
			leftElement.data("right",controlElement);
			
			controlElement.data("controlPointIndex",-1);
		}
		
		// 更新path
		this.updatePath(hostElement);
	};
    updatePathBound(hostElement) {

		let fromNode = hostElement.data("from");
		let toNode = hostElement.data("to");
		
		// 连线的开始元素
		let startElement = hostElement.data("start");
		let endElement = hostElement.data("end");
		
		let rightElement = startElement.data("right");
		let startRightRect = startElement.data("rightRect");
		
		let f = fromNode;
		let t = rightElement;
		if(rightElement == endElement) {
			// 如果path的start的right就是path的end元素，重新计算边界点
			t = toNode;
		}
		
		let linePathData = this.getLinePathData(f, t,false);
		let pathStartPoint = linePathData.start;
		
		startElement.attr({
			x : pathStartPoint.x - 2.5,
			y : pathStartPoint.y - 2.5
		});
		
		startRightRect.attr({
			x : (startElement.attr("x") + rightElement.attr("x")) / 2,
			y : (startElement.attr("y") + rightElement.attr("y")) / 2
		});
		
		toNode = hostElement.data("to");
		// 连线的开始元素
		let endLeftRect = endElement.data("leftRect");
		
		let leftElement = endElement.data("left");
		f = leftElement;
		if(startElement == leftElement) {
			f = fromNode;
		}
		t = toNode;
		let endLinePathData = this.getLinePathData(f, t,false);
		let pathEndPoint = endLinePathData.end;
		endElement.attr({
			x : pathEndPoint.x - 2.5,
			y : pathEndPoint.y - 2.5
		});
		endLeftRect.attr({
			x : (leftElement.attr("x") + endElement.attr("x")) / 2,
			y : (leftElement.attr("y") + endElement.attr("y")) / 2
		});
		
	};

	getContainerBoundary(containerId) {
		
		// 获取容器2个点的理想坐标(容器的坐标点(x，y)及对角线点(boundaryX,boundaryY))
		let x,y,boundaryX,boundaryY;
		let childElements = this.process.containers[containerId].elements;
		let containerElement = this.process.containers[containerId].target;
		
		x = containerElement.attr("x");
		y = containerElement.attr("y");
		// 设置边界控制容器的初始最小宽高300 150
		boundaryX = containerElement.attr("x") + 300;
		boundaryY = containerElement.attr("y") + 150;
		
		// 根据容器中的元素，设置容器的最小边界
		for (let childElementId in childElements) {
			let childElement = childElements[childElementId];
			let childElementX = childElement.attr("x");
			let childElementY = childElement.attr("y");
			let width = childElement.attr("width");
			let height = childElement.attr("height");
			boundaryX = Math.max(boundaryX, childElementX + width + 10);
			boundaryY = Math.max(boundaryY, childElementY + height + 10);
		}
		return {
			x : x,
			y : y,
			boundaryX : boundaryX,
			boundaryY : boundaryY
		};
	};
	autoContainerSelect(targetElement) {
		// 设置节点id
		targetElement.data("nodeId",this.getNumberBy(targetElement.id) + "");
		let dataType = targetElement.data("type");
		if(dataType == "rule") {
			// 规则节点暂时不支持嵌套，直接return 
			return ;
		}  
		let containers = this.process.containers;
		if(containers) {
			let x = targetElement.attr("x");
			let y = targetElement.attr("y");
			for(let i in containers) {
				let container = containers[i];
				let containerTargetElement = container.target;
				
				let containerX = containerTargetElement.attr("x");
				let containerY = containerTargetElement.attr("y");
				let containerW = containerTargetElement.attr("width");
				let containerH = containerTargetElement.attr("height");
				
				if(x > containerX && x < (containerX + containerW) 
					&& y > containerY && y < (containerY + containerH)) {
					// 绑定关系
					targetElement.data("container",containerTargetElement);
					// 重置nodeId
					let nodeId = this.getNumberBy(containerTargetElement.id) + ":" + this.getNumberBy(targetElement.id);
					targetElement.data("nodeId",nodeId);
					
					// 在容器中注册
					container.elements[targetElement.id] = targetElement;
					// 设置相对位置
					this.relativePosition(targetElement,containerTargetElement);
					break;
				}
			}
		}
	};
	isOutContainerBoundary(x,y,w,h,containerElement) {
		let containerX = containerElement.attr("x");
		let containerY = containerElement.attr("y");
		let containerW = containerElement.attr("width");
		let containerH = containerElement.attr("height");
		if(x > containerX + 5 && x + w < containerX + containerW - 5 
			&& y > containerY + 5 && y + h < containerY + containerH - 5) {
			// 在容器内
			return false;
		} else {
			return true;
		}
	};
	relativePosition(targetElement,containerElement) {
		let position = {
			x : targetElement.attr("x") - containerElement.attr("x"),
			y : targetElement.attr("y") - containerElement.attr("y")
		};
		targetElement.data("relativePosition",position);
	};

    /*=========data 操作区============*/

    initIdPond(start, end) {
		for (let i = start; i < end; i++) {
			this.idPond.push(i);
		}
	};
    getId() {
		if (this.idPond.length == 0) {
			this.initIdPond(1, 100);
		}
		if (this.idPond.length == 1) {
			let lastId = this.idPond[0];
			this.initIdPond(lastId + 1, lastId + 100);
		}
		return this.idPond.shift();
	};
    createElementId() {
       return this.numberToElementId(this.getId());
	};
	numberToElementId(number) {
		return number + "#" + this.getUUID();
	};
    getNumberBy(elementId) {
	   let splitIndex = elementId.indexOf('#');
	   return Number(elementId.substring(0,splitIndex));
	};
	recoveryId(id) {
		let idPond = this.idPond;
		if($.inArray(id,idPond) == -1) {
			idPond.unshift(id);
		};
		idPond.sort(function (a,b) {
			return a - b;
		});
	};
	unbindElementFromContainer(targetElement,container) {
		let containerObj = this.process.containers[container.id];
		delete containerObj.elements[targetElement.id];
	};
	/**删除一个容器 */
	removeContainer (container) {
		// 删除容器里面的所有元素
		let containerId = container.target.id;
		delete container.elements;
		delete container.target;
		this.unregisterElement(containerId);
		delete this.process.containers[containerId];
	};
	/** 反注册元素（删除）*/
	unregisterElement(id) {
		if(typeof(id) == "number") {
			this.recoveryId(id);
		}
		this.process.elements[id] = null;
		delete this.process.elements[id];
	};
	/** 注册元素*/
    registerElement(target) {
		let id = target.id;
		if (!id) {
			alert(" error，register id is null !");
			return;
		}
		this.process.elements[id] = target;
		// 如果目标节点是容器节点，注册容器
		if(target.data("type") == "mutiSubProcess") {
			this.registerContainer(target);
		} else if(target.data("type") == "serviceGroup") {
			this.registerContainer(target);
		} else if(target.type == "path"){
			// 解决连线不好选中的问题
			target.hover(function() {
				this.attr("stroke-width",2.6);
			},function() {
				this.attr("stroke-width",2);
			});
		}
 
        // init properties
        target.data('properties',target.data('properties') || {});
	};
    /** 注册容器*/
	registerContainer (target) {
		this.process.containers = this.process.containers || {};
		this.process.containers[target.id] = {
			elements : {},
			target : target
		};
	};
	isConnect(fromElement,toElement,reverse) {
		// 暂时写死不做转弯处理
		return false;
		/*// 临时对象记录遍历过的元素，防死循环
		var temp = {};
		var outLines = fromElement.data("out");
		temp[fromElement.id] = fromElement;
		var testCount = 0;
		while(outLines && Object.getOwnPropertyNames(outLines).length) {
			var nextErgodicLines = {};
			for (var i in outLines) {
				var link = outLines[i];
				var to = link.data("to");
				if(to != toElement) {
					if(!temp[to.id]) {
						var nextOutLines = to.data("out");
						for(var j in nextOutLines) {
							nextErgodicLines[j] = nextOutLines[j];
						}
					}
				} else {
					return true;
				}
			}
			outLines = nextErgodicLines;
			if(testCount ++ > 1000) {
				console.log(" maybe bug happen ! ");
				return false;
			}
		}
		
		// 双向判断
		if(reverse) {
			return this.isConnect(toElement,fromElement,false);
		}
		delete temp;
		return false;*/
	};
	/** 获取连线的数据*/
    getLinkData(linkElement) {
		let link = {
			id    : linkElement.id,
			type  : 'link'
		};
		let linkProperties = linkElement.data("properties");
		link.properties = linkProperties || {};

		let attrs = linkElement.attrs;
		link.attrs = attrs;

		let from = linkElement.data("from");
		let to = linkElement.data("to");

		// 如果从xor分支过来的link需要指定expressionRequired = true，即使不配置也需要指定
		if(from.type == "image") {
			let dataType = from.data("type");
			let fromDataOptions = from.data("properties");
			let optionType = fromDataOptions && fromDataOptions.type;
			if(dataType == "diverage" && (optionType == "xor" || optionType == "or")) {
				link.properties.orContraint = true;
			} else {
				delete link.properties.orContraint;
			}
		}
		link.from = this.getNumberBy(from.id);
		link.to = this.getNumberBy(to.id);
		let arrow = linkElement.data("arrow");
		link.arrowAttrs = arrow.attrs;

		let pathText = linkElement.data("pathText");
		link.textAttrs = pathText.attrs;
		// 获取link的控制点集合
		link.properties.linkName = pathText.attr("text");
		
		return link;
	};

    /**获取流程数据*/
    getProcessData() {
			
		let data = {}, process = this.process, properties = (data.properties = process.properties);
		if(properties.newVersion) {
			properties.version = properties.newVersion;
			delete properties.newVersion;
		}
		
		let nodes = (data.nodes = []),links = (data.links = []);
		let elements = process.elements;
		for ( let id in elements) {
			let element = elements[id];
			let type = element.type;
			let node = {};
			if (type == "rect") {
				// rect的都是环节
				node.type = "node";
				node.id = this.getNumberBy(element.id);
				node.nodeId = element.data("nodeId");
				// 入参集合
				if(element.data("parameterMapping")) {
					node.parameterMapping = element.data("parameterMapping");
				}
				if(element.data("serviceInfo")) {
					node.serviceInfo = element.data("serviceInfo");
				}
				if(element.data("type")) {
					node.dataType = element.data("type");
				}
				if(element.data("container")) {
					node.containerId = this.getNumberBy(element.data("container").id);
				}
				let nodeProperties = element.data("properties");
				node.properties = nodeProperties || {};
				node.properties.nodeName = element.data("text").attr("text");
				
				// 获取视图属性集合
				node.attrs = element.attrs;
				node.textAttrs = element.data("text").attrs;
				nodes.push(node);

			} else if (type == "path") {
				links.push(this.getLinkData(element));
			} else if (type == "image") {
				node.type = "image";
				node.id = this.getNumberBy(element.id);
				node.nodeId = element.data("nodeId");
				let dataType = element.data("type");
				node.dataType = dataType;
				if(element.data("container")) {
					node.containerId = this.getNumberBy(element.data("container").id);
				}
				let nodeProperties = element.data("properties");
				node.properties = nodeProperties || {};

				// 获取视图属性集合
				node.attrs = element.attrs;
				nodes.push(node);
			} else {

			}
		}
		let containers = process.containers || {};
		for(let containerId in containers) {
			let container = containers[containerId];
			let childElements = container.elements;
			
			// 容器集合根属性
			data.containers = data.containers || [];
			let dataContainer = {};
			// 容器id
			dataContainer.containerId = this.getNumberBy(containerId);
			dataContainer.elements = [];
			for(let childElementId in childElements) {
				dataContainer.elements.push(this.getNumberBy(childElementId));
			}
			data.containers.push(dataContainer);
		}
		return data;
	};

    /**设置流程数据 初始化paper*/
    setProcessData(data,editable) {
		
		// 赋值流程属性
		this.process.properties = data.properties;
		let nodes = data.nodes;
		let links = data.links;

		// 重构数据结构
		let tempElementMap = {};
		let maxId = 0;

		// 初始化maxId
        nodes.forEach((item,j)=> {
			let elementId = item.id,id = elementId;
			if(!isNaN(id)) {
				maxId = Math.max(maxId,id);
			}
		});
		// 初始化 idPond
		this.idPond = [];
		this.initIdPond(maxId + 1,maxId + 100);
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			let type = node.type;
			let id = node.id;
			
			let element = null;
			if (type == "node") {
				element = this.createNodeWithNodeData(node, editable);
				element.data("properties", node.properties);
				if(node.parameterMapping) {
					element.data("parameterMapping",node.parameterMapping);
				}
			} else if (type == "image") {
				element = this.createImageWithAttrs(node,editable);
				element.data("properties", $.extend(node.properties,element.data("properties") || {}));
			}
			
			tempElementMap[id] = element;
			this.process.elements[element.id] = element;
		}
		if(!editable) {
			//this.process.elements = tempElementMap;
		}

		// 如果存在子容器（子流程），在所有元素初始化完毕后开始绑定容器与元素的关系
		if(editable && data.containers) {
			let containers = data.containers;
			this.process.containers = {};
			for (let i = 0 ; i < containers.length ; i ++) {
				let container = containers[i];
				let containerId = container.containerId;
				// 容器元素
				let containerElement = tempElementMap[Number(containerId)];					
				let containerObj = {
					target : containerElement,
					elements : []
				};
				this.process.containers[containerElement.id] = containerObj;
				let childElementIds = container.elements;

				for (var j = 0 ; j < childElementIds.length ; j ++) {
					let childElementId = childElementIds[j];
					let childElement = tempElementMap[Number(childElementId)];

					// 离线转在线从bpmn解析出来的id如果是子流程中的元素 childElement.id会被重置，此时 != childElementId
					// tempElementMap中的key存储的初始的id（重置前的id）
					// 用新的id绑定到containerObj.elements中
					containerObj.elements[childElement.id] = childElement;
					// nodeId
					if(!childElement.data("nodeId") || childElement.data("nodeId").indexOf(":") == -1) {
						childElement.data("nodeId",containerElement.data("nodeId") + ":" + childElement.data("nodeId"));
					}
					
					//}
					childElement.data("container",containerElement);
					childElement.data("relativePosition",{
						x : childElement.attr("x") - containerElement.attr("x"),
						y : childElement.attr("y") - containerElement.attr("y")
					});
					
				}
			}
		}
		
		// 最后初始化连线
		for (let i = 0; i < links.length; i++) {
			let linkData = links[i];
			let fromId = linkData.from;
			let toId = linkData.to;
			let fromElement = tempElementMap[Number(fromId)];
			let toElement = tempElementMap[Number(toId)];
			let linkElement = this.createLinkWithLinkData(linkData, fromElement,
					toElement, editable);
			linkElement.data("properties", linkData.properties);
			
			if(!editable) {
				this.process.elements[linkElement.id] = linkElement;
			}
		}
		tempElementMap = null;
		return this.process;
	};
	validate() {
		let properties = this.process.properties;
		if (!properties.processCode) {
			alert("流程编码不能为空！");
			return false;
		}
		if (!properties.processName) {
			alert("流程名称不能为空！");
			return false;
		}
		if (!properties.version) {
			alert("流程版本不能为空！");
			return false;
		}
		return true;
	};
	clear() {
		this.initProcess();
		this.paper.clear();
	};

}


/**
 * 右键创建连线开始
 * @param targetElement
 */
function beginCreateLink(targetElement) {
	if(window.selectElement && selectElement != targetElement) {
		hideEditElements(selectElement);
	}
	showEditElements(selectElement = targetElement);
	
	// 设置激活状态
	window.activeFromElement = targetElement;
	showFadeOutText("点击节点完成连线,空白区域取消！");
}

/**
 * 水平对齐2个元素
 * @param targetElement
 * @param staticElement 参照对象不动
 */
function horizontalAlign(targetElement,staticElement) {
	
	// 对齐的算法： 2个元素的重心在一个水平线即y坐标相等
	var targetFocusY = targetElement.attr("y") + targetElement.attr("height") / 2;
	var staticFocusY = staticElement.attr("y") + staticElement.attr("height") / 2;
	targetElement.attr("y",targetElement.attr("y") + (staticFocusY - targetFocusY));
	
	var targetFocusX = targetElement.attr("x") + targetElement.attr("width") / 2;
	var staticFocusX = staticElement.attr("x") + staticElement.attr("width") / 2;
	// 如果重心横坐标距离导致有重叠，需要拉开距离
	if(Math.abs(targetFocusX - staticFocusX) < targetElement.attr("width") / 2 + staticElement.attr("width") / 2 + 20) {
		var newTargetElementX = targetFocusX > staticFocusX ? staticElement.attr("x") + staticElement.attr("width") + 50 : staticElement.attr("x") - 50 - targetElement.attr("width");
		targetElement.attr("x",Math.max(newTargetElementX,0));
	}
	updateElements.call(targetElement);
}

/**
 * 垂直对齐2个元素
 * @param targetElement
 * @param staticElement 参照对象不动
 */
function verticalAlign(targetElement,staticElement) {
	// 对齐的算法： 2个元素的重心在一个垂直线即x坐标相等
	var targetFocusX = targetElement.attr("x") + targetElement.attr("width") / 2;
	var staticFocusX = staticElement.attr("x") + staticElement.attr("width") / 2;
	targetElement.attr("x",targetElement.attr("x") + (staticFocusX - targetFocusX));
	
	var targetFocusY = targetElement.attr("y") + targetElement.attr("height") / 2;
	var staticFocusY = staticElement.attr("y") + staticElement.attr("height") / 2;
	if(Math.abs(targetFocusY - staticFocusY) < targetElement.attr("height") / 2 + staticElement.attr("height") / 2 + 20) {
		var newTargetElementY = targetFocusY > staticFocusY ? staticElement.attr("y") + staticElement.attr("height") + 50 : staticElement.attr("y") - 50 - targetElement.attr("height");
		targetElement.attr("y",Math.max(newTargetElementY,0));
	}
	
	updateElements.call(targetElement);
}

/**
 * ie测试输出
 * @param msg
 */
function debug(msg) {
	var html = $("#testDiv").html();
	$("#testDiv").html(html + "<br/>" + msg);
}

/**
 * 判断落点是否在容器内，业务规则引擎服务组使用
 * @param x
 * @param y
 */
function isDropToContainer(x,y) {
    let containers = process.containers;
	if(containers) {
		for(var i in containers) {
			var container = containers[i];
			var containerTargetElement = container.target;
//			if(containerTargetElement.data("type") != "serviceGroup") {
//				continue;
//			}
			var containerX = containerTargetElement.attr("x");
			var containerY = containerTargetElement.attr("y");
			var containerW = containerTargetElement.attr("width");
			var containerH = containerTargetElement.attr("height");
			if(x > containerX && x < (containerX + containerW) 
				&& y > containerY && y < (containerY + containerH)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 碰撞检测，当元素拖动到其他容器中时
 * @returns true  :  产生碰撞 <br>
 *          false :  未产生碰撞
 */
function containerCollisionDetection(x,y,w,h) {
	
	var containers = process.containers;
	if(containers) {
		
		for(var i in containers) {
			var container = containers[i];
			var containerTargetElement = container.target;
			
			var containerX = containerTargetElement.attr("x");
			var containerY = containerTargetElement.attr("y");
			var containerW = containerTargetElement.attr("width");
			var containerH = containerTargetElement.attr("height");
			
			if(x + w <= containerX || x >= containerX + containerW 
				|| y + h <= containerY || y >= containerY + containerH) {
				// 排除4个方向的极端，剩下的情况必然与容器产生碰撞
			} else {
				return true;
			}
		}
	} 
	
	return false;
}

/**
 * 创建规则节点
 * @param x
 * @param y
 * @param width
 * @param height
 * @param editable
 * @returns
 */
function createRuleNode(x, y, width, height,editable) {
	var rect = paper.rect(x, y, width, height, 8);
	rect.attr({
		"stroke" : "#BFBFBF",
		fill : DESIGN_SETTINGS.defaultRuleNodeBackgroundColor
	});
	rect.id = DataUtils.getId();
	rect.data("type","rule");
	if(!editable) {
		return rect;
	}
	autoContainerSelect(rect);
	initElement(rect);
	return rect;
}

/**
 * 创建服务节点
 * @param x
 * @param y
 * @param width
 * @param height
 * @param editable
 */
function createServiceNode(x, y, width, height,editable) {
	var rect = paper.rect(x, y, width, height, width / 2 , height / 2);
	rect.attr({
		"stroke" : "#BFBFBF",
		fill : DESIGN_SETTINGS.defaultNodeBackgroundColor,
		fill : "#47B1E5"
	});
	rect.id = DataUtils.getId();
	rect.data("type","service");
	if(!editable) {
		return rect;
	}
	autoContainerSelect(rect);
	
	initElement(rect);
	return rect;
}


/**
 * 创建服务组
 * @param x
 * @param y
 * @param width
 * @param height
 * @param editable
 * @returns
 */
function createServiceGroup(x, y, width, height,editable) {
	var rect = paper.rect(x, y, width, height,8);
	rect.attr({
		"stroke" : "black",
		fill : "white"
	});
	rect.id = DataUtils.getId();
	rect.data("type","serviceGroup");
	rect.data("nodeId",rect.id + "");
	if(!editable) {
		return rect;
	}
	initElement(rect);
	return rect;
}

// 导出类
export default FlowDesign;




