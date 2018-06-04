<style lang="less">
    @import "./home.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            
	    <Col :lg="12">
                <Row class-name="home-page-row1" :gutter="8">
                    <Col :lg="24" :style="{marginBottom: '5px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="ios-bell"></Icon>
                                公告
                            </p>
                            <div class="to-do-list-con">
                                测试公告
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
	    
	    <Col :lg="12">
                <Row class-name="home-page-row1" :gutter="8">
                    <Col :lg="24" :style="{marginBottom: '5px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="clock"></Icon>
                                我的待办
                            </p>
                            <a type="text" slot="extra" @click.prevent="">
                                <Icon type="plus-round"></Icon>
                            </a>
                            <Modal
                                title="添加新的待办事项"
                                @on-ok=""
                                @on-cancel="">
                                <Row type="flex" justify="center">
                                    <Input icon="compose" placeholder="请输入..." style="width: 300px" />
                                </Row>
                                <Row slot="footer">
                                    <Button type="text" @click="">取消</Button>
                                    <Button type="primary" @click="">确定</Button>
                                </Row>
                            </Modal>
                            <div class="to-do-list-con">
                                今天去哪吃？
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>

        </Row> 

        <Row :gutter="10">
            <Col :lg="12">
                <Row class-name="home-page-row1" :gutter="8">
                    <Col :lg="24" :style="{marginBottom: '5px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="ios-pulse-strong"></Icon>
                                流程统计
                            </p>
                            <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                                <Icon type="more"></Icon>
                            </a>
                            <div class="to-do-list-con">
                                统计
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>

	    <Col :lg="12">
                <Row class-name="home-page-row1" :gutter="8">
                    <Col :lg="24" :style="{marginBottom: '5px'}">
                        <Card>
                            <p slot="title" class="card-title">
                                <Icon type="android-checkbox-outline"></Icon>
                                已办事项
                            </p>
                            <div class="to-do-list-con">
			        已经吃过了羊蝎子
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>  

    </div>
</template>

<script>

export default {
    name: 'home',
    components: {
    },
    data () {
        return {
           avatorPath : 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
        };
    }
};
</script>
