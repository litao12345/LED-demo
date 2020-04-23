const SINGTEXT = '单行文本',
    MULTILINETEXT = '多行文本',
    DATETIME = '日期时间',
    POSTIME = '正计时',
    DOWNTIEM = '倒计时',
    TABLE = '表格',
    materialBlock = {
        singText: 1,
        multiLine: 1,
        dateTime: 1,
        posTime: 1,
        downTime: 1,
        table: 1
    };
import {animations, selectOption} from "../../assets/js/animation";

class myDrawMaterial {
    constructor(vue) {
        this.singText = this.singText.bind(this);
        this.vue = vue;
        this.ctx = vue.ctx;
    }

    singText(item) {
        let animation = item.animation;
        let ctx = this.vue.ctx;
        ctx.beginPath();
        ctx.fillStyle = 'pink';
        ctx.rect(item.x1, item.y1, item.width, item.height);
        ctx.fill();
        for (let i = 0; i < item.text.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = selectOption.color[animation.color.type].val;
            ctx.font = selectOption.fontSize[animation.fontSize.type].val + 'px Aria';
            if ((i+1) * selectOption.fontSize[animation.fontSize.type].val < item.width) {
                ctx.fillText(item.text.charAt(i), item.x1 + i * selectOption.fontSize[animation.fontSize.type].val, item.y1 + item.height / 2);
            }
        }
    }

    drawSingText() {

    }

    multiLine(item) {
        let animation = item.animation;
        let ctx = this.vue.ctx;
        ctx.beginPath();
        ctx.fillStyle = '#36f2aa';
        ctx.rect(item.x1, item.y1, item.width, item.height);
        ctx.fill();
        item.text.map((i, index) => {
            ctx.beginPath();
            ctx.fillStyle = selectOption.color[animation.color.type].val;
            ctx.font = selectOption.fontSize[animation.fontSize.type].val + 'px Aria';
            ctx.fillText(i, item.x1, item.y1 + (index + 1) * selectOption.fontSize[animation.fontSize.type].val);
        });
    }

    drawMultiLine() {

    }

    dateTime_(item) {
        let animation = item.animation;
        let ctx = this.vue.ctx;
        ctx.beginPath();
        ctx.fillStyle = '#a5b222';
        ctx.rect(item.x1, item.y1, item.width, item.height);
        ctx.fill();
        //判断时间格式
        item.text = judgmentTimeFormat(animation.timeFormat.type, animation.displayFormat.type);
        //判断年份位数
        item.text = animation.yearDigits.type ? item.text.slice(2) : item.text;
        for (let i = 0; i < item.text.length; i++) {
            ctx.beginPath();
            let typeOf = isNaN(parseInt(item.text.charAt(i)));
            //判断当前字符为是否为数字
            ctx.fillStyle = typeOf ? selectOption.color[animation.iconColor.type].val : selectOption.color[animation.numColor.type].val;
            //获取字体大小
            ctx.font = selectOption.fontSize[animation.fontSize.type].val + 'px Aria';
            if ((i+1) * selectOption.fontSize[animation.fontSize.type].val <= item.width) {
                ctx.fillText(item.text.charAt(i), item.x1 + i * selectOption.fontSize[animation.fontSize.type].val, item.y1 + item.height / 2);
            }
        }
    }

    drawDateTime() {

    }

    posTime(item) {
        let ctx = this.vue.ctx;
    }

    drawPosTime() {

    }

    downTime(item) {
        let ctx = this.vue.ctx;
    }

    drawDownTime() {
    }

    table(item) {
        let ctx = this.vue.ctx;
    }

    drawTable() {
    }


