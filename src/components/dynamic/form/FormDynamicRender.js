/**
 * ��̬��form�����ͨ��render������Ⱦ
 * ֧��v-model��̬��
 */
import DynamicRender from '../DynamicRender'
export default {
    name: 'FormDynamicRender',
	extends : DynamicRender,
    props: {
		/* ��չ������ */
		/* v-model */
        value: [String, Number],
		/* �����ݶ���*/
		formModel : Object,
		/* Զ�������ݽӿ��Ƿ��Զ�����*/
	    autoLoad  : Boolean
    },
	mounted() {
		// ͨ��render��Ⱦ���������ֻ������Ⱦ��ɺ��ȡ
        this.childComponent = this.$children[0];
	},
    methods: {
        setComponentValue(v) {
            if (this.componentValue != v) {
                this.componentValue = v;
				// ��childComponent�����Ը�ֵ
				// ��ʱcurrentValueʹ�õ�Input
				// ������Ҫ��չһ�£�
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