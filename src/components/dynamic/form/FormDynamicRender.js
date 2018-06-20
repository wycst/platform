/**
 * 动态的form组件，通过render方法渲染
 * 支持v-model动态绑定
 */
import DynamicRender from '../DynamicRender'
export default {
    name: 'FormDynamicRender',
	extends : DynamicRender,
    props: {
		/* 拓展表单属性 */
		/* v-model */
        value: [String, Number],
		/* 表单数据对象*/
		formModel : Object,
		/* 远程类数据接口是否自动加载*/
	    autoLoad  : Boolean
    },
	mounted() {
		// 通过render渲染的子组件，只能在渲染完成后获取
        this.childComponent = this.$children[0];
	},
    methods: {
        setComponentValue(v) {
            if (this.componentValue != v) {
                this.componentValue = v;
				// 给childComponent的属性赋值
				// 暂时currentValue使用的Input
				// 这里需要拓展一下？
				this.childComponent.setCurrentValue(v);
            }
        },
        renderComponent(h, model) {
            let me = this;
            if (typeof(model) == 'string') {}

            let componentType = model.type;
            let props = model.props || {};
            let attrs = model.attrs;

            // v-model default value
			let defaultValue = props.value;
            if(defaultValue) {
			    this.$emit('input', defaultValue);
			}

            let children = model.children || [];
            let innerHtml = model.innerHtml;
            return h(componentType, {
                props: Object.assign({
				    formModel : this.formModel,
					value : defaultValue
				},props),
                attrs: attrs,
                on: {
                    input: function(v) {
                        // v-model
                        me.$emit('input', v);
                    }
                }
            },
            innerHtml ? innerHtml: children.filter(child => {
                return me.renderComponent(h, child);
            }));
        }
    },
    render(h) {
		// console.log(JSON.stringify(this.model.props));
        if (this.timestamp && this.component) {
            return h(this.component);
        }
        return this.renderComponent(h, this.model);
    },
    data() {
        return {
			childComponent : Object,
            componentValue : null
        };
    },
    watch: {
        value(val,v) {
			// if value change 
            this.setComponentValue(val);
        }
    }
}