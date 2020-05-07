<template>
    <ValidationObserver v-slot="{ invalid }">
        <form @submit.prevent="onSubmit">
            <div class="col-md-9 left-col">
                <div class="panel panel-default padding-md">
                    <div class="panel-body">
                        <h2><i class="fa fa-lock"></i> 修改密码</h2>
                    <hr>
                    <div class="form-horizontal">

                        <div class="form-group">
                            <label class="col-sm-2 control-label">密 码</label>
                            <div class="col-sm-6">
                                <ValidationProvider name="密碼" 
                                rules="required|min:6|max:16" v-slot="{ classes,errors }" vid="password">
                                    <div class="control" :class="classes">
                                        <input class="form-control" v-model.trim="password" type="password">
                                        <span>{{ errors[0] }}</span>
                                    </div>
                                </ValidationProvider>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">確認密碼</label>
                            <div class="col-sm-6">
                                <ValidationProvider name="確認密碼" rules="required|confirmed:password" v-slot="{ classes,errors }" >
                                    <div class="control" :class="classes">
                                        <input class="form-control" v-model.trim="cpassword" type="password">
                                        <span>{{ errors[0] }}</span>
                                    </div>
                                </ValidationProvider>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-sm-offset-2 col-sm-6">
                                <button type="submit" :disabled="invalid" class="btn btn-primary">應用修改</button>
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

export default {
    name: 'EditPassword',
    data() {
        return {
        password: '', // 密码
        cpassword: '' // 确认密码
        }
    },
    created() {
        const user = this.$store.state.user

        if (user && typeof user === 'object') {
        this.password = user.password
        }
    },
    methods: {
        onSubmit() {
            this.$nextTick(() => {
                this.$store.dispatch('updateUser', { password: this.cpassword })
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