import {selectOption} from "../../../assets/js/animation";

class DateTime {
    constructor(item, vue) {
        this.vue = vue;
        this.item = item;
        /*this.img = this.createImg(item);
        setTimeout(() => {
            this.draw(item);
        }, 1000);
        this.drawImg = this.drawImg.bind(this);
        this.stopAnimation = true;*/
        this.createImg = this.createImg.bind(this);
        item.timer = item.timer = requestAnimationFrame(this.createImg.bind(this));
        item.requestAnimation = true;
    }


    /*draw(item) {
        item.timer = requestAnimationFrame(this.drawImg.bind(this))
    }

    drawImg() {
        let item = this.item;
        item.timer = requestAnimationFrame(this.drawImg.bind(this))
        /!*let item = this.item;
        let ctx = this.vue.ctx;
        this.img = this.createImg(item);
        ctx.clearRect(item.x1, item.y1, item.width, item.height);
        ctx.beginPath();
        ctx.drawImage(this.img, 0, 0, item.width, item.height, item.x1, item.y1 + item.height / 2, item.width, item.height);
        if(this.stopAnimation){
            item.timer = requestAnimationFrame(this.drawImg.bind(this))
        }else{
            item.timer = requestAnimationFrame(this.stop.bind(this))
        }*!/
    }*/


    createImg() {
        let item = this.item;
        let animation = item.animation;
        let canvasImg = document.createElement('canvas');
        let fontSize = selectOption.fontSize[animation.fontSize.type].val;
        let img = document.createElement('img');
        let ctx = this.vue.ctx;
        ctx.clearRect(item.x1, item.y1, item.width, item.height);
        ctx.beginPath();
        //判断时间格式
        item.text = judgmentTimeFormat(animation.timeFormat.type, animation.displayFormat.type);
        //判断年份位数
        item.text = animation.yearDigits.type ? item.text.slice(2) : item.text;
        let num = 0;
        for (let i = 0; i < item.text.length; i++) {
            num = regString(item.text.charAt(i)) ? num + 2 : num + 1;
        }
        canvasImg.width = fontSize * (num + 1) / 2;
        canvasImg.height = fontSize + 5;
        let count = 0;
        for (let i = 0; i < item.text.length; i++) {
            ctx.beginPath();
            let typeOf = isNaN(parseInt(item.text.charAt(i)));
            //判断当前字符为是否为数字
            ctx.fillStyle = typeOf ? selectOption.color[animation.iconColor.type].val : selectOption.color[animation.numColor.type].val;
            //获取字体大小
            ctx.textAlign = animation.displayFormat.type ? 'center' : 'start';
            ctx.font = selectOption.fontSize[animation.fontSize.type].val + 'px Aria';
            if(item.x1 + count * selectOption.fontSize[animation.fontSize.type].val / 2 + fontSize * 1.5 < item.x2){
                ctx.fillText(item.text.charAt(i), item.x1 + count * selectOption.fontSize[animation.fontSize.type].val / 2 + fontSize / 2, item.y1 + item.height / 2);
            }
            count = regString(item.text.charAt(i)) ? count + 2 : count + 1;
        }
        // img.src = canvasImg.toDataURL();
        // return img;
        if(item.requestAnimation){
            item.timer = requestAnimationFrame(this.createImg.bind(this))
        }

    }

    stop() {
        console.log('我就是为了把这玩意停下来');
    }
}

//判断时间格式
function judgmentTimeFormat(type, format) {
    let formatType = format ? format === 1 ? '-' : '/' : null;
    let myDate = new Date();
    let dateTime = {
        year: myDate.getFullYear(),
        month: handleNum(myDate.getMonth()),
        day: handleNum(myDate.getDate()),
        week: myDate.getDay(),
        hour: handleNum(myDate.getHours()),
        minute: handleNum(myDate.getMinutes()),
        second: handleNum(myDate.getSeconds())
    };
    switch (type) {
        case 0:
            return format ?
                dateTime.year + formatType + dateTime.month + formatType + dateTime.day + ' 星期' + dateTime.week + ' ' + dateTime.hour + ':' + dateTime.minute + ':' + dateTime.second :
                dateTime.year + '年' + dateTime.month + '月' + dateTime.day + '日 星期' + dateTime.week + ' ' + dateTime.hour + '时' + dateTime.minute + '分' + dateTime.second + '秒';
        case 1:
            return format ?
                dateTime.year + formatType + dateTime.month + formatType + dateTime.day :
                dateTime.year + '年' + dateTime.month + '月' + dateTime.day + '日';
        case 2:
            return format ?
                dateTime.hour + ':' + dateTime.minute + ':' + dateTime.second :
                dateTime.hour + '时' + dateTime.minute + '分' + dateTime.second + '秒';
        case 3:
            return format ?
                dateTime.hour + ':' + dateTime.minute :
                dateTime.hour + '时' + dateTime.minute + '分';
        case 4:
            return '星期' + dateTime.week;
        case 5:
            return dateTime.year + '年';
        case 6:
            return dateTime.month + '月';
        case 7:
            return dateTime.day + '日';
        case 8:
            return dateTime.hour + '时';
        case 9:
            return dateTime.minute + '分';
        case 10:
            return dateTime.second + '秒';
    }
}


//判断数字是否需要在前方加0
function handleNum(data) {
    data = String(data);
    return data.length === 1 ? '0' + data : data;
}

//判断当前字符格式
function regString(str) {
    let reg = /[0-9:/\- ]/g;
    return !reg.test(str);

}

export default DateTime
