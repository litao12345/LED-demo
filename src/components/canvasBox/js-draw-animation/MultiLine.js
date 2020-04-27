import {selectOption} from "../../../assets/js/animation";

class MultiLine {
    constructor(item, vue) {
        this.vue = vue;
        this.draw(item);
    }


    draw(item) {
        let animation = item.animation;
        let fontSize = selectOption.fontSize[animation.fontSize.type].val;
        let {img, len} = this.createImg(item);
        let l = item.text.length;
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
                        y: item.y1,
                        w: (i + len * fontSize > item.x2) ? item.x2 - i : len * fontSize,
                        h: fontSize * item.text.length + 5
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
                        y: item.y1,
                        w: (i + len * fontSize > item.x2) ? item.x2 - i : len * fontSize,
                        h: fontSize * item.text.length
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
                        x: (i + (len / 2) * fontSize > item.x2) ? item.x2 - (len / 2) * fontSize : i,
                        y: item.y1,
                        w: len * fontSize / 2,
                        h: fontSize * item.text.length + 5
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
                        x: item.x1,
                        y: i + (l * fontSize) >= item.y2 ? item.y2 - (l * fontSize) : i
                    };
                    ctx.drawImage(img, 0, 0, point.x, point.y);
                    if (i >= item.y2) {
                        clearInterval(item.timer);
                        item.timer = null;
                    }
                    i++;
                    break;
                case 4:
                    point = {
                        x: item.x1,
                        y: i,
                        w: len * fontSize / 2,
                        h: i + (l * fontSize) > item.y2 ? item.y2 - i : l * fontSize
                    };
                    ctx.drawImage(img, 0, 0, point.w, point.h, point.x, point.y, point.w, point.h);
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
            ctxImg.textAlign = 'start';
            ctxImg.fillText(i, 0, (index + 1) * fontSize);
        });
        let img = document.createElement('img');
        img.src = canvasImg.toDataURL();
        $('body').append(img)
        return {img, len};
    }

}

export default MultiLine
