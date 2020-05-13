<template>
<b-row  align-h="center">
    <b-col md="5" class="mx-auto">
        <b-alert
            :variant="alertType"
            dismissible
            fade
            :show="alertShow"
        >
        {{ alertMsg }}
        </b-alert>
        <ValidationObserver ref="observer" v-slot="{ invalid }">
            <b-form @submit="onSubmit" >
                <b-card-group>
                    <b-card title="會員註冊" class="bg-light">
                    <b-card-text>
                        <hr>
                        <ValidationProvider name="會員名稱" 
                                rules="required|min:3|max:30|alpha_first" v-slot="{ valid,errors }">
                            <b-form-group 
                                label="會員名稱: " 
                                label-for="username"
                                description="測試環境僅支援單一會員註冊，即新註冊者會覆蓋舊註冊者。"
                            >
                                <b-form-input
                                id="username"
                                v-model="form.username"
                                :state="errors[0] ? false : (valid ? true : null)"
                                placeholder="請輸入會員名稱"
                                ></b-form-input>
                                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>

                        <ValidationProvider
                            rules="required|min:6|max:16"
                            name="密碼"
                            vid="password"
                            v-slot="{ valid, errors }"
                        >
                            <b-form-group
                            label="密碼: "
                            label-for="password"
                            description=""
                            >
                            <b-form-input
                                id="password"
                                type="password"
                                v-model="form.password"
                                :state="errors[0] ? false : (valid ? true : null)"
                                placeholder="請輸入密碼"
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>

                        <ValidationProvider
                            rules="required|confirmed:password"
                            name="確認密碼"
                            v-slot="{ valid, errors }"
                        >
                            <b-form-group 
                                label="確認密碼: "
                                label-for="cpassword"
                            >
                            <b-form-input
                                id="cpassword"
                                type="password"
                                v-model.trim="form.cpassword"
                                :state="errors[0] ? false : (valid ? true : null)"
                                placeholder="請再次輸入密碼"
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>

                        <ValidationProvider name="圖片驗證碼" 
                                rules="required" v-slot="{ valid,errors }">
                            <b-form-group label="圖片驗證碼: " label-for="captcha">
                                <b-form-input
                                id="captcha"
                                v-model="form.captcha"
                                :state="errors[0] ? false : (valid ? true : null)"
                                placeholder="請輸入圖片驗證碼"
                                ></b-form-input>
                                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                                <div class="invalid-feedback d-block" v-if="captchaErrorMsgShow">
                                    驗證碼不正確</div>
                            </b-form-group>
                        </ValidationProvider>

                        <div class="thumbnail border border-light rounded" id="booltip-1" @click="getCaptcha">
                            <div class="captcha text-center" v-html="captchaTpl"></div>
                        </div>

                        <b-tooltip target="booltip-1" title="點擊圖片重新獲取驗證碼" placement="right">
                        </b-tooltip>

                        <b-button class="mt-4" :disabled="invalid" type="submit" variant="primary" block>
                            <b-icon icon="person-plus-fill"></b-icon>
                            註 冊</b-button>
                    </b-card-text>
                    </b-card>
                </b-card-group>

            </b-form>
        </ValidationObserver>
    </b-col>
</b-row>
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
        return value.match(/^[a-zA-Z]+/) !== null
    },
    message: '第一個字符，需以字母開頭'
});

export default {
    name: 'Register',
    data() {
        return {
            form: {
                username: '', // 用戶名
                password: '', // 密碼
                cpassword: '', // 確認密碼
                captcha: '', // 驗證碼
            },
            captchaTpl: '', // 驗證碼模板
            captchaErrorMsgShow: false,
            alertShow: null,
            alertMsg:'',
            alertType:'',
        }
     },
    created() {
        // 實體化後執行
        this.getCaptcha()
    },
    methods: {
        getCaptcha() {
            const { tpl, captcha } = createCaptcha(3)
            this.captchaTpl = tpl
            this.localCaptcha = captcha
        },
        onSubmit(evt) {
            evt.preventDefault()
            if (this.form.captcha.toUpperCase() !== this.localCaptcha) {
                this.captchaErrorMsgShow = true
                document.getElementById('captcha').select()
                this.getCaptcha()

            } else {
                // 下方只是將註冊資料存在 localstorage 或 store，正常要用API確認
                const user = {
                    name: this.form.username,
                    password: this.form.password,
                    avatar: `https://api.adorable.io/avatars/200/${this.form.username}.png`
                }

                // const localUser = ls.getItem('user')
                // 取值確認是否已註冊過
                const localUser = this.$store.state.user
                if (localUser) {
                    if (localUser.name === user.name) {
                        this.showAlert('用戶名已存在')
                    } else {
                        this.login(user)
                    }
                } else {
                    this.login(user)
                }
            }
        },
        login(user) {
            // ls.setItem('user', user)
            // 分發 login 事件，以保存用戶信息和登錄
            this.$store.dispatch('login', user)
        },
        showAlert(msg, type = 'warning') {
            this.alertMsg = msg
            this.alertType = type
            this.alertShow = false
            this.$nextTick(() => {
                this.alertShow = true
                document.documentElement.scrollTop = 20
            })
        }
    },
    components: {
        ValidationProvider,ValidationObserver
    }
}
</script>

<style scoped>
    .thumbnail { width: 170px; margin-top: 10px; cursor: pointer;padding:4px;}
    .thumbnail .captcha { height: 46px; background: #E1E6E8;}
    .captcha { display: flex;justify-content: space-evenly; 
                font-size: 24px; font-weight: bold; user-select: none;}
    form,h4 { font-weight:700 }
</style>