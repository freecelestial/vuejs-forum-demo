webpackJsonp([3],{"4nld":function(t,e){},NAYc:function(t,e){},j7e0:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Dd8w"),s=a.n(n),r=a("NYxO"),i={name:"TabContent",props:{articles:{type:Array,default:[]}}},l={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("b-list-group",{attrs:{tag:"ul",flush:""}},t._l(t.articles,function(e){return a("b-list-group-item",{key:e.articleId,staticClass:"flex-column align-items-start border-top-0 border-left-0 \n        border-right-0",attrs:{to:"/articles/"+e.articleId+"/content"}},[a("b-media",{attrs:{tag:"li"},scopedSlots:t._u([{key:"aside",fn:function(){return[a("b-avatar",{attrs:{to:"/"+e.uname,variant:"info",src:e.uavatar}})]},proxy:!0}],null,!0)},[t._v(" "),a("span",{staticClass:"d-inline-block mt-1",staticStyle:{"font-size":"1.2em","font-weight":"600"}},[t._v("\n                "+t._s(e.title)+"\n            ")]),t._v(" "),a("span",{staticClass:"mb-0 float-right"},[a("span",[a("b-button",{staticStyle:{cursor:"auto"},attrs:{variant:"white",title:"按讚數",disabled:""}},[a("b-icon",{attrs:{icon:"heart-fill",variant:"danger"}}),t._v("\n                        "+t._s(e.likeUsers?e.likeUsers.length:0)+"\n                    ")],1)],1),t._v(" "),a("span",[a("b-button",{staticStyle:{cursor:"auto"},attrs:{variant:"white",title:"留言數",disabled:""}},[a("b-icon",{attrs:{icon:"chat-dots-fill",variant:"info"}}),t._v("\n                        "+t._s(e.comments?e.comments.length:0)+"\n                    ")],1)],1),t._v(" "),a("span",{staticClass:"badge badge-light",staticStyle:{cursor:"auto"}},[t._v("\n                    "+t._s(t._f("moment")(e.date,"from")))])])])],1)}),1)},staticRenderFns:[]};var o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("b-card",{staticClass:"text-center shadow-sm p-1 mb-1",attrs:{"header-bg-variant":"transparent",header:"廣告播放","bg-variant":"Default"}},[a("b-card-text",[a("b-carousel",{staticStyle:{"text-shadow":"1px 1px 2px #333"},attrs:{id:"carousel-1",interval:4e3,controls:"",indicators:"",background:"#ababab"},on:{"sliding-start":t.onSlideStart,"sliding-end":t.onSlideEnd},model:{value:t.slide,callback:function(e){t.slide=e},expression:"slide"}},t._l(t.slides,function(t){return a("b-carousel-slide",{key:t.img,attrs:{"img-src":t.img}},[a("p")])}),1)],1)],1),t._v(" "),a("b-card",{staticClass:"text-center shadow-sm p-1 mb-1",attrs:{"header-bg-variant":"transparent",header:"活躍用戶","bg-variant":"Default"}},[a("b-card-text",{staticClass:"text-left"},[a("h5",t._l(t.activeUsers,function(e){return a("b-badge",{key:e.name,staticStyle:{color:"#666"},attrs:{to:"/"+e.name,variant:"white"}},[a("b-avatar",{attrs:{variant:"info",src:e.avatar}}),t._v(" \n                    "+t._s(e.name)+"\n                ")],1)}),1)])],1),t._v(" "),a("b-card",{staticClass:"text-center shadow-sm p-1 mb-1",attrs:{"header-bg-variant":"transparent",header:"七天內最多留言","bg-variant":"Default","no-body":""}},[a("b-card-text",{staticClass:"text-left text-secondary"},[a("b-list-group",{attrs:{flush:""}},t._l(t.hotArticles,function(e,n){return a("b-list-group-item",{key:n,staticStyle:{color:"#555"}},[a("router-link",{staticStyle:{color:"#555"},attrs:{to:"/articles/"+e.articleId+"/content"}},[a("span",[t._v(t._s(n+1)+".")]),t._v("\n                        "+t._s(e.title)+"\n                    ")])],1)}),1)],1)],1)],1)},staticRenderFns:[]};var c={name:"Home",components:{TabContent:a("VU/8")(i,l,!1,function(t){a("NAYc")},"data-v-63bca0ae",null).exports,TheSidebar:a("VU/8")({name:"Sidebar",data:function(){return{slides:[{title:"廣告書籍1",img:"https://www.books.com.tw/img/001/079/19/0010791912_bc_01.jpg",link:""},{title:"廣告書籍2",img:"https://www.books.com.tw/img/001/078/08/0010780802_bc_01.jpg",link:""}],slide:0,sliding:null,activeUsers:[],hotArticles:[]}},created:function(){var t=this;this.$axios.get("/users/active").then(function(e){t.activeUsers=e.data}),this.$axios.post("/articles/hot",{num:3}).then(function(e){t.hotArticles=e.data})},methods:{onSlideStart:function(t){this.sliding=!0},onSlideEnd:function(t){this.sliding=!1}}},o,!1,function(t){a("4nld")},"data-v-941080be",null).exports},data:function(){return{articles:[],filter:"default",filters:[{filter:"default",name:"活躍",title:"依最新留言排序"},{filter:"excellent",name:"注目",title:"只看加精的話題"},{filter:"vote",name:"精品",title:"點讚數排序"},{filter:"recent",name:"最新",title:"文章發佈時間排序"},{filter:"morereply",name:"人氣",title:"評論多的話題"}],pageSize:10,totalRows:0}},beforeRouteEnter:function(t,e,a){var n=e.name,s=t.params.logout;a(function(t){if(t.$store.state.auth)switch(n){case"Register":t.makeToast("註冊成功");break;case"Login":t.makeToast("登入成功")}else s&&t.makeToast("登出成功");t.setDataByFilter()})},computed:s()({},Object(r.b)(["auth","user"]),{currentPage:function(){return parseInt(this.$route.query.page)||1},numberOfPages:function(){return Math.ceil(this.totalRows/this.pageSize)||1}}),watch:{auth:function(t){t||this.makeToast("登出成功")},$route:function(t){this.setDataByFilter()}},methods:{makeToast:function(t){this.$bvToast.toast(t,{title:"訊息",toaster:"b-toaster-bottom-right",autoHideDelay:5e3,appendToast:!0})},countDownChanged:function(t){this.dismissCountDown=t},setDataByFilter:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"default",e=this.pageSize,a=this.currentPage,n=this.$store.getters.getArticlesByFilter(t);this.filter=t,this.totalRows=n.length,this.articles=n.slice(e*(a-1),e*a)},linkGen:function(t){return 1===t?"?":"?page="+t}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("b-row",{attrs:{"align-h":"center"}},[a("b-col",{attrs:{md:"9"}},[a("b-card",{attrs:{"no-body":""}},[a("b-tabs",{attrs:{pills:"",card:""}},t._l(t.filters,function(e){return a("b-tab",{key:e.name,class:{active:t.filter===e.filter},attrs:{title:e.title,"no-body":""},on:{click:function(a){return t.setDataByFilter(e.filter)}}},[a("b-card-text",[a("TabContent",{attrs:{articles:t.articles}}),t._v(" "),a("div",{staticClass:"mt-5 overflow-auto"},[a("b-pagination-nav",{attrs:{"link-gen":t.linkGen,"number-of-pages":t.numberOfPages,"use-router":"",align:"center","first-number":"","last-number":""}})],1)],1)],1)}),1)],1)],1),t._v(" "),a("b-col",{staticClass:"d-none d-lg-block",attrs:{md:"3"}},[a("TheSidebar")],1)],1)},staticRenderFns:[]};var d=a("VU/8")(c,u,!1,function(t){a("y+Ek")},"data-v-6b884558",null);e.default=d.exports},"y+Ek":function(t,e){}});
//# sourceMappingURL=3.554373c5aa9545c5acd0.js.map