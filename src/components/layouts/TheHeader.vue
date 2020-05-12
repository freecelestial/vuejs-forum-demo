<template>
    <b-navbar toggleable="lg" type="light" variant="light" class="fixed-top shadow-sm pb-0 mb-5">
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
                <b-nav-form class="mr-md-4" >
                    <b-input-group size="sm" class="mb-2">
                        <b-input-group-prepend is-text>
                            <b-icon icon="search"></b-icon>
                        </b-input-group-prepend>
                        <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>

                        <b-button size="sm" class="my-2 my-sm-0" 
                        variant="outline-success" type="submit">Search</b-button>
                    </b-input-group>
                </b-nav-form>

                <b-nav-item-dropdown v-if=" user && auth " right>
                        <template v-slot:button-content>
                            <span v-if="user">
                                <b-img v-if="user.avatar" :src="user.avatar" 
                                rounded="circle" alt="User Image"></b-img>
                                <span v-if="user.name">{{ user.name }}</span>
                            </span>
                        </template>
                        <b-dropdown-item :to="`/${user.name}`">
                            <b-icon icon="people-circle"></b-icon> 個人資料</b-dropdown-item>
                        <b-dropdown-item @click="logout">
                            <b-icon icon="box-arrow-up-right"></b-icon> 登出</b-dropdown-item>
                </b-nav-item-dropdown>

                <span v-else>
                    <div class="nav navbar-nav github-login">
                        <b-button-group>
                        <b-button size="sm" to="/auth/login" variant="outline-secondary" squared>
                            <b-icon icon="box-arrow-in-right"></b-icon>
                            登 入</b-button>
                        <b-button size="sm" to="/auth/register" variant="outline-info" squared>
                            <b-icon icon="person-plus-fill"></b-icon>
                            註 冊</b-button>
                        </b-button-group>
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
    computed: {
        ...mapState([
            'auth',
            'user'
        ])
    },
    data() {
        return {
            boxShow:false,
        }
    },
    methods: {
        logout() {
                // 提醒確認是否登出
                this.boxTwo = ''
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

        }
    }
}
</script>

<style scoped>
    nav { border-top: 4px solid #4fc08d; }
    nav a img{width: 30px;height: 30px;}

</style>