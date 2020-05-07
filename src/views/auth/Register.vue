<template>
  <ValidationObserver v-slot="{ invalid }">
        <form @submit.prevent="onSubmit">
            <div class="row">
                <div class="col-md-4 col-md-offset-4 floating-box">
                <!-- 消息组件 -->
                <Message :show.sync="msgShow" :type="msgType" :msg="msg"/>
                <!-- .sync 表示雙向綁字 
                上列等同於 <Message :show="msgShow" @update:show="val => msgShow = val" 
                :type="msgType" :msg="msg"/>-->
                    
                    <div class="panel panel-default">
                        <div class="panel-heading">
                        <h3 class="panel-title">請註冊</h3>
                        </div>

                        <div class="panel-body">
                            <div class="form-group">
                                <label class="control-label">用户名</label>
                                <ValidationProvider name="用户名" 
                                rules="required|min:3|max:30|alpha_first" v-slot="{ classes,errors }">
                                <div class="control" :class="classes">
                                    <input class="form-control" v-model.trim="username" type="text">
                                    <span>{{ errors[0] }}</span>
                                </div>
                                </ValidationProvider>
                            </div>

                            <div class="form-group">
                                <label class="control-label">密碼</label>
                                <ValidationProvider name="密碼" 
                                rules="required|min:6|max:16" v-slot="{ classes,errors }" vid="password">
                                    <div class="control" :class="classes">
                                        <input class="form-control" v-model.trim="password" type="password">
                                        <span>{{ errors[0] }}</span>
                                    </div>
                                </ValidationProvider>
                            </div>

                            <div class="form-group">
                                <label class="control-label">確認密碼</label>
                                <ValidationProvider name="確認密碼" rules="required|confirmed:password" v-slot="{ classes,errors }" >
                                    <div class="control" :class="classes">
                                        <input class="form-control" v-model.trim="cpassword" type="password">
                                        <span>{{ errors[0] }}</span>
                                    </div>
                                </ValidationProvider>
                            </div>

                            <div class="form-group">
                                <label class="control-label">圖片驗證碼</label>
                                <ValidationProvider name="圖片驗證碼" 
                                rules="required" v-slot="{ classes,errors }">
                                    <div class="control" :class="classes">
                                        <input class="form-control" v-model.trim="captcha" type="text">
                                        <span>{{ errors[0] }}</span>
                                    </div>
                                </ValidationProvider>
                            </div>
                            <div class="thumbnail" title="點擊圖片重新獲取驗證碼" @click="getCaptcha">
                                <div class="captcha vcenter" v-html="captchaTpl"></div>
                            </div>

                            <button type="submit" :disabled="invalid" class="btn btn-lg btn-success btn-block">
                                <i class="fa fa-btn fa-sign-in"></i> 註冊
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    </ValidationObserver>
</template>

<script>
import createCaptcha from '@/utils/createCaptcha'
import ls from '@/utils/localStorage'
// 引入表單驗證
import { ValidationProvider, extend ,ValidationObserver} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/zh_TW.json';

// 可使用所有rules
Object.keys(rules).forEach(rule => {
    extend(rule, {
         ...rules[rule], // copies rule configuration
         message: messages[rule] // assign message
    });
});
extend('alpha_first', {
    validate: value => {
        return value.match(/^[a-zA-Z]+\w*\s?\w*$/) !== null
    },
    message: '第一個字符，需以字母開頭'
});

export default {
    name: 'Register',
    data() {
        return {
            captchaTpl: '', // 验证码模板
            username: '', // 用户名
            password: '', // 密码
            cpassword: '', // 确认密码
            captcha: '', // 验证码
            msg: '', // 消息
            msgType: '', // 消息类型
            msgShow: false // 是否显示消息，默认不显示
        }
     },
    created() {
        this.getCaptcha()
    },
    methods: {
        getCaptcha() {
            const { tpl, captcha } = createCaptcha(1)
            this.captchaTpl = tpl
            this.localCaptcha = captcha
        },
        onSubmit() {
            if (this.captcha.toUpperCase() !== this.localCaptcha) {
                this.showMsg('驗證碼不正確')
                this.getCaptcha()
            } else {
                // 下方只是將註冊資料存在localstorage 或 store，正常要用API確認
                const user = {
                    name: this.username,
                    password: this.password,
                    avatar: `https://api.adorable.io/avatars/200/${this.username}.png`
                }
                // const localUser = ls.getItem('user')
                const localUser = this.$store.state.user

                // 是否註冊過
                if (localUser) {
                    if (localUser.name === user.name) {
                        this.showMsg('用户名已存在')
                    } else {
                        this.login(user)
                    }
                } else {
                    this.login(user)
                }
            }
        },
        login(user) {
            //  ls.setItem('user', user)
            // 分发 login 事件，以保存用户信息和登录
            this.$store.dispatch('login', user)

            this.showMsg('注册成功', 'success')
        },
        showMsg(msg, type = 'warning') {
            this.msg = msg
            this.msgType = type
            this.msgShow = false

            this.$nextTick(() => {
                this.msgShow = true
            })
        }
    },
    components: {
        ValidationProvider,ValidationObserver
    }
}
</script>

<style scoped>
    .thumbnail { width: 170px; margin-top: 10px; cursor: pointer;}
    .thumbnail .captcha { height: 46px; background: #E1E6E8;}
    .captcha { font-size: 24px; font-weight: bold; user-select: none;}
    .control.invalid span {
        display:block;
        margin-top: 5px;
        margin-bottom: 10px;
        color:#a94442;
    }

</style>