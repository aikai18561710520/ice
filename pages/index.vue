<template lang="pug">
    .container
        .houses(ref='house')
            //- .houses-content(v-for="(item,index) in houses" :key="index" @click="showHouse(item)")
            //-     .house-desc
            //-         .words {{item.words}}
            //-         .cname {{item.cname}}
            //-         .name {{item.name}}
        .characters
            .title 主要人物
            //- .characters-content(v-for="(item.index) in characters" :key="index" @click="showCharacter(item)")
            //-     img(:src="item.img")
            //-     .characters-desc
            //-         .cname {{item.cname}}
            //-         .name {{item.name}}
            //-         .playBy {{item.playBy}}
        .cities
            .title 维斯特洛
            .cities-info 描述
            //- .cities-item(v-for="(item,index) in cities" :key="index")
            //-     .title {{item.title}}
            //-     .body {{item.body}}

</template>

<script>
    import {
        mapState
    } from 'vuex'
    export default {
        head() {
            return {
                title: '冰火脸谱'
            }
        },
        computed: {
            // ...mapState([
            //     'houses',
            //     'characters',
            //     'cities'
            // ])
        },
        methods: {
            showHouse(item) {
                this.$router.push({
                    path: '/house',
                    query: {
                        id: item._id
                    }
                })
            },
            showCharacter(item) {
                this.$router.push({
                    path: '/character',
                    query: {
                        id: item._id
                    }
                })
            }
        },
        beforeCreate () {
            // this.$store.dispatch('fetchHouses')
            // this.$store.dispatch('fetchCharacters')
            // this.$store.dispatch('fetchCities')
        }
    }
</script>

<style scoped>
    .title {
        margin: 50px 0;
    }
</style>
