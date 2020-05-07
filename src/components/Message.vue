<template>
    <div v-show="show" :class="`alert alert-${type} alert-dismissible`">
        <button @click="close" type="button" class="close"><span>×</span></button>
        {{ msg }}
    </div>
</template>

<script>
export default {
    name: 'Message',
    props: {
        // 是否显示消息框
        show: {
            type: Boolean,
            default: false
        },
        // 消息框的类型
        type: {
            type: String,
            default: 'success'
        },
        // 消息
        msg: {
            type: String,
            default: ''
        }
    },
    watch: {
        show(value) {
            if (value) {
                this.$nextTick(() => {
                    // 如用錨點一般，會定位到此message區塊的位置(物件上方切齊視窗上方)
                    this.$el.scrollIntoView(true)
                })
            }
        }
    },
    methods: {
        close() {
            // 不能直接改子組件的show
            // 第一個參數是要觸發的父組件事件名稱，第二個參數是值
            // 也就是讓父組件的 show 屬性帶入 false
            this.$emit('update:show', false)
        }
    }
}
</script>

<style scoped>

</style>