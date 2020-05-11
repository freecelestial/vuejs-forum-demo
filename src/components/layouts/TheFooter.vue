<template>
    <b-container class="fixed-bottom bg-light shadow-sm p-0 mt-5 rounded" fluid>
        <b-row>
            <b-col class="m-3 text-center">
                <p v-b-tooltip.hover :title="tooltipTitle" 
                class="padding-top-xsm">{{ description }}</p>
                <span v-html="designer"></span>
            </b-col>
        </b-row>
    </b-container>

</template>

<script>

export default {
    name: 'TheFooter',
    data() {
        return {
            description: '此網站由 Vue.js 編寫',
            tooltipTitle: '使用技術如下：BootstrapVue, vue-router, Vuex, Mock.js, axios, VeeValidate ',
            designer: `<span style="font-size:0.9em">Designed by Jim</span>`,
        }
    }
}
</script>

<style scoped>

</style>