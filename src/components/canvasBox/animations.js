import drawMaterial from './drawMaterial';
import {selectOption} from "../../assets/js/animation";

class Animations {
    constructor(vue) {
        this.vue = vue;
        this.drawMaterial = new drawMaterial(vue);
    }

    //单行文本
    drawSingText(item) {
        let animation = item.animation;
        let ctx = this.vue.ctx;
        let i;

        switch (animation.method.type) {
            case 0:
                i = _.cloneDeep(item.x2);
                break;
            case 1:
                i = _.cloneDeep(item.x2);
                break;
            case 2:
                i = _.cloneDeep(item.x1);
                break;
            case 3:
                i = _.cloneDeep(item.y1);
                break;
            case 4:
                i = _.cloneDeep(item.y2);
                break;
        }

        item.timer = setInterval(() => {
            ctx.clearRect(item.x1, item.y1, item.x2, item.y2);
            this.vue.Canvas.drawPixel(item.x1, item.y1, item.x2, item.y2);
            ctx.save();
            ctx.beginPath();
            let fontSize = selectOption.fontSize[animation.fontSize.type].val;
            let len = item.text.length;
            for (let j = 0; j < len; j++) {
                let point;
                switch (animation.method.type) {
                    case 0:
                        point = {
                            x: i - (len - j) * selectOption.fontSize[animation.fontSize.type].val > item.x1 ? i - (len - j) * selectOption.fontSize[animation.fontSize.type].val : item.x1 + j * selectOption.fontSize[animation.fontSize.type].val,
                            y: item.y1 + item.height / 2
                        };
                        break;
                    case 1:
                        point = {
                            x: i - (len - j) * selectOption.fontSize[animation.fontSize.type].val > item.x1 ? i - (len - j) * selectOption.fontSize[animation.fontSize.type].val : item.x1 + j * selectOption.fontSize[animation.fontSize.type].val,
                            y: item.y1 + item.height / 2
                        };
                        break;
                    case 2:
                        point = {
                            x: i + j * fontSize >= item.x2 - fontSize ? i - (len - j) * selectOption.fontSize[animation.fontSize.type].val : i + j * fontSize,
                            y: item.y1 + item.height / 2
                        };
                        break;
                    case 3:
                        point = {
                            x: item.x1 + item.width / 3 + j * fontSize,
                            y:  i - fontSize
                        };
                        break;
                    case 4:
                        point = {
                            x: item.x1 + item.width / 3 + j * fontSize,
                            y: i + fontSize
                        };
                        break;
                }
                /*let point = {
                    x: i - (len - j) * selectOption.fontSize[animation.fontSize.type].val > item.x1 ? i - (len - j) * selectOption.fontSize[animation.fontSize.type].val : item.x1 + j * selectOption.fontSize[animation.fontSize.type].val,
                    y: item.y1 + item.height / 2
                };*/
                ctx.fillStyle = locationJudgment(point, item, selectOption.color[animation.color.type].val);
                ctx.font = fontSize + 'px Aria';
                ctx.fillText(item.text.charAt(j), point.x, point.y);
            }
            ctx.restore();
            switch (animation.method.type) {
                case 0:
                    if (i <= item.x1) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i--;
                    break;
                case 1:
                    if (i <= item.x1) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i--;
                    break;
                case 2:
                    if (i >= item.x2) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i++;
                    break;
                case 3:
                    if (i >= item.y2) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i++;
                    break;
                case 4:
                    if (i <= item.y1) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i--;
                    break;
            }
        }, animation.speed.val)
    }

    //多行文本
    drawMultiLine() {

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