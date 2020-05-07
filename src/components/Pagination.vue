<template>
    <ul v-if="totalPage > 1" class="pagination">
        <!-- 上一頁 -->
        <li :class="{ disabled: internalCurrentPage === 1 }">
            <a href="javascript:;" @click="changePage(internalCurrentPage - 1)">«</a>
        </li>

        <li v-for="n in totalPage" :class="{ active: internalCurrentPage === n }" :key="n">
            <a href="javascript:;" @click="changePage(n)">{{ n }}</a>
        </li>

        <!-- 下一頁 -->
        <li :class="{ disabled: internalCurrentPage === totalPage }">
            <a href="javascript:;" @click="changePage(internalCurrentPage + 1)">»</a>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        // 当前页
        currentPage: {
            type: Number,
            default: 1
        },
        // 数据总数
        total: {
            type: Number,
            required: true
        },
        // 每页条数
        pageSize: {
            type: Number,
            default: 10,
            validator: value => value > 0
        },
        // 当前页改变后的回调
        onPageChange: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            // 组件内的当前页
            internalCurrentPage: 1
        }
    },
    computed: {
        // 总页数
        totalPage() {
            return Math.ceil(this.total / this.pageSize)
        }
    },
    watch: {
        currentPage: {
            // 表示 currentPage 變化時立即觸發下方的 handler
            immediate: true,
            // handler：回调，参数 page 即為 currentPage 當前值
            handler(page) {
                // 更新组件内的当前页，为父组件上 currentPage 的当前值
                this.internalCurrentPage = page
            }
        }
    },
    methods: {
        changePage(page) {
            if (page === this.internalCurrentPage || page < 1 || page > this.totalPage) return
            // onPageChange 是由父組件傳來的 function ， 會切換路徑到指定頁
            // 此 page 參數是由子組件提供
            this.onPageChange(page)
        }
    }
}
</script>

<style scoped>

</style>