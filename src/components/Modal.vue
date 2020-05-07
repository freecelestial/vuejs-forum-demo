<template>
    <div>
        <!-- <transition> 用于实现单元素或组件之间的过渡 
            enter-active-class 和 leave-active-class 
            可以自定义 是进入持续状态和离开持续状态的样式
            -->
        <transition
            enter-active-class="animated fadeInDown"
            leave-active-class="animated fadeOutUp"
        >
            <div v-show="show" class="modal" style="display:block" @click.self="close">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button @click="close" class="close">×</button>
                            <h4 class="modal-title">
                                <slot name="title"></slot>
                            </h4>
                        </div>
                        <div class="modal-body">
                            <slot></slot>
                        </div>
                        <div class="modal-footer">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 此名稱 fade 用於定义样式的開頭 -->
        <transition name="fade">
            <div v-show="show" class="modal-backdrop fade in" @click="close"></div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        // 是否显示弹窗
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        close() {
            // 触发事件以关闭弹窗
            this.$emit('update:show', false)
        }
    },
    watch: {
        show(value) {
            // 监听 show 值以切换 body 上 modal-open 类
            const bodyClassList = document.body.classList

            if (value) {
                bodyClassList.add('modal-open')
            } else {
                bodyClassList.remove('modal-open')
            }
        }
    }
}
</script>

<style scoped>
    .animated { animation-duration: .4s;}
    /* 
        狀態：
            xxxx-enter: 進入前
            xxxx-enter-to: 已進入
            xxxx-leave: 未離開
            xxxx-leave-to: 離開後

        此處的 fade 是transaction的名稱，可自訂，但需是樣式的開頭
    */
    .fade-enter, .fade-leave-to { opacity: 0;}
</style>