<template>
    <div class="navbar-form navbar-left hidden-sm">
        <div class="form-group">
            <input
                v-model.trim="searchValue"
                type="text"
                class="form-control search-input mac-style"
                placeholder="搜索"
                @keyup.enter="search" 
                @input="updateSearchValue"
            >
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchInput',
    data() {
        return {
            value: '' // 搜索值
        }
    },
    computed: {
        // 作为搜索框的初始值
        searchValue: {
            // getter
            get() {
                return this.$store.state.searchValue
            },
            // setter 
            // computed 預設只有 getter
            // 加入setter 後 searchValue 改變也會同步觸發 setter
            set(newValue) {
                this.value = newValue
            }
        }
    },
    methods: {
        search() {
            const value = this.value

            if (value !== '') {
                this.$router.push({ name: 'Search', query: { q: value } })
            }
        },
        // 更新 searchValue
        updateSearchValue() {
            this.$store.commit('UPDATE_SEARCH_VALUE', this.value)
        }
    }
}
</script>

<style scoped>
    .search-input { background-image: 
        url(https://cdn.learnku.com/assets/images/icon-search.png);
        background-repeat: no-repeat;
        background-position   : 10px 16px;
    }

</style>