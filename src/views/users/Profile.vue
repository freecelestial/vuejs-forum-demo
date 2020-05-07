<template>
  <ValidationObserver v-slot="{ invalid }">
        <form @submit.prevent="onSubmit">
            <div class="col-md-9 left-col">
                <div class="panel panel-default padding-md">
                    <div class="panel-body">
                        <h2><i class="fa fa-cog"></i> 编辑个人资料</h2>
                    <hr>
                    <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">用户名</label>
                        <div class="col-sm-6">
                            <ValidationProvider name="用户名" 
                            rules="required|min:3|max:30|alpha_first" v-slot="{ classes,errors }">
                                <div class="control" :class="classes">
                                    <input class="form-control" v-model.trim="username" type="text">
                                    <span>{{ errors[0] }}</span>
                                </div>
                            </ValidationProvider>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label">性别</label>
                        <div class="col-sm-6">
                            <ValidationProvider name="性别" 
                            rules="required" v-slot="{ classes,errors }">
                                <div class="control" :class="classes">
                                    <select v-model="gender" class="form-control">
                                        <option value="">未選擇</option>
                                        <option value="male">男</option>
                                        <option value="female">女</option>
                                    </select>
                                    <span>{{ errors[0] }}</span>
                                </div>
                            </ValidationProvider>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label">興趣</label>
                        <div class="col-sm-6">
                            <ValidationProvider name="興趣" 
                            rules="required" v-slot="{ classes,errors }">
                                <div class="control" :class="classes">
                                    <label v-for="(item,index) in hobbiesList" class="checkbox-inline" :key="index">
                                        <input v-model="hobbies" :value="item" type="checkbox"> {{ item }}
                                    </label>
                                    <span>{{ errors[0] }}</span>
                                </div>
                            </ValidationProvider>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label">個人簡介</label>
                        <div class="col-sm-6">
                            <ValidationProvider name="個人簡介" 
                            rules="max:100" v-slot="{ classes,errors }">
                                <div class="control" :class="classes">
                                    <textarea v-model.trim="introduction" type="text" class="form-control"></textarea>
                                    <span>{{ errors[0] }}</span>
                                </div>
                            </ValidationProvider>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-6">
                            <button type="submit" :disabled="invalid" class="btn btn-primary">修改</button>
                        </div>
                    </div>
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
    name: 'EditProfile',
    data() {
        return {
            username: '', // 用户名
            gender: '', // 性别
            hobbiesList: ['泡網','運動','健身','遊遊','遊戲'],
            hobbies: [], // 兴趣
            introduction: '' // 个人简介
        }
    },
    created() {
        const user = this.$store.state.user

        if (user && typeof user === 'object') {
            const { name, gender, hobbies, introduction } = user

            this.username = name
            this.gender = gender || this.gender
            this.hobbies = hobbies || this.hobbies
            this.introduction = introduction
        }
    },
    methods: {
        onSubmit() {
            this.$nextTick(() => {
                this.$store.dispatch('updateUser', {
                    name: this.username,
                    gender: this.gender,
                    hobbies: this.hobbies,
                    introduction: this.introduction
                })
                this.$message.show('修改成功')

            })
        }
    },
    components: {
        ValidationProvider,ValidationObserver
    }
}
</script>

<style scoped>
    .control.invalid span {
        display:block;
        margin-top: 5px;
        margin-bottom: 10px;
        color:#a94442;
    }
</style>