/*
 * Inline text editing tool for Raphaël 2.0 & compatible with Raphaël Free transform.
 * Source: https://github.com/marmelab/Raphael.InlineTextEditing
 * Licensed under the MIT license
 */

//解决IE10以下不支持Function.bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["raphael"], function(Raphael) {
			// Use global variables if the locals are undefined.
			return factory(Raphael || root.Raphael);
		});
	} else {
		// RequireJS isn't being used. Assume Raphael is loaded in <script> tag
		factory(Raphael);
	}
}(this, function(Raphael) {

	Raphael.fn.inlineTextEditing = function(subject, options, callback) {

		// Store instance of the Raphael paper
		var paper = this;

		subject.inlineTextEditing = {
			paper : paper,
			input: null,
            defaultValue : subject.attr("text"),
			/**
			 * Start text editing by hiding the current element and adding a text field at the same position
			 * @return jQuery input element
			 */
			startEditing: function(){
				// Store Raphael container above the svg
				var container      = this.paper.canvas.parentNode;
				var translateX	    = 0;
				var translateY	    = 0;
				var transformOrder  = {};

				// Retrieve element transformation
				var rotation        = subject._.deg;
				var scaleX          = subject._.sx;
				var scaleY          = subject._.sy;
				var matrix          = subject.node.getAttribute('transform');

				// Check if the element has translations & retrieve transformations order
				for(var i = 0, length = subject._.transform ? subject._.transform.length : 0; i < length; i++){
					var matrixComponents = subject._.transform[i];
					var transform = matrixComponents[0].toLowerCase();
					transformOrder[transform] = transform;

					if(transform == 't'){
						translateX += matrixComponents[1];
						translateY += matrixComponents[2];
					}
				}


				// Check if there is implicit matrix
				for(var i = 0, length = subject._.transform ? subject._.transform.length : 0; i < length; i++){
					if(subject._.transform[i][0].toLowerCase() == 'm'){
						var matrixComponents = subject._.transform[i].slice(1);

						// Perform transformation from matrix elements
						rotation  += -1 * Math.asin(matrixComponents[2]) * 180 / Math.PI;
						scaleX    *= matrixComponents[0] / Math.cos(rotation*Math.PI/180);
						scaleY    *= matrixComponents[3] / Math.cos(rotation*Math.PI/180);

						transformOrder = {r: 'r', s:'s'};
					}
				}

				// Remove transformation on the current element to retrieve original dimension
				subject.node.removeAttribute('transform');

				var originalBbox  = subject._getBBox();
				var width         = Math.max(originalBbox.width,60);
				var height        = Math.max(originalBbox.height,16);
				var x             = container.offsetLeft + subject.attrs.x + translateX;
				var y             = container.offsetTop + subject.attrs.y - height / 2 + translateY;
				var sTransform    = '';
				var sOrigin       = 'center center';
				var oTransform    = {
					//	t : 'translate('+(translateX)+'px, '+(translateY)+'px)',
					r : 'rotate('+rotation+'deg)',
					s : 'scale('+scaleX+', '+scaleY+')'
				};

				// Build transform CSS property in the same order than the element
				for(var transform in transformOrder){
					if(oTransform[transform] != undefined){
						sTransform += oTransform[transform] + ' ';
					}
				}

				// Re-apply stored transformation to the element and hide it
				if(matrix) {
					subject.node.setAttribute("transform", matrix);
				}

			    // 获取滚动条
			    var scrollContainer = $(container).parent();
			    var scrollLeft = scrollContainer.scrollLeft();
			    var scrollTop = scrollContainer.scrollTop();
			    
				subject.hide();

				// Prepare input styles
				var oStyles = {
					position: 'absolute',
					background: 'none',
					left: (x - 20 - scrollLeft)+'px',
					top: (y - scrollTop)+'px',
					width: width+'px',
					height: height+'px',
					color: subject.attrs.fill,

					'-moz-transform-origin': sOrigin,
					'-ms-transform-origin': sOrigin,
					'-o-transform-origin': sOrigin,
					'-webkit-transform-origin': sOrigin,
					'transform-origin': sOrigin,

					'-moz-transform' : sTransform,
					'-ms-transform' : sTransform,
					'-o-transform' : sTransform,
					'-webkit-transform' : sTransform,
					'transform' : sTransform
				};

				// Retrieve font styles
				var aFontAttributes = ['font', 'font-family', 'font-size', 'font-style', 'font-weight', 'font-variant'/*, 'line-height'*/];

				for(var i = 0, length = aFontAttributes.length; i < length; i++){
					var attribute = aFontAttributes[i];

					if(subject.attrs[attribute] != undefined){
						oStyles[attribute] = subject.attrs[attribute];
					}

					if(subject.node.style[attribute] != undefined){
						oStyles[attribute] = subject.node.style[attribute];
					}
				}

				var sStyles = '';
				for(var z in oStyles){
					sStyles += z + ':' + oStyles[z] + ';';
				}

				// Create an input element with theses styles
				this.input = document.createElement("input");
				this.input.value = subject.attrs.text ? subject.attrs.text.replace(/\'/g,"\\\'") : '';
				this.input.setAttribute("style", sStyles);

				// this.input.addEventListener('keyup', this._handleKeyDown.bind(this));
                // 处理ie低版本下面不支持addEventListener方法的问题
				var me = this;
				$(this.input).on("keyup",function () {
					me._handleKeyDown.bind(me);
				});
				
				$(scrollContainer).unbind("scroll").scroll(function() {
					// 滚动时结束编辑
					$(this).unbind("scroll");
					me.input.blur();
				});
				
				// Add the input in the container and apply focus on it
				container.appendChild(this.input);
				this.input.focus();

				return this.input;
			},

			/**
			 * Apply text modification and remove associated input
			 */
			stopEditing: function(){

				var inputValue = this.input.value;
				
				if(!inputValue) inputValue = subject.inlineTextEditing.defaultValue;
				
				// Set the new the value
				subject.attr("text", inputValue);

				// Show the text element
				subject.show();

				// Remove text input
				this.input.parentNode.removeChild(this.input);
			},

			_handleKeyDown: function(e){
				var tmp               = document.createElement("span");
				var text              = this.input.value;
				tmp.setAttribute('style', this.input.style.cssText);
				tmp.style.height      = null;
				tmp.style.width       = null;
				tmp.style.visibility  = 'hidden';
				tmp.innerHTML         = text.split('\n').join('<br />');

				this.input.parentNode.appendChild(tmp);

				this.input.style.width = Math.max(tmp.offsetWidth,60) + "px";
				this.input.style.height = Math.max(tmp.offsetHeight,16) + "px";

				tmp.parentNode.removeChild(tmp);
			}
		};

		return subject.inlineTextEditing;
	}

}));