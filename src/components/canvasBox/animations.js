import drawMaterial from './drawMaterial';
import {selectOption} from "../../assets/js/animation";
import singText from './js-draw-animation/singText';
import MultiLine from './js-draw-animation/MultiLine';
// import DateTime from './js-draw-animation/DateTime'
import DateTime from './js-draw-animation/dateTime2'

class Animations {
    constructor(vue) {
        this.vue = vue;
        this.drawMaterial = new drawMaterial(vue);
    }


    draw(item) {
        switch (item.type) {
            case 1:
                new singText(item,this.vue);
                break;
            case 2:
                new MultiLine(item,this.vue);
                break;
            case 3:
                new DateTime(item,this.vue);
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
        }
    }

    //多行文本
    drawMultiLine(item) {
        let animation = item.animation;
        let canvasImg = document.createElement('canvas');
        let fontSize = selectOption.fontSize[animation.fontSize.type].val;
        let arr = [];
        item.text.map(i => {
            arr.push(i.getLen());
        });
        canvasImg.width = fontSize * Math.max(...arr) / 2;
        canvasImg.height = fontSize * (item.text.length + 1);
        let ctxImg = canvasImg.getContext('2d');
        ctxImg.font = fontSize + 'px Aria';
        let len = canvasImg.width / fontSize * 2;
        ctxImg.fillStyle = selectOption.color[animation.color.type].val;
        item.text.map((i, index) => {
            ctxImg.beginPath();
            ctxImg.textAlign = 'center';
            if (index === item.text.length - 1 && i.getLen() < len) {
                ctxImg.textAlign = 'start';
                ctxImg.fillText(i, 0, (index + 1) * fontSize)
            } else {
                ctxImg.fillText(i, fontSize * len / 4, (index + 1) * fontSize)
            }
        });
        let img = document.createElement('img');
        img.src = canvasImg.toDataURL();
        return img;
    }

    //时间日期
    drawDateTime() {

    }

    //正计时
    drawPosTime() {

    }

    //倒计时
    drawDownTime() {

    }

    //表格
    drawTable() {

    }

}

export default Animations;

function locationJudgment(point, layer, color) {
    if (point.x >= layer.x1 && point.x < layer.x2 && point.y > layer.y1 && point.y < layer.y2) {
        return color
    } else {
        return 'rgba(0,0,0,0)'
    }
}