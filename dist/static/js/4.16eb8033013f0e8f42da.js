webpackJsonp([4],{O3gl:function(t,e){},"zln+":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("Dd8w"),s=a.n(r),i=a("NYxO"),n={name:"List",data:function(){return{articles:[]}},computed:s()({},Object(i.b)(["auth","user"])),beforeRouteEnter:function(t,e,a){a(function(e){e.articles=e.$store.getters.getArticlesByUid(null,t.params.user)})}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("b-col",[a("b-breadcrumb",{staticClass:"bg-white"},[a("b-breadcrumb-item",{attrs:{to:"/"}},[a("b-icon",{attrs:{icon:"house-fill",scale:"1.25","shift-v":"1.25","aria-hidden":"true"}}),t._v("\n         Home\n        ")],1),t._v(" "),a("b-breadcrumb-item",{attrs:{active:""}},[t._v("文章列表")])],1),t._v(" "),a("b-card",{staticClass:"border shadow-sm p-3 mb-5"},[a("b-card-title",[a("h3",{staticClass:"mb-3 font-weight-bolder"},[a("b-icon",{staticClass:"h1",attrs:{icon:"file-earmark-text",variant:"primary"}}),t._v("\n                    文章列表")],1)]),t._v(" "),a("b-list-group",{attrs:{flush:""}},t._l(t.articles,function(e,r){return a("b-list-group-item",{key:e.articleId,staticClass:"flex-column align-items-start"},[a("b-media",{attrs:{tag:"li"},scopedSlots:t._u([{key:"aside",fn:function(){return[a("b-avatar",{attrs:{text:""+(r+1),variant:"info"}})]},proxy:!0}],null,!0)},[t._v(" "),a("h5",{staticClass:"mt-2"},[a("router-link",{staticClass:"title",attrs:{to:"/articles/"+e.articleId+"/content"}},[t._v("\n                                "+t._s(e.title)+"\n                            ")])],1),t._v(" "),a("p",{staticClass:"mb-0 float-right"},[a("abbr",[t._v(t._s(t._f("moment")(e.date,"from")))])])])],1)}),1)],1)],1)},staticRenderFns:[]};var l=a("VU/8")(n,c,!1,function(t){a("O3gl")},"data-v-fe1c4ffc",null);e.default=l.exports}});
//# sourceMappingURL=4.16eb8033013f0e8f42da.js.map