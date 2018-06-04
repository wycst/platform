import {otherRouter, appRouter} from '@/router/router.js'
// import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';

const app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: ["workflow"], 
		openNames : [],    // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [], // 面包屑数组
        menuList: [],
		pathMapping : {},
        routers: [
            otherRouter,
            ...appRouter
        ],
        tagsList: [],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    mutations: {
		init (state) {

            let routers = state.routers;
			let pathMapping = state.pathMapping;
			let tagsList = state.tagsList;

            routers.forEach(item => {
			     let name = item.name;
			     pathMapping[name] = item;
                 // 设置CurrentPath
                 var currentPathArr = [
						{
							title: '首页',
							path: '/home',
							name: 'home_index'
						}];
                 if(item.title) {
					currentPathArr.push({
								title: item.title,
								//path: item.path + '/' + item.children[0].path,
								name: item.name
							});
				 }

                 if(item.children) {
					 tagsList.push(...item.children);
					 let len = item.children.length;
				     if(len == 0) {
						 // 不存在的情况
					 } else if(len == 1){
						let child = item.children[0];
						child.pathTextArr = currentPathArr;
						pathMapping[child.name] = child;
					 } else {
					    item.children.forEach(child => {
							let childName = child.name;
						    pathMapping[childName] = child;
                            child.pathTextArr = [
							    ...currentPathArr
								];
                            if(childName != "home_index") {
							    child.pathTextArr.push({
										title: child.title,
										//path: item.path + (item.path == "/" ? '' : '/') + child.path,
										name: child.name
									});
							} 
						});
					 }
				 }
			});

		},
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('access'));
            let menuList = [];
            appRouter.forEach((item, index) => {
                if (item.access !== undefined) {
                    if (Util.showThisRoute(item.access, accessCode)) {
                        if (item.children.length === 1) {
                            menuList.push(item);
                        } else {
                            let len = menuList.push(item);
                            let childrenArr = [];
                            childrenArr = item.children.filter(child => {
                                if (child.access !== undefined) {
                                    if (child.access === accessCode) {
                                        return child;
                                    }
                                } else {
                                    return child;
                                }
                            });
                            menuList[len - 1].children = childrenArr;
                        }
                    }
                } else {
                    if (item.children.length === 1) {
                        menuList.push(item);
                    } else {
                        let len = menuList.push(item);
                        let childrenArr = [];
                        childrenArr = item.children.filter(child => {
                            if (child.access !== undefined) {
                                if (Util.showThisRoute(child.access, accessCode)) {
                                    return child;
                                }
                            } else {
                                return child;
                            }
                        });
                        if (childrenArr === undefined || childrenArr.length === 0) {
                            menuList.splice(len - 1, 1);
                        } else {
                            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                            handledItem.children = childrenArr;
                            menuList.splice(len - 1, 1, handledItem);
                        }
                    }
                }
            });
            state.menuList = menuList;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        setOpenName(state, name) {
			let currentItem = state.pathMapping[name];
            if(currentItem) {
				let openNames = state.openNames;
				let paths = currentItem.pathTextArr;
                if(paths.length > 1) {
				   let openName = paths[1].name;
				   if(openName && openNames.indexOf(openName) == -1) {
						openNames.push(openName);
				   }
				}
			} 
		},
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setCurrentPath (state, toName) {
            let currentItem = state.pathMapping[toName];
            if(currentItem) {
				state.currentPath = currentItem.pathTextArr;
			} 
        },
        openNewTab (state,name,argu,query) {
			 let hasTag = state.pageOpenedList.some(item => {
                 if (item.name === name) {
                     return true;
                 }
             });
             if (!hasTag) { 
                 // 创建新的tab
                 // 根据name查找tagList的item然后push到pageOpenedList
                 let toTags = state.tagsList.filter((item) => {
						if (item.children) {
							return name === item.children[0].name;
						} else {
							return name === item.name;
						}
					});
				 let toTag = toTags[0];
                 toTag = toTag.children ? toTag.children[0] : toTag;
                 if (argu) {
					toTag.argu = argu;
				 }
				 if (query) {
					toTag.query = query;
				 }
                 state.pageOpenedList.push(toTag);
				 localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);

                 if(state.cachePage.indexOf(name) == -1) {
					 state.cachePage.push(name);
				 }
				 localStorage.cachePage = JSON.stringify(state.cachePage);
             }
		},
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang (state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount (state, count) {
            state.messageCount = count;
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    }
};

export default app;
