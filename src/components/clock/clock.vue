<template>
    <div class="clock">
        <ul class="line-min">
            <li v-for="i in minGap" :key="i" :style="transformLine(i,6,minTranslateX)"></li>
        </ul>
        <ul class="line-hour">
            <li v-for="i in hourGap" :key="i" :style="transformLine(i,30,hourTranslateX)"></li>
        </ul>
        <ul class="number" ref="numberLine">
            <li v-for="i in hourGap" :key="i" :style="numberHtml(i+1)">{{i+1}}</li>
        </ul>
        <ul class="pointer">
            <li class="hour" ref="Hour"></li>
            <li class="min" ref="Min"></li>
            <li class="sec" ref="Sec"></li>
            <li class="circle"></li>
        </ul>
        <div class="clock-item">
            <slot></slot>
        </div>>
    </div>
</template>

<script>
    export default {
        name: "clock",
        created(){
            this.minGap = this.getArray(60);
            this.hourGap = this.getArray(12);
            this.minTranslateX = 85;
            this.hourTranslateX = 80;
            this.numberWidth = 150;
        },
        mounted(){
            this.numberWidth = this.$refs.numberLine.clientWidth;
            this.move();
            console.log(this.$slots)
        },
        methods:{
            getArray(total){
                let arr = [];
                for (let i = 0; i< total; i++){
                    arr.push(i)
                }
                return arr;
            },
            transformLine(i,num,X){
                return `transform:rotate(${i*num}deg) translate(${X}px,50%)`
            },
            numberHtml(i){
                let myAngle = (i - 3)/6 * Math.PI;
                let radius = this.numberWidth/2;
                let myX = radius + radius * Math.cos(myAngle);
                let myY = radius + radius * Math.sin(myAngle);
                return `left:${myX}px;top:${myY}px`
            },
            move(){
                let domHour = this.$refs.Hour;
                let domMin = this.$refs.Min;
                let domSec = this.$refs.Sec;
                setInterval(()=>{
                    let now = new Date();
                    let hour = now.getHours(),min = now.getMinutes(),sec = now.getSeconds();
                    let secAngle = sec * 6 - 90,minAngle = min * 6 + sec * 0.1 - 90,hourAngle = hour * 30 + min * 0.5 - 90;
                    domSec.style.transform = `rotate(${secAngle}deg)`;
                    domMin.style.transform = `rotate(${minAngle}deg)`;
                    domHour.style.transform = `rotate(${hourAngle}deg)`;
                },1000)
            }
        }
    }
</script>

<style scoped lang="scss">
.clock{
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 100%;
    background-color: #292a38;
    margin: 50px auto;
    .pointer{
        li{
            position: absolute;
            top: 50%;
            left: 50%;
            transform-origin: left center;
            background-color: white;
            &.circle{
                width: 10px;
                height: 10px;
                border-radius: 100%;
                margin-top: -5px;
                margin-left: -5px;
            }
            &.hour{
                width: 45px;
                height: 3px;
                margin-top: -1px;
            }
            &.min{
                width: 60px;
                height: 2px;
                margin-top: -1px;
            }
            &.sec{
                width: 80px;
                height: 1px;
                margin-top: -1px;
            }
        }
    }
    .line-hour{
        li{
            position: absolute;
            left: 50%;
            top: 50%;
            transform-origin: left center;
            width: 10px;
            height: 2px;
            background-color: white;
        }
    }
    .line-min{
        li{
            position: absolute;
            left: 50%;
            top: 50%;
            transform-origin: left center;
            width: 5px;
            height: 2px;
            background-color: white;
        }
    }
    .number{
        position: absolute;
        height: 150px;
        width: 150px;
        left: 59%;
        top: 43%;
        transform: translate(-50%,-50%);
        font-size: 15px;
        color: white;
        li{
            position: absolute;
            transform: translate(-50%,-50%);
        }
    }
}
</style>