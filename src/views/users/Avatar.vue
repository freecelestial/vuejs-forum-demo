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
                                    <b-icon class="h1" icon="image" variant="primary"></b-icon> 
                                    修改頭像
                                </b-card-title>
                                <hr>
                                <div class="d-flex justify-content-md-center">
                                    <b-card-img class="mb-5" :src="form.avatar" alt="Avator 預覽">
                                    </b-card-img>
                                </div>
                                <ValidationProvider name="頭像網址" 
                                        rules="required" v-slot="{ valid,errors }">
                                    <b-form-group 
                                        label="頭像網址: " 
                                        label-for="avatar"
                                        description=""
                                    >
                                        <b-form-input
                                        id="avatar"
                                        v-model="form.avatar"
                                        :state="errors[0] ? false : (valid ? true : null)"
                                        placeholder=""
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
    name: 'EditAvatar',
    data() {
        return {
            form:{
                avatar: '',
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
            this.form.avatar = user.avatar
        }
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault()
            const avatar = this.form.avatar

            // 如果頭像地址不爲空
            if (avatar) {
                // 新建一個 Image 的實例
                let img = new Image()

                // 加載成功時，上傳圖片
                img.onload = () => {
                    // 依然分發一個 updateUser 的事件，這裏只需傳入頭像信息
                    this.$store.dispatch('updateUser', { avatar })
                    this.showAlert('更新成功')
                }

                // 加載失敗時，只顯示一個失敗的提示
                img.onerror = () => {
                    this.showAlert('更新失敗', 'danger')
                }

                // 指定圖片地址
                img.src = avatar
            }
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
    .card-img { min-width: 200px; min-height: 200px; max-width: 50%;}
    form,h4 { font-weight:700 }
    .b-icon.bi {vertical-align: middle;}
</style>