<template>
<b-row  align-h="center">
    <b-col md="4" class="mx-auto">
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
                    <b-card title="會員登入" >
                    <b-card-text>
                        <hr>
                        <ValidationProvider name="用戶名" 
                                rules="required" v-slot="{ valid,errors }">
                            <b-form-group 
                                label="用戶名: " 
                                label-for="username"
                                description=""
                            >
                                <b-form-input
                                id="username"
                                v-model="form.username"
                                :state="errors[0] ? false : (valid ? true : null)"
                                placeholder="Enter name"
                                ></b-form-input>
                                <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>

                        <ValidationProvider
                            rules="required"
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
                                placeholder="Enter password"
                            ></b-form-input>
                            <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>

                        <b-button class="mt-4" :disabled="invalid" type="submit" variant="primary" block>
                            <b-icon icon="box-arrow-in-right"></b-icon>
                            登 入</b-button>
                    </b-card-text>
                    </b-card>
                </b-card-group>

            </b-form>
        </ValidationObserver>
    </b-col>
</b-row>
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
    name: 'Login',
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            alertShow: null,
            alertMsg:'',
            alertType:'',
        }
    },
    methods: {
        onSubmit() {
            const user = {
                name: this.form.username,
                password: this.form.password
            }
            const localUser = this.$store.state.user

            if (localUser) {
                if (localUser.name !== user.name || localUser.password !== user.password) {
                    this.showAlert('用戶名或密碼不正確')
                } else {
                    this.$store.dispatch('login')
                }
            } else {
                this.showAlert('不存在該用戶')
            }
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

</style>