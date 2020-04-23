<template>
    <div class="loading" v-show="isLoading" @click="$emit('update:isLoading', false)">
        <div id="loading">
            <div class="loading-spinner">
                <i class="icon-loading"></i>
                <p class="loading-text">{{text}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "loading",
        props: {
            isLoading: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: '拼命加载中'
            }
        },
        data() {
            return {}
        },
        methods: {},
        mounted() {

        }
    }
</script>

<style scoped>
    @import "style/iconfont.css";

    .loading {
        height: 100vh;
        width: 100vw;
        position: fixed;
        z-index: 1000;
        top: 0px;
        left: 0px;
    }

    /***********loading*************/

    #loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 12312;
    }

    .loading-spinner {
        top: 50%;
        margin-top: -21px;
        width: 100%;
        text-align: center;
        position: absolute;
    }

    .loading-text {
        color: #409EFF;
        margin: 3px 0;
        font-size: 14px;
    }

    .icon-loading {
        font-size: 16px;
        color: #409eff;
        -webkit-animation: spin-right 1s linear infinite normal;
        -moz-animation: spin-right 1s linear infinite normal;
        -ms-animation: spin-right 1s linear infinite normal;
        animation: spin-right 1s linear infinite normal;
        -webkit-animation-delay: 0s;
        -moz-animation-delay: 0s;
        -o-animation-delay: 0s;
        animation-delay: 0s;
    }

    @keyframes spin-right {
        from {
            transform: rotate(0deg);
            opacity: 0.2;
        }
        50% {
            transform: rotate(180deg);
            opacity: 1.0;
        }
        to {
            transform: rotate(360deg);
            opacity: 0.2;
        }
    }

    @-moz-keyframes spin-right {
        from {
            -moz-transform: rotate(0deg);
            opacity: 0.2;
        }
        50% {
            -moz-transform: rotate(180deg);
            opacity: 1.0;
        }
        to {
            -moz-transform: rotate(360deg);
            opacity: 0.2;
        }
    }

    @-webkit-keyframes spin-right {
        from {
            -webkit-transform: rotate(0deg);
            opacity: 0.2;
        }
        50% {
            -webkit-transform: rotate(180deg);
            opacity: 1.0;
        }
        to {
            -webkit-transform: rotate(360deg);
            opacity: 0.2;
        }
    }

    /***********loading结束*************/
</style>
