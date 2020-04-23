<template>
    <div>
        54654
    </div>
</template>

<script>
    import BMap from 'vue-baidu-map/components/map/Map';
    import {mapStyle} from "../../assets/common/mapStyle";

    export default {
        name: "vueBMap",
        components:{
            BMap
        },
        props:{
            center:{
                default: '成都'
            },
            zoom:{
                type: Number,
                default: 14
            }
        },
        data(){
            return{
            }
        },
        create(){
        },
        methods:{
            handle({BMap,map}){
                console.log(BMap, map);
                map.setMapStyel({
                    styleJson: mapStyle
                })
            }
        }
    }
</script>

<style scoped lang="scss">
.b-map{
    width: 500px;
    height: 500px;
}
</style>