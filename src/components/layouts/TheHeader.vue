<template>
    <b-navbar toggleable="lg" type="light" variant="light" class="shadow-sm p-3 mb-5 rounded">
        <b-navbar-brand href="#">
            <img src="@/assets/logo.png" class="d-inline-block align-top" alt="logo">
            ForumDemo
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
               <!-- <b-nav-item href="#" active>文章</b-nav-item> -->
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                    <b-button size="sm" class="my-2 my-sm-0" 
                    variant="outline-success" type="submit">Search</b-button>
                </b-nav-form>

                <b-nav-item-dropdown right>
                    <template v-slot:button-content>
                        <em>User</em>
                    </template>
                    <b-dropdown-item href="#">Profile</b-dropdown-item>
                    <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    name: 'TheHeader',
    data() {
        return {
        }
    },
}
</script>

<style scoped>
    nav{border-top: 4px solid #4fc08d;}
    nav>a>img{width:10%}

</style>