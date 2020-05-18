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
    @import "./styles/main";
    
    @import "~bootstrap/scss/bootstrap";
    @import '~bootstrap-vue/src/index.scss';
    $fa-font-path: "~font-awesome/fonts/";
    @import "~font-awesome/scss/font-awesome";

    @import "animate.css/animate.min.css";
    
    @import 'simplemde/dist/simplemde.min.css';
    @import 'highlight.js/styles/paraiso-dark.css';

    .nav-pills .nav-link.active, .nav-pills .show>.nav-link {
        background-color: #5FB878;
        font-weight: bolder;
    }
    .page-item.active .page-link {
        background-color: #5FB878;
        border-color: #5FB878;
    }
    .nav-item>a{
        color:#009688;
    }
    .card-body h5>a,.page-link{
        color:#009688;
    }
    a {
        color: #01AAED;
    }


</style>
