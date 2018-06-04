<style lang="less">
    @import "./main.less";
</style>
<template>

    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
             <sidebar-menu :shrink="shrink" :open-names="openNames" :menuList="menuList" @on-change="onChange"></sidebar-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button @click="toggleClick" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <template>
			    <Breadcrumb>
				<BreadcrumbItem 
				    v-for="item in currentPath" 
				    :href="item.path" 
				    :key="item.name"
				>{{ item.title }}</BreadcrumbItem>
			    </Breadcrumb>
			</template>
                    </div>
                </div>
                <div class="header-avator-con">
                    
                    <template>
			    <div  class="full-screen-btn-con">
				<Tooltip content="全屏" placement="bottom">
				    <Icon :type="isFullScreen ? 'arrow-shrink' : 'arrow-expand'" :size="23"></Icon>
				</Tooltip>
			    </div>
                            <div  class="lock-screen-btn-con">
				<Tooltip content="锁屏" placement="bottom">
				    <Icon type="locked" :size="20"></Icon>
				</Tooltip>
			    </div>
                            <div class="message-con">
				<Tooltip content="有3条未读消息" placement="bottom">
				    <Badge count="3" dot>
					<Icon type="ios-bell" :size="22"></Icon>
				    </Badge>
				</Tooltip>
			    </div>
		    </template>
                    <theme-switch></theme-switch>

                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
			    <Avatar :src="avatarSrc" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>

            <div class="tags-con">
                <tabs :pageTagsList="pageTagsList"></tabs>
            </div>

        </div>
        
	<div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>

    </div>
</template>
<script>
    import themeSwitch from '@/views/main/theme-switch/theme-switch';
    import sidebarMenu from '@/views/main/sidebar-menu/sidebarMenu';
    import tabs from '@/views/main/tabs/Tabs';
    export default {
        components: {
	    themeSwitch,
	    sidebarMenu,
	    tabs
	},
        data () {
            return {
                shrink: false,
		//value : 4,
                userName: 'iview_admin',
		avatarSrc : 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg',
                isFullScreen: false
            };
        },
        computed: {
	    menuTheme () {
                return this.$store.state.app.menuTheme;
            },
	    menuList () {
                return this.$store.state.app.menuList;
            },
	    openNames() {
	        return this.$store.state.app.openNames;
	    },
	    currentPath () {
	        return this.$store.state.app.currentPath;
	    },
	    pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
	    cachePage () {
                return this.$store.state.app.cachePage;
            }
        },
        methods: {
            toggleClick() {
	       this.shrink = !this.shrink;
	    },
	    onChange (name) {
                let willpush = true;
		if (this.beforePush !== undefined) {
		     if (!this.beforePush(name)) {
			willpush = false;
		     }
		}
		if (willpush) {
	             this.$router.push({
		         name: name
		     });
		}
	    }
        },
        mounted () {
	    this.$store.commit('setOpenName', this.$route.name);
	    this.$store.commit('setCurrentPath', this.$route.name);
            this.$store.commit('openNewTab', this.$route.name,this.$route.params || {}, this.$route.query || {});
	},
        created () {
        },
        watch: {
            '$route' (to) {
		this.$store.commit('setOpenName', to.name);
	        // 更新路径
                this.$store.commit('setCurrentPath', to.name);
		// 更新标签
                this.$store.commit('openNewTab', to.name);
		this.$store.commit('setCurrentPageName', to.name);
                localStorage.currentPageName = to.name;
            }
        }
    };
</script>
