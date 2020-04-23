export const baroption = {
    color: ['#3398DB'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            axisTick: {
                alignWithLabel: true
            },
            name: '日期/天',
            nameLocation: 'center',
            nameGap: 25,
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: '单位/g',
        }
    ],
    series: [
        {
            name: '最大值',
            type: 'bar',
            barMaxWidth: 30,
            data: [5, 8, 6, 3, 11, 14, 10, 5, 8, 6, 3, 11, 4, 10, 5, 17, 22, 3, 1, 4, 10, 5, 18, 22, 3, 1, 4, 7, 20, 16],
            itemStyle: {
                normal: {
                    color: function (params) {
                        if (params.value > 0 && params.value <= 2) {
                            return "#7ED321";
                        } else if (params.value > 2 && params.value <= 3) {
                            return "#F8E71C";
                        } else if (params.value > 3 && params.value <= 3.4) {
                            return "#FF9829";
                        }
                        return "#FF6B66";
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#333',
                            fontSize: 16
                        }
                    }
                }
            },
            markLine: {
                data: [
                    {name: '符合标准：≤3g', yAxis: 2, lineStyle: {color: '#7ED321'}},
                    {name: '轻度超限：≤3g', yAxis: 3, lineStyle: {color: '#F8E71C'}},
                    {name: '中度超限：≤4.5g', yAxis: 3.4, lineStyle: {color: '#FF9829'}},
                    {name: '严重超限：≤3g', yAxis: 4, lineStyle: {color: '#FF6B66'}},
                ],
                symbol: 'none'
            }
        }
    ],
};