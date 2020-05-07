<template>
  <ValidationObserver v-slot="{ invalid }">
    <form @submit.prevent="onSubmit">
        <div class="row">
            <div class="col-md-4 col-md-offset-4 floating-box">
            <Message :show.sync="msgShow" :type="msgType" :msg="msg"/>
            <!-- .sync 表示雙向綁字 
            上列等同於 <Message :show="msgShow" @update:show="val => msgShow = val" 
            :type="msgType" :msg="msg"/>-->
            <div class="panel panel-default">
                <div class="panel-heading">
                <h3 class="panel-title">请登录</h3>
                </div>

                <div class="panel-body">
                    <div class="form-group">
                        <label class="control-label">用户名</label>
                        <ValidationProvider name="用户名" 
                        rules="required" v-slot="{ classes,errors }">
                        <div class="control" :class="classes">
                            <input class="form-control" v-model.trim="username" type="text">
                            <span>{{ errors[0] }}</span>
                        </div>
                        </ValidationProvider>
                    </div>

                    <div class="form-group">
                        <label class="control-label">密碼</label>
                        <ValidationProvider name="密碼" 
                        rules="required" v-slot="{ classes,errors }" vid="password">
                            <div class="control" :class="classes">
                                <input class="form-control" v-model.trim="password" type="password">
                                <span>{{ errors[0] }}</span>
                            </div>
                        </ValidationProvider>
                    </div>
                    <br>
                    <button type="submit" :disabled="invalid" class="btn btn-lg btn-success btn-block">
                        <i class="fa fa-btn fa-sign-in"></i> 登录
                    </button>
                </div>
            </div>
            </div>
        </div>
        </form>
    </ValidationObserver>
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
            username: '', // 用户名
            password: '', // 密码
            msg: '', // 消息
            msgType: '', // 消息类型
            msgShow: false // 是否显示消息，默认不显示
        }
    },
    methods: {
        onSubmit() {
            const user = {
                name: this.username,
                password: this.password
            }
            const localUser = this.$store.state.user

            if (localUser) {
                if (localUser.name !== user.name || localUser.password !== user.password) {
                this.showMsg('用戶名或密碼不正確')
                } else {
                this.$store.dispatch('login')
                }
            } else {
                this.showMsg('不存在該用戶')
            }
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
    .control.invalid span {
        display:block;
        margin-top: 5px;
        margin-bottom: 10px;
        color:#a94442;
    }
</style>