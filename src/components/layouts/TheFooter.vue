<template>
    <b-container style="height: 40px;" class="bg-light shadow-sm pt-0 mt-3 rounded" fluid>
        <b-row>
            <b-col class="my-2 text-center">
                <div v-b-tooltip.hover :title="tooltipTitle">{{ description }}
                    <span v-html="designer"></span>
                </div>
            </b-col>
        </b-row>
    </b-container>

</template>

<script>

export default {
    name: 'TheFooter',
    data() {
        return {
            description: '此網站使用 Vue.js 開發',
            tooltipTitle: '相關技術如下：Webpack, BootstrapVue, vue-router, Vuex, Mock.js, axios, VeeValidate',
            designer: `<span class="ml-1" style="font-size:0.9em">Designed by Jim</span>`,
        }
    }
}
</script>

<style scoped>

</style>