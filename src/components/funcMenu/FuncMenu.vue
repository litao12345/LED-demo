<template>
    <div class="func-menu">
        <ul>
            <li v-for="(val,key,index) in funcMenus" :key="index">
                <span>{{val.name}}</span>
                <span v-if="key === 'type' || key === 'UID'"><el-input disabled placeholder="" type="text" v-model="val.val"></el-input></span>
                <span v-else-if="val.timePicker">
                    <el-time-picker v-model="val.val"></el-time-picker>
                </span>
                <span v-else-if="val.options">
                     <el-select placeholder="" v-model="val.val" value="" @change="handleChange(val)">
                        <el-option v-for="item in val.options" :value="item.name"></el-option>
                    </el-select>
                </span>
                <span v-else-if="val.datetime">
                    <el-date-picker v-model="val.val" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </span>
                <span v-else>
                    <el-input placeholder="" type="text" v-model="val.val"></el-input>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "FuncMenu",
        props: {
            funcMenu: {
                type: Object,
                default: {}
            },
            typeNo: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                funcMenus: null
            }
        },
        methods: {
            handleChange(val){
                val.options.map(item=>{
                    if(item.name === val.val){
                        val.type = item.type;
                    }
                })
            }
        },
        watch: {
            funcMenu: {
                deep: true,
                immediate: true,
                handler() {
                    this.funcMenus = this.funcMenu;
                }
            },
            funcMenus: {
                deep: true,
                handler(val) {
                    this.$emit('handleFuncMenu', val)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .func-menu {
        display: flex;
        align-items: center;
        ul {
            width: 100%;
            li {
                width: 100%;
                span {
                    display: inline-block;
                    width: 50%;
                    text-align: left;
                }
            }
        }
        span {
            width: 50%;
        }
    }
</style>