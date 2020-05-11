<template>
    <div id="wrap">
        <TheHeader/>
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