    //单行文本
    handleSingText() {
        let area = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea];
        let layer = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].layer;
        let animation = JSON.parse(JSON.stringify(this.vue.handleAnimation(animations.singTextAnimation, SINGTEXT, area.materialBlock.singText)));
        let myLayer = {
            x1: layer.x1,
            y1: layer.y1,
            x2: layer.x2,
            y2: layer.y2,
            text: SINGTEXT,
            width: layer.width,
            height: layer.height,
            areaId: area.areaId,
            type: 1,
            fontSize: 16,
            animation
        };
        this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].children.push({
            name: SINGTEXT + area.materialBlock.singText,
            index: area.materialBlock.singText - 1,
            id: this.vue.treeId,
            parentIndex: area.index,
            animation,
            material: this.vue.materialId,
            type: 1,
            layer: myLayer,
            areaId: area.areaId,
        });
        this.vue.treeHighlightNode(this.vue.treeId);
        this.vue.materialId++;
        area.materialBlock.singText++;
        this.vue.materialPush(myLayer)
    }

    //多行文本
    handleMultiLine() {
        let area = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea];
        let layer = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].layer;
        let animation = JSON.parse(JSON.stringify(this.vue.handleAnimation(animations.multiLineAnimation, MULTILINETEXT, area.materialBlock.multiLine)));
        let myLayer = {
            x1: layer.x1,
            y1: layer.y1,
            x2: layer.x2,
            y2: layer.y2,
            text: [MULTILINETEXT],
            width: layer.width,
            height: layer.height,
            areaId: area.areaId,
            type: 2,
            fontSize: 16,
            animation

        };
        this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].children.push({
            name: MULTILINETEXT + area.materialBlock.multiLine,
            index: area.materialBlock.multiLine - 1,
            id: this.vue.treeId,
            parentIndex: area.index,
            material: this.vue.materialId,
            type: 2,
            layer: myLayer,
            animation,
            areaId: area.areaId,
        });
        this.vue.treeHighlightNode(this.vue.treeId);
        this.vue.materialId++;
        area.materialBlock.multiLine++;
        this.vue.materialPush(myLayer)
    }

    //时间日期
    handleDateTime() {
        let area = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea];
        let layer = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].layer;
        let animation = JSON.parse(JSON.stringify(this.vue.handleAnimation(animations.dateTimeAnimation, DATETIME, area.materialBlock.dateTime)));
        let myLayer = {
            x1: layer.x1,
            y1: layer.y1,
            x2: layer.x2,
            y2: layer.y2,
            text: new Date().toLocaleString(),
            width: layer.width,
            height: layer.height,
            areaId: area.areaId,
            type: 3,
            fontSize: 16,
            iconColor: 'red',
            numColor: 'blue',
            animation
        };
        this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].children.push({
            name: DATETIME + area.materialBlock.dateTime,
            index: area.materialBlock.dateTime - 1,
            id: this.vue.treeId,
            parentIndex: area.index,
            animation,
            material: this.vue.materialId,
            type: 3,
            layer: myLayer,
            areaId: area.areaId,
        });
        this.vue.treeHighlightNode(this.vue.treeId);
        this.vue.materialId++;
        area.materialBlock.dateTime++;
        this.vue.materialPush(myLayer)
    }

    //正计时
    handlePosTime() {
        let area = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea];
        this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].children.push({
            name: POSTIME + area.materialBlock.posTime,
            index: area.materialBlock.posTime - 1,
            id: this.vue.treeId,
            parentIndex: area.index,
            animation: JSON.parse(JSON.stringify(this.vue.handleAnimation(animations.multiLineAnimation, POSTIME, area.materialBlock.posTime))),
            material: this.vue.materialId,
            type: 1,
            areaId: area.areaId,
        });
        this.vue.treeHighlightNode(this.vue.treeId);
        this.vue.materialId++;
        area.materialBlock.posTime++;
    }

    //倒计时
    handleDownTime() {
        let area = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea];
        this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].children.push({
            name: DOWNTIEM + area.materialBlock.downTime,
            index: area.materialBlock.downTime - 1,
            id: this.vue.treeId,
            parentIndex: area.index,
            animation: JSON.parse(JSON.stringify(this.vue.handleAnimation(animations.multiLineAnimation, DOWNTIEM, area.materialBlock.downTime))),
            material: this.vue.materialId,
            type: 1,
            areaId: area.areaId,
        });
        this.vue.treeHighlightNode(this.vue.treeId);
        this.vue.materialId++;
        area.materialBlock.downTime++;
    }

    //表格
    handleTable() {
        let area = this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea];
        this.vue.pageList[this.vue.choosePage].children[this.vue.chooseArea].children.push({
            name: TABLE + area.materialBlock.table,
            index: area.materialBlock.table - 1,
            id: this.vue.treeId,
            parentIndex: area.index,
            animation: JSON.parse(JSON.stringify(this.vue.handleAnimation(animations.multiLineAnimation, TABLE, area.materialBlock.table))),
            material: this.vue.materialId,
            type: 1,
            areaId: area.areaId,
        });
        this.vue.treeHighlightNode(this.vue.treeId);
        this.vue.materialId++;
        area.materialBlock.table++;
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

export default myDrawMaterial;