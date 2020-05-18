<template>
    <b-navbar toggleable="md" type="light" variant="light" class="fixed-top shadow-sm pb-0 mb-5">
        <b-navbar-brand to="/">
            <img src="@/assets/logo.png" class="d-inline-block align-top" alt="logo">
            ForumDemo
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
               <!-- <b-nav-item href="#" active>文章</b-nav-item> -->
            </b-navbar-nav>

            <!-- 右側 -->
            <b-navbar-nav class="ml-auto">

                <b-nav-form inline @submit="search">
                    <b-input-group>
                        <b-input-group-prepend is-text>
                            <b-icon icon="search"></b-icon>
                        </b-input-group-prepend>
                        <b-form-input class="mr-1" 
                            v-model.trim="value" 
                            @keyup.enter="search"
                            @input="updateSearchValue"
                            type="search" placeholder="搜尋文章"
                        >
                        </b-form-input>
                        <b-button class="my-0 mr-3" type="submit" 
                        variant="outline-success">查詢</b-button>
                    </b-input-group>
                </b-nav-form>

                <b-nav-item-dropdown v-if=" user && auth " right>
                    <template v-slot:button-content>
                        <b-avatar variant="light" v-if="user.avatar" :src="user.avatar" alt="avatar">
                        </b-avatar>
                        <span v-if="user.name">{{ user.name }}</span>
                    </template>
                    <b-dropdown-item :to="`/users/${uid}/edit`">
                        <b-icon icon="person-lines-fill"></b-icon> 個人資料
                    </b-dropdown-item>
                    <b-dropdown-item to="/articles/create">
                        <b-icon icon="file-plus"></b-icon> 創作文章
                    </b-dropdown-item>
                    <b-dropdown-item :to="`/${user.name}`">
                        <b-icon icon="file-earmark-text"></b-icon> 文章列表
                    </b-dropdown-item>

                    <b-dropdown-item @click="logout">
                        <b-icon icon="box-arrow-up-right"></b-icon> 登出
                    </b-dropdown-item>
                </b-nav-item-dropdown>

                <span v-else>
                    <div class="nav navbar-nav my-3 my-md-1">
                        <b-input-group>
                            <b-button to="/auth/login" variant="outline-secondary" squared>
                                <b-icon icon="box-arrow-in-right"></b-icon>
                                登 入</b-button>
                            <b-button to="/auth/register" variant="outline-info" squared>
                                <b-icon icon="person-plus-fill"></b-icon>
                                註 冊</b-button>
                        </b-input-group>
                    </div>
                </span>


            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'TheHeader',
    data() {
        return {
            uid: 1,
            boxShow: false,
            value:''
        }
    },
    computed: {
        ...mapState([
            'auth',
            'user'
        ]),
        searchValue: {
            get() {
                return this.$store.state.searchValue
            },
            set(newValue) {
                this.value = newValue
            }
        }
    },
    methods: {
        logout() {
            // 提醒確認是否登出
            this.$bvModal.msgBoxConfirm('是否確認要登出?', {
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'danger',
                    okTitle: '是',
                    cancelTitle: '否',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
            .then(value => {
                if(value){
                    // 登出
                    this.$store.dispatch('logout')
                }
            })
            .catch(err => {
               alert('登出發生異常錯誤!')
               
            })

        },
        search(evt) {
            evt.preventDefault()
            const value = this.value
            if (value !== '') {
                // 到 Search.vue 顯示
                this.$router.push({ name: 'Search', query: { q: value } }).catch(() => {})
            }
        },
        // 更新 searchValue
        updateSearchValue() {
            // 未用 action 直接用 mutation
            this.$store.commit('UPDATE_SEARCH_VALUE', this.value)
        }
    }
}
</script>

<style scoped>
    nav { border-top: 2px solid #4fc08d; }
    nav a img{width: 35px;height: 35px;}
    .navbar {
        padding: .3rem 1rem;
    }
</style>