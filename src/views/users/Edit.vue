<template>
    <b-row  align-h="center">
        <b-col md="3">
            <b-list-group class="shadow-sm p-1 mb-5 ">
                <b-list-group-item v-for="link in links" :key="link.name" 
                :to="`/users/${id}/${link.name}`" class="border-light">
                    <b-icon class="h4" :icon="`${link.icon}`"></b-icon> {{ link.title }}
                </b-list-group-item>
            </b-list-group>
        </b-col>
        <b-col md="7">
            <router-view/>
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: 'UsersEdit',
    data() {
        return {
            id:1,
            links: [
                {
                    name: 'edit',
                    title: '基本資料',
                    icon: 'people-circle'
                },
                {
                    name: 'edit_avatar',
                    title: '修改頭像',
                    icon: 'image'
                },
                {
                    name: 'edit_password',
                    title: '修改密碼',
                    icon: 'lock-fill'
                }
            ]
        }
    }
}
</script>

<style scoped>
    .b-icon.bi {vertical-align: middle;}
    .list-group-item.active {color: #004085;background-color: #b8daff;}
    
</style>