<template>
    <div id="wrap" >
        <TheHeader/>

        <b-container style="min-height: calc(100vh - 65px);">
            <div style="height: 85px; "></div>
            <router-view/>
            <div style="height: 20px; "></div>
        </b-container>
        
        <TheFooter/>
    </div>
</template>

<script>
import TheHeader from '@/components/layouts/TheHeader'
import TheFooter from '@/components/layouts/TheFooter'

export default {
    name: 'App',
    components: {
        TheHeader,
        TheFooter,
    }
}
</script>

<style lang="scss">
    // custom.scss
    @import "~bootstrap/scss/bootstrap";
    @import '~bootstrap-vue/src/index.scss';

</style>
