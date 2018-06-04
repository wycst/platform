/**
 动态的组件，通过render方法渲染
*/
export default {
    name: 'DynamicRender',
    props: {
        model: [String, Object],
        component: Object
    },
    methods: {
        update() {
            this.timestamp = new Date().getTime();
        },
        renderComponent(h, model) {
            
			let me = this;
            if (typeof(model) == 'string') {}

            let componentType = model.type;
            let props = model.props || {};

            let attrs = model.attrs;
            let children = model.children || [];
            let innerHtml = model.innerHtml;
            return h(componentType, {
                props: props,
                attrs: attrs
            },
            innerHtml ? innerHtml: children.filter(child => {
                return me.renderComponent(h, child);
            }));
        }
    },
    render(h) {
        if (this.timestamp && this.component) {
            return h(this.component);
        }
        return this.renderComponent(h, this.model);
    },
    data() {
        return {
            timestamp: new Date().getTime()
        };
    },
    watch: {
        'model.props': {
            handler(mod) {
                this.update();
            },
            deep: true
        },
		'model.attrs': {
            handler(mod) {
                this.update();
            },
            deep: true
        }
    }
}