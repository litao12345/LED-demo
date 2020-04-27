import {selectOption} from "../../../assets/js/animation";

class singText {
    constructor(item,vue) {
        this.vue = vue;
        this.draw(item);
    }


    draw(item) {
        let animation = item.animation;
        let len = item.text.length;
        let fontSize = selectOption.fontSize[animation.fontSize.type].val;
        let img = null;
        img = this.createImg(item);
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
            ctx.clearRect(item.x1, item.y1, item.width, item.height);
            ctx.beginPath();
            let point = {
                x: 0,
                y: 0
            };
            switch (animation.method.type) {
                case 0:
                    point = {
                        x: i,
                        y: item.y1 + item.height / 2,
                        w: (i + len * fontSize > item.x2) ? item.x2 - i : len * fontSize,
                        h: fontSize + 5
                    };
                    ctx.drawImage(img, 0, 0, point.w, point.h, point.x, point.y, point.w, point.h);
                    if (i <= item.x1) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i--;
                    break;
                case 1:
                    point = {
                        x: i,
                        y: item.y1 + item.height / 2,
                        w: (i + len * fontSize > item.x2) ? item.x2 - i : len * fontSize,
                        h: fontSize + 5
                    };
                    ctx.drawImage(img, 0, 0, point.w, point.h, point.x, point.y, point.w, point.h);
                    if (i <= item.x1) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i--;
                    break;
                case 2:
                    point = {
                        x: (i + len * fontSize > item.x2) ? item.x2 - len * fontSize : i,
                        y: item.y1 + item.height / 2,
                        w: len * fontSize,
                        h: fontSize + 5
                    };
                    ctx.drawImage(img, 0, 0, point.w, point.h, point.x, point.y, point.w, point.h);
                    if (i >= item.x2) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i++;
                    break;
                case 3:
                    point = {
                        x: item.x1 + item.width / 3,
                        y: i + fontSize > item.y2 ? i - fontSize : i
                    };
                    ctx.drawImage(img, point.x, point.y);
                    if (i >= item.y2) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i++;
                    break;
                case 4:
                    point = {
                        x: item.x1 + item.width / 3,
                        y: i + fontSize > item.y2 ? i - fontSize : i
                    };
                    ctx.drawImage(img, point.x, point.y);
                    if (i <= item.y1) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i--;
                    break;
            }
        }, animation.speed.val)
    }


    createImg(item) {
        let animation = item.animation;
        let len = item.text.length;
        let canvasImg = document.createElement('canvas');
        let fontSize = selectOption.fontSize[animation.fontSize.type].val;
        canvasImg.width = fontSize * (len + 1);
        canvasImg.height = fontSize + 5;
        let ctxImg = canvasImg.getContext('2d');
        ctxImg.font = fontSize + 'px Aria';
        ctxImg.fillStyle = selectOption.color[animation.color.type].val;
        ctxImg.fillText(item.text, 0, fontSize);
        let img = document.createElement('img');
        img.src = canvasImg.toDataURL();
        return img
    }

}

export default singText
