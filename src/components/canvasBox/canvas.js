class Canvas {
    constructor(vue) {
        this.ctx = null;
        this.myCanvas = null;
        this.scale = vue.scale;
        this.currentR = vue.currentR;
        this.startX = vue.startX;
        this.startY = vue.startY;
        this.leftDistance = vue.leftDistance;
        this.topDistance = vue.topDistance;
        this.x = vue.x;
        this.y = vue.y;
        this.myFlag = vue.myFlag;
        this.elementWidth = vue.elementWidth;
        this.elementHeight = vue.elementHeight;
        this.op = vue.op;
        this.vue = vue;
        this.layers = vue.layers;
        this.initCanvas();
        this.reshow = this.reshow.bind(this);
        this.render = this.render.bind(this);
        this.resizeLeft = this.resizeLeft.bind(this);
        this.resizeTop = this.resizeTop.bind(this);
        this.resizeWidth = this.resizeWidth.bind(this);
        this.resizeHeight = this.resizeHeight.bind(this);
        this.resizeLT = this.resizeLT.bind(this);
        this.resizeWH = this.resizeWH.bind(this);
        this.resizeLH = this.resizeLH.bind(this);
        this.resizeWT = this.resizeWT.bind(this);
        this.handlePointIsArea = this.handlePointIsArea.bind(this);
        this.judgmentPoint = this.judgmentPoint.bind(this);
        this.fixPosition = this.fixPosition.bind(this);
        this.reDraw = this.reDraw.bind(this);
        this.drawPixel = this.drawPixel.bind(this);
    }

    //创建canvas，并且为canvas添加鼠标事件
    initCanvas() {
        let myCanvas = this.vue.myCanvas = this.myCanvas = this.vue.$refs.canvasBox;
        this.vue.ctx = this.ctx = myCanvas.getContext('2d');


        myCanvas.onmouseleave = function () {
            myCanvas.onmousedown = null;
            myCanvas.onmousemove = null;
            myCanvas.onmouseup = null;
        };
        myCanvas.onmouseenter = () => {
            myCanvas.onmousedown = (e) => Canvas.mouseDown(e, this);
            myCanvas.onmousemove = (e) => Canvas.mouseMove(e, this);
            myCanvas.ondblclick = (e) => Canvas.dbclick(e, this);
            document.onmouseup = (e) => Canvas.mouseUp(e, this);
        };
    }

    static mouseDown(e, that) {
        const {scale, ctx, myCanvas, handlePointIsArea, judgmentPoint} = that;
        if (!that.vue.checkedMaterial()) {
            that.startX = (e.pageX - myCanvas.offsetLeft + myCanvas.parentElement.scrollLeft) / scale;
            that.startY = (e.pageY - myCanvas.offsetTop + myCanvas.parentElement.scrollTop) / scale;
            handlePointIsArea(that.startX, that.startY);
            if (that.currentR) {
                judgmentPoint(that.startX, that.startY);
                that.leftDistance = that.startX - that.currentR.x1;
                that.topDistance = that.startY - that.currentR.y1;
            }
            ctx.strokeRect(that.x, that.y, 0, 0);
            ctx.strokeStyle = "#0000ff";
            that.myFlag = 1;
        }
    }

    static mouseMove(e, that) {
        const {myCanvas, scale, ctx, reshow, elementHeight, elementWidth} = that;
        that.x = (e.pageX - myCanvas.offsetLeft + myCanvas.parentElement.scrollLeft) / scale;
        that.y = (e.pageY - myCanvas.offsetTop + myCanvas.parentElement.scrollTop) / scale;
        ctx.save();
        myCanvas.style.cursor = "default";
        ctx.clearRect(0, 0, elementWidth, elementHeight);
        ctx.restore();
        reshow(that.x, that.y);
    }

    static mouseUp(e, that) {
        let {fixPosition, reshow} = that;
        if (that.currentR) {
            fixPosition(that.currentR);
        }
        that.myFlag = 0;
        that.op = 0;
        if (that.currentR) {
            that.vue.currentNode.x.val = _.cloneDeep(that.currentR.x1);
            that.vue.currentNode.y.val = _.cloneDeep(that.currentR.y1);
            that.vue.currentNode.width.val = _.cloneDeep(that.currentR.width);
            that.vue.currentNode.height.val = _.cloneDeep(that.currentR.height);
            that.vue.handleMaterialLayer(that.currentR)
        }
        reshow(that.x, that.y);
    }

    static dbclick(e, that) {
        const {scale, myCanvas} = that;
        let x = (e.pageX - myCanvas.offsetLeft + myCanvas.parentElement.scrollLeft) / scale;
        let y = (e.pageY - myCanvas.offsetTop + myCanvas.parentElement.scrollTop) / scale;
        let data = that.vue.$refs.MyTree.getCurrentNode();
        if (!data) return;
        if ((data.type === 1 || data.type === 2) && this.judgmentPointIsText(x, y, data.layer)) {
            that.vue.$prompt('请输入', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: typeof data.layer.text === 'string' ? data.layer.text : data.layer.text.join('')
            }).then(({value}) => {
                that.vue.pageList[that.vue.choosePage].children[that.vue.chooseArea].children.map(item => {
                    if (item.material === data.material) {
                        if (item.type === 1) {
                            item.layer.text = value;
                        } else {
                            item.layer.text = [];
                            let count = parseInt(item.layer.width / item.layer.fontSize);
                            for (let i = 0; i < value.length; i += count) {
                                item.layer.text.push(value.substr(i, count))
                            }
                        }
                    }
                });
                that.vue.drawMaterial();
            }).catch(() => {
            })
        }
    }

    reshow(x, y) {
        let {ctx, scale, render, resizeHeight, resizeLeft, resizeWidth, resizeTop, resizeLT, resizeLH, resizeWH, resizeWT,elementWidth,elementHeight} = this;
        this.drawPixel(0,elementWidth,0,elementHeight);
        let allNotIn = 1;
        this.layers.forEach(item => {
            ctx.beginPath();
            ctx.rect(item.x1, item.y1, item.width, item.height);
            ctx.fillStyle = item.fillStyle;
            if (this.currentR) {
                if (item.areaId === this.currentR.areaId) {
                    if (x >= (item.x1 - 25 / scale) && x <= (item.x1 + 25 / scale) && y <= (item.y2 - 25 / scale) && y >= (item.y1 + 25 / scale)) {
                        resizeLeft(item);
                    } else if (x >= (item.x2 - 25 / scale) && x <= (item.x2 + 25 / scale) && y <= (item.y2 - 25 / scale) && y >= (item.y1 + 25 / scale)) {
                        resizeWidth(item);
                    } else if (y >= (item.y1 - 25 / scale) && y <= (item.y1 + 25 / scale) && x <= (item.x2 - 25 / scale) && x >= (item.x1 + 25 / scale)) {
                        resizeTop(item);
                    } else if (y >= (item.y2 - 25 / scale) && y <= (item.y2 + 25 / scale) && x <= (item.x2 - 25 / scale) && x >= (item.x1 + 25 / scale)) {
                        resizeHeight(item);
                    } else if (x >= (item.x1 - 25 / scale) && x <= (item.x1 + 25 / scale) && y <= (item.y1 + 25 / scale) && y >= (item.y1 - 25 / scale)) {
                        resizeLT(item);
                    } else if (x >= (item.x2 - 25 / scale) && x <= (item.x2 + 25 / scale) && y <= (item.y2 + 25 / scale) && y >= (item.y2 - 25 / scale)) {
                        resizeWH(item);
                    } else if (x >= (item.x1 - 25 / scale) && x <= (item.x1 + 25 / scale) && y <= (item.y2 + 25 / scale) && y >= (item.y2 - 25 / scale)) {
                        resizeLH(item);
                    } else if (x >= (item.x2 - 25 / scale) && x <= (item.x2 + 25 / scale) && y <= (item.y1 + 25 / scale) && y >= (item.y1 - 25 / scale)) {
                        resizeWT(item);
                    }
                    if (ctx.isPointInPath(x * scale, y * scale)) {
                        render(item);
                        allNotIn = 0;
                    }
                }
            }
            ctx.fill();
        });
        if (this.vue.checkedMaterial()) {
            this.vue.drawMaterial();
        }
        if (this.myFlag && allNotIn && this.op < 3) {
            this.op = 1
        }
    }

    render(rect) {
        const {myCanvas} = this;
        myCanvas.style.cursor = "move";
        if (this.myFlag && this.op === 0) {
            this.op = 2;
        }
        if (this.myFlag && this.op === 2) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.x2 += this.x - this.leftDistance - this.currentR.x1;
            this.currentR.x1 += this.x - this.leftDistance - this.currentR.x1;
            this.currentR.y2 += this.y - this.topDistance - this.currentR.y1;
            this.currentR.y1 += this.y - this.topDistance - this.currentR.y1;
        }
    }

    //对选中的区域进行操作
    resizeLeft(rect) {
        let {myCanvas} = this;
        myCanvas.style.cursor = "w-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 3;
        }
        if (this.myFlag && this.op === 3) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.x1 = this.x;
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }

    resizeTop(rect) {
        let {myCanvas} = this;
        myCanvas.style.cursor = "s-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 4;
        }
        if (this.myFlag && this.op === 4) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.y1 = this.y;
            this.currentR.height = this.currentR.y2 - this.currentR.y1
        }
    }

    resizeWidth(rect) {
        let {myCanvas} = this;
        myCanvas.style.cursor = "w-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 5;
        }
        if (this.myFlag && this.op === 5) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.x2 = this.x;
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }

    resizeHeight(rect) {
        let {myCanvas} = this;
        myCanvas.style.cursor = "s-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 6;
        }
        if (this.myFlag && this.op === 6) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.y2 = this.y;
            this.currentR.height = this.currentR.y2 - this.currentR.y1
        }
    }

    resizeLT(rect) {
        let {myCanvas} = this;
        myCanvas.style.cursor = "se-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 7;
        }
        if (this.myFlag && this.op === 7) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.x1 = this.x;
            this.currentR.y1 = this.y;
            this.currentR.height = this.currentR.y2 - this.currentR.y1;
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }

    resizeWH(rect) {
        let {myCanvas} = this;
        myCanvas.style.cursor = "se-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 8;
        }
        if (this.myFlag && this.op === 8) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.x2 = this.x;
            this.currentR.y2 = this.y;
            this.currentR.height = this.currentR.y2 - this.currentR.y1;
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }

    resizeLH(rect) {
        const {myCanvas} = this;
        myCanvas.style.cursor = "ne-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 9;
        }
        if (this.myFlag && this.op === 9) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.x1 = this.x;
            this.currentR.y2 = this.y;
            this.currentR.height = this.currentR.y2 - this.currentR.y1;
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }

    resizeWT(rect) {
        const {myCanvas} = this;
        myCanvas.style.cursor = "ne-resize";
        if (this.myFlag && this.op === 0) {
            this.op = 10;
        }
        if (this.myFlag && this.op === 10) {
            if (!this.currentR) {
                this.currentR = rect
            }
            this.currentR.x2 = this.x;
            this.currentR.y1 = this.y;
            this.currentR.height = this.currentR.y2 - this.currentR.y1;
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }

    //处理点击的点是否位于区域内
    handlePointIsArea(x, y) {
        this.layers.map(item => {
            if (x >= item.x1 && x < item.x2 && y >= item.y1 && y < item.y2) {
                this.currentR = item;
                this.vue.pageList[this.vue.choosePage].children.map(i => {
                    if (i.areaId === item.areaId) {
                        this.vue.chooseArea = i.index;
                        this.vue.$nextTick(() => {
                            this.vue.$refs.MyTree.setCurrentKey(i.id);
                            this.vue.currentNode = _.cloneDeep(i.animation);
                            this.vue.disabled = {
                                isAddPage: true,
                                isDelPage: true,
                                isAddArea: false,
                                isDelArea: false,
                                isMaterial: false,
                                isDelMaterial: true
                            }
                        });
                    }
                });
            }
        })
    }

    //判断点击的点是否位于绘制的区域内
    judgmentPoint(x, y) {
        if (x >= this.currentR.x1 && x < this.currentR.x2 && y >= this.currentR.y1 && y < this.currentR.y2) {
            this.reDraw();
            return 0;
        } else {
            this.layers.map(item => {
                if (x >= item.x1 && x < item.x2 && y >= item.y1 && y < item.y2) {
                    this.currentR = _.cloneDeep(item);
                    this.reDraw();
                    this.vue.$nextTick(() => {
                        this.vue.$refs.MyTree.setCurrentKey(item.id)
                    });
                    return 0;
                }
            })
        }
    }

    //处理选择的区域数据，对终点和起点数据进行数据置换
    fixPosition(position) {
        if (position.x1 > position.x2) {
            let x = position.x1;
            position.x1 = position.x2;
            position.x2 = x;
        }
        if (position.y1 > position.y2) {
            let y = position.y1;
            position.y1 = position.y2;
            position.y2 = y;
        }
        position.width = position.x2 - position.x1;
        position.height = position.y2 - position.y1;
        if (position.width < 100 || position.height < 100) {
            position.width = 100;
            position.height = 100;
            position.x2 += position.x1 + 100;
            position.y2 += position.y1 + 100;
        }
        if (position.x1 < 0) {
            position.x1 = 0;
            position.x2 = position.width;
        }
        if (position.y1 < 0) {
            position.y1 = 0;
            position.y2 = position.height;
        }
        if (position.x2 > this.elementWidth) {
            position.x2 = this.elementWidth;
            position.x1 = this.elementWidth - position.width;
        }
        if (position.y2 > this.elementHeight) {
            position.y2 = this.elementHeight;
            position.y1 = this.elementHeight - position.height;
        }
        return position
    }


    //判断双击区域是否可以输入文本
    static judgmentPointIsText(x, y, layer) {
        return x >= layer.x1 && x <= layer.x2 && y >= layer.y1 && y <= layer.y2;
    }

    reDraw() {
        const {ctx, elementWidth, elementHeight} = this;
        ctx.clearRect(0, 0, elementWidth, elementHeight);
        this.drawPixel(0,elementWidth,0,elementHeight);
        if (this.layers.length === 0) return;
        this.layers.map(item1 => {
            this.currentR ?
                item1.fillStyle = item1.areaId === this.currentR.areaId ? 'red' : 'skyblue' :
                item1.fillStyle = 'skyblue';
            ctx.beginPath();
            ctx.rect(item1.x1, item1.y1, item1.width, item1.height);
            ctx.fillText(item1.text, item1.x1, item1.y1 + 10);
            ctx.fillStyle = item1.fillStyle;
            ctx.fill();
        });

    }

    //画像数点
    drawPixel(x1,x2,y1,y2) {
        const {ctx} = this;
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.rect(x1, y1, x2, y2);
        ctx.fill();
        for (let i = x1; i < x2; i += 20) {
            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.moveTo(i,0);
            ctx.lineTo(i,y2);
            ctx.stroke();
        }
        for (let i = y1; i < y2; i += 20) {
            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.moveTo(0,i);
            ctx.lineTo(x2,i);
            ctx.stroke();
        }
    }
}

export default Canvas;