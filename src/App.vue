<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    import Clock from '@/components/clock/clock';
        import Item1 from '@/components/item1';
    import Item2 from '@/components/item2';
    import axios from 'axios';
    import {tree} from '@/assets/common/tree'

    export default {
        name: 'about',
        data(){
            return{
                treeData:null,
                defaultProps:{
                    children:'childrenNodes',
                    label:'name'
                }
            }
        },
        created(){
            // this.login();
            console.log(tree);
            this.treeData = tree.data;
        },
        mounted(){

        },
        methods:{
            handleNodeClick(){

            },
            login(){
                /*axios.post('http://192.168.2.177:8080/login',{username: 'admin', password: '123456',}).then(res=>{
                    console.log(res);
                    this.initWebSocket();
                })*/
            },
           initWebSocket(){
               if(typeof WebSocket === "undefined") {
                   alert('您的浏览器不支持WebSocket');
                   return false;
               }
               const wsUrl = 'ws://192.168.2.177:8080/online/websocket/1';
               this.websock = new WebSocket(wsUrl);
               this.websock.onopen = this.websocketonopen;
               this.websock.onmessage = this.websocketonmessage;
               this.websock.onerror = this.websocketonerror;
               this.websock.onclose = this.websocketclose;
           },
            websocketonopen(){
                console.log("WebSocket连接成功");
            },
            websocketonmessage(e){
                console.log(e);
            },
            websocketonerror(e){
               console.log(e)
            },
            websocketclose(e){
               console.log(e)
            }
        },
        components: {
            Clock,
            Item1,
            Item2
        }
    }
</script>
<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        background-color: #e5e5e5;
    }
</style>
