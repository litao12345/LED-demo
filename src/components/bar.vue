<template>
    <div class="bar-echarts" id="BarEcharts"></div>
</template>

<script>
    import Echarts from 'echarts'
    import {baroption} from "../assets/common/bar";

    export default {
        name: "barEcharts",
        props: {
            data: {
                type: Array,
                default: null
            },
            width:{
                type: String,
                default: null
            },
            level:{
                type:Number,
                default: 0
            },
            threshold:{
                type: Array,
                default: null
            }
        },
        data() {
            return {
                options: null
            }
        },
        created() {
        },
        mounted() {
            this._getData();
        },
        methods: {
            _initEcharts() {
                let barWidth = document.getElementById('BarEcharts');
                barWidth.style.width = $('body')[0].clientWidth - 60 + 'px';
                this.mybarchart = Echarts.init($('#BarEcharts')[0]);
                this.mybarchart.setOption(this.options);
                this.mybarchart.on('click', (params) => {
                    let data = {
                        name:params.name,
                        level:this.level,
                        index: params.dataIndex
                    };
                    this.$emit('changeData',data)
                });
            },
            _getData() {
                this.inithandleData(this.data);
            },
            inithandleData(data) {
                let xAxis = [], xData = [];
                data.map(item => {
                    xAxis.push(item.maxDate);
                    xData.push((item.maxData/1000).toFixed(2));
                });
                baroption.xAxis[0].data = xAxis;
                baroption.series[0].data = xData;
                this.handleColor();
                if(this.level === 0){
                    baroption.xAxis[0].name = '日期/天';
                }else if(this.level === 1){
                    baroption.xAxis[0].name = '日期/小时';
                }else if(this.level === 2){
                    baroption.xAxis[0].name = '日期/分钟';
                }
                this.options = baroption;
                this._initEcharts();
            },
            handleColor(){
                let threshold = this.threshold;
                baroption.series[0].itemStyle.normal.color = (params) => {
                    if (params.value > 0 && params.value <= threshold[0].val) {
                        return "#7ED321";
                    } else if (params.value <= threshold[1].val) {
                        return "#F8E71C";
                    } else if (params.value <= threshold[2].val) {
                        return "#FF9829";
                    }
                    return "#FF6B66";
                };
                baroption.series[0].markLine.data[0].yAxis = threshold[0].val;
                baroption.series[0].markLine.data[1].yAxis = threshold[1].val;
                baroption.series[0].markLine.data[2].yAxis = threshold[2].val;
                baroption.series[0].markLine.data[3].yAxis = threshold[3].val;
            },
            thresholdChange(){
                this.handleData(this.data)
            },
            handleData(data){
                let xAxis = [], xData = [];
                data.map(item => {
                    xAxis.push(item.maxDate);
                    xData.push((item.maxData/1000).toFixed(2));
                });
                baroption.xAxis[0].data = xAxis;
                baroption.series[0].data = xData;
                this.handleColor();
                if(this.level === 0){
                    baroption.xAxis[0].name = '日期/月';
                }else if(this.level === 1){
                    baroption.xAxis[0].name = '日期/天';
                }else if(this.level === 2){
                    baroption.xAxis[0].name = '日期/小时';
                }
                this.options = baroption;
                this.mybarchart.setOption(this.options);
            }
        },
        watch:{
            width(val){
                let barWidth = document.getElementById('BarEcharts');
                barWidth.style.width = val;
                this.mybarchart.resize();
            },
            data(val){
                this.handleData(val);
            }
        }
    }
</script>

<style scoped>
</style>