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

        <b-breadcrumb class="bg-white">
            <b-breadcrumb-item to="/">
            <b-icon icon="house-fill" variant="dark" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
             <span class="text-dark"> Home</span>
            </b-breadcrumb-item>
            <b-breadcrumb-item active>個人資料 - 基本資料</b-breadcrumb-item>
        </b-breadcrumb>
        <ValidationObserver ref="observer" v-slot="{ invalid }">
            <b-form @submit="onSubmit">
                <b-card-group class="border shadow-sm p-1 mb-5">
                    <b-card-body>
                        <b-card class="border-0">
                            <b-card-text>
                                <b-card-title>
                                    <b-icon class="h1" icon="people-circle" variant="primary"></b-icon> 
                                    基本資料
                                </b-card-title>
                                <hr>
                                <ValidationProvider name="用戶名" 
                                        rules="required|min:3|max:30|alpha_first" v-slot="{ valid,errors }">
                                    <b-form-group 
                                        label="用戶名: " 
                                        label-for="username"
                                        description=""
                                    >
                                        <b-form-input
                                        id="username"
                                        v-model="form.username"
                                        :state="errors[0] ? false : (valid ? true : null)"
                                        placeholder=""
                                        ></b-form-input>
                                        <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>

                                <ValidationProvider name="性別" 
                                        rules="required" v-slot="{ valid,errors }">
                                        <b-form-group 
                                            label="性別: " 
                                        >
                                            <b-form-radio-group
                                                id="gender"
                                                v-model="form.gender"
                                                :options="form.genderList"
                                                name="性別"
                                            ></b-form-radio-group>
                                        </b-form-group>

                                        <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>

                                <ValidationProvider name="興趣" 
                                        rules="required" v-slot="{ valid,errors }">
                                        <b-form-group 
                                            label="興趣: " 
                                        >
                                            <b-form-checkbox-group
                                                id="hobbies"
                                                v-model="form.hobbies"
                                                :options="form.hobbiesList"
                                                name="興趣"
                                            ></b-form-checkbox-group>
                                        </b-form-group>

                                        <b-form-invalid-feedback id="inputLiveFeedback">{{ errors[0] }}</b-form-invalid-feedback>
                                    </b-form-group>
                                </ValidationProvider>

                                <ValidationProvider name="簡介" 
                                        rules="max:200" v-slot="{ valid,errors }">
                                    <b-form-group 
                                        label="簡介: " 
                                        label-for="introduction"
                                        description="最多 200 字元"
                                    >
                                        <b-form-textarea
                                            id="introduction"
                                            v-model="form.introduction"
                                            :state="errors[0] ? false : 
                                            (valid && form.introduction && form.introduction.length>0 ? true : null)"
                                            rows="4"
                                            max-rows="10"
                                            placeholder=""
                                        ></b-form-textarea>
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
extend('alpha_first', {
    validate: value => {
        return value.match(/^[a-zA-Z]+\w*\s?\w*$/) !== null
    },
    message: '第一個字符，需以字母開頭'
});


export default {
    name: 'EditProfile',
    data() {
        return {
            form:{
                username: '', // 用戶名
                gender: 'null', // 性別
                genderList:[
                            { text: '未知', value: 'null' },
                            { text: '男', value: 'male' },
                            { text: '女', value: 'female' }
                        ],
                hobbiesList: ['上網','運動','旅遊','畫圖','其它'],
                hobbies: [], // 興趣
                introduction: '' // 個人簡介
            },
            alertShow: null,
            alertMsg:'',
            alertType:'',
            dismissSecs: 5,
            dismissCountDown: 0,
        }
    },
    // 初始化表單
    created() {
        const user = this.$store.state.user

        if (user && typeof user === 'object') {
            const { name, gender, hobbies, introduction } = user

            this.form.username = name
            this.form.gender = gender || this.form.gender
            this.form.hobbies = hobbies || this.form.hobbies
            this.form.introduction = introduction
        }
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault()
            this.$nextTick(() => {
                this.$store.dispatch('updateUser', {
                    name: this.form.username,
                    gender: this.form.gender,
                    hobbies: this.form.hobbies,
                    introduction: this.form.introduction
                })

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
        },
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