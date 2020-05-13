<template>
    <b-col>
        <b-alert
            :variant="alertType"
            dismissible
            fade
            :show="dismissCountDown"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
        >
            <p>{{ alertMsg }}</p>
            <b-progress
                :variant="alertType"
                :max="dismissSecs"
                :value="dismissCountDown"
                height="4px"
            ></b-progress>
        
        </b-alert>
        
        <ValidationObserver ref="observer" v-slot="{ invalid }">
            <b-form @submit="onSubmit">
                <b-card-group class="border shadow-sm p-1 mb-5">
                    <b-card-body>
                        <b-card class="border-0">
                            <b-card-text>
                                <b-card-title>
                                    <b-icon class="h1" icon="lock-fill" variant="primary"></b-icon> 
                                    修改密碼
                                </b-card-title>
                                <hr>
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

                                <b-button class="mt-4" :disabled="invalid" type="submit" variant="primary" block>
                                    <b-icon icon="wrench"></b-icon> 修 改
                                </b-button>
                            </b-card-text>
                        </b-card>
                    </b-card-body>
                </b-card-group>
            </b-form>
        </ValidationObserver>
    </b-col>
</template>

<script>
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

export default {
    name: 'EditPassword',
    data() {
        return {
            form:{
                password: '', // 密码
                cpassword: ''
            },
            alertShow: null,
            alertMsg:'',
            alertType:'',
            dismissSecs: 5,
            dismissCountDown: 0,
        }
    },
    created() {
        const user = this.$store.state.user
        if (user && typeof user === 'object') {
            this.form.password = user.password
        }
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault()
            this.$nextTick(() => {
                this.$store.dispatch('updateUser', { password: this.form.cpassword })
                this.showAlert('修改成功')
            })
        },
        showAlert(msg, type = 'success') {
            this.alertMsg = msg
            this.alertType = type
            this.alertShow = false
            this.$nextTick(() => {
                this.dismissCountDown = this.dismissSecs
                document.documentElement.scrollTop = 20
            })
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        }
    },
    components: {
        ValidationProvider,ValidationObserver
    }
}
</script>

<style scoped>
    form,h4 { font-weight:700 }
    .b-icon.bi {vertical-align: middle;}
</style>