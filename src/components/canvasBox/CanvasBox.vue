<template>
    <div class="canvas-box">
        <canvas ref="canvasBox" :width="elementWidth" :height="elementHeight" style="border:1px solid #d3d3d3;">
            Your browser does not support the HTML5 canvas tag.
        </canvas>
        <div class="box">
            <div class="btn-box">
                <el-button type="primary" :disabled="disabled.isMaterial" @click="choMaterial(1)">单行文本</el-button>
                <el-button type="primary" :disabled="disabled.isMaterial" @click="choMaterial(2)">多行文本</el-button>
                <el-button type="primary" :disabled="disabled.isMaterial" @click="choMaterial(3)">时间日期</el-button>
                <el-button type="primary" :disabled="disabled.isMaterial" @click="choMaterial(4)">正计时</el-button>
                <el-button type="primary" :disabled="disabled.isMaterial" @click="choMaterial(5)">倒计时</el-button>
                <el-button type="primary" :disabled="disabled.isMaterial" @click="choMaterial(6)">表格</el-button>
                <el-button type="primary" :disabled="disabled.isDelMaterial" @click="delMaterial">删除素材</el-button>
                <el-button type="primary" @click="addPage" :disabled="disabled.isAddPage">添加页</el-button>
                <el-button type="primary" @click="deletePage" :disabled="disabled.isDelPage">删除页</el-button>
                <el-button type="primary" @click="addArea" :disabled="disabled.isAddArea">添加区域</el-button>
                <el-button type="primary" @click="deleteArea" :disabled="disabled.isDelArea">删除区域</el-button>
                <el-button type="primary" @click="animateText" :disabled="isAnimations">动起来</el-button>
                <el-button type="primary" @click="clearAnimations" :disabled="!isAnimations">清除动画</el-button>
                <el-button type="primary" @click="clearAnimations" :disabled="!isAnimations">清除动画</el-button>
            </div>
            <div class="device-list">
                <el-tree
                        default-expand-all
                        ref="MyTree"
                        node-key="id"
                        :expand-on-click-node="false"
                        :data="pageList"
                        :highlight-current="true"
                        :props="defaultProps"
                        @node-click="handleNodeClick"
                ></el-tree>
                <func-menu class="node-info" @handleFuncMenu="handleFuncMenu" :func-menu="currentNode"></func-menu>
            </div>
        </div>
        <!--<input placehold="1" type="text" v-model="val" ref="Ipt">-->
    </div>
</template>

<script>
    import {tree} from "../../assets/common/tree";
    import {animations} from "../../assets/js/animation";
    import FuncMenu from '../../components/funcMenu/FuncMenu';

    import myDrawMaterial from './drawMaterial';

    const scaleStep = 1.05;
    const minWidth = 1180, minHeight = 800, maxWidth = 9000, maxHeight = 7000;
    const elementWidth = 600, elementHeight = 800, SPEED = 8, R = 400;
    const PAGENAME = '显示页',
        AREANAME = '区域',
        SINGTEXT = '单行文本',
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


    export default {
        name: "CanvasBox",
        data() {
            return {
                ctx: null,
                myCanvas: null,
                layers: [],
                startX: null,
                startY: null,
                myFlag: null,
                leftDistance: null,
                topDistance: null,
                op: 0,
                scale: 1,
                type: 0,
                currentR: null,
                x: null,
                y: null,
                elementWidth,
                elementHeight,
                r: 10,
                timer: null,
                timerAll: null,
                Pos: [],
                Down: [],
                PosCount: [],
                DownCount: [],
                posCount: 0,
                downCount: 0,
                pageList: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                pageCount: 1,
                choosePage: 0,
                chooseArea: 0,
                treeId: 0,
                val: '',
                disabled: {
                    isAddPage: false,
                    isDelPage: true,
                    isAddArea: true,
                    isDelArea: true,
                    isMaterial: true,
                    isDelMaterial: true
                },
                isAnimations: false,
                currentNode: null,
                areaId: 1,
                animationsList: [
                    {
                        name: 'animation1',
                        type: 1,//单行文本
                        method: 1,//从右往左依次显示
                        speed: 1,
                        time: 10,
                        x: 500,
                        y: 200,
                        font: '40px Aria'
                    },
                    {
                        name: 'animation2',
                        type: 1,//单行文本
                        method: 2,//从左往右依次显示
                        speed: 1,
                        time: 10,
                        x: 100,
                        y: 300,
                        font: '40px Aria'
                    },
                    {
                        name: 'animation3',
                        type: 1,//单行文本
                        method: 3,//从上往下依次显示
                        speed: 1,
                        time: 10,
                        x: 200,
                        y: 100,
                        font: '40px Aria'
                    },
                    {
                        name: 'animation4',
                        type: 1,//单行文本
                        method: 4,//从下往上依次显示
                        speed: 1,
                        time: 10,
                        x: 100,
                        y: 500,
                        font: '40px Aria'
                    },
                    {
                        name: 'animation4',
                        type: 3,//时间日期
                        x: 500,
                        y: 500,
                    },
                    {
                        name: "animations5",
                        type: 4,
                        beginTime: new Date(),
                        x: 700,
                        y: 200,
                        index: 0
                    },
                    {
                        name: "animations7",
                        type: 4,
                        beginTime: new Date(),
                        x: 700,
                        y: 300,
                        index: 1
                    },
                    {
                        name: 'animations6',
                        type: 5,
                        endTime: '2020-04-10 17:30:00',
                        x: 1000,
                        y: 200,
                        index: 0
                    },
                    {
                        name: 'animations6',
                        type: 5,
                        endTime: '2020-04-10 17:29:00',
                        x: 1000,
                        y: 300,
                        index: 1
                    }
                ],
                materialId: 1,
                materialLayers: [],
                clickAndMove: {
                    click: false,
                    move: false
                },
                myIndexCount: 0,
                myDrawMaterial:null
            }
        },
        mounted() {
            this.initCanvas();
        },
        methods: {
            //创建canvas，并且为canvas添加鼠标事件
            initCanvas() {
                let myCanvas = this.myCanvas = this.$refs.canvasBox;
                this.ctx = myCanvas.getContext('2d');
                myCanvas.onmouseleave = function () {
                    myCanvas.onmousedown = null;
                    myCanvas.onmousemove = null;
                    myCanvas.onmouseup = null;
                };
                myCanvas.onmouseenter = () => {
                    myCanvas.onmousedown = this.mouseDown;
                    myCanvas.onmousemove = this.mouseMove;
                    myCanvas.ondblclick = this.dbclick;
                    document.onmouseup = this.mouseUp;
                };
                this.myDrawMaterial = new myDrawMaterial(this);
            },
            //鼠标事件
            mouseDown(e) {
                const {scale, ctx, myCanvas} = this;
                if (!this.checkedMaterial()) {
                    this.startX = (e.pageX - myCanvas.offsetLeft + myCanvas.parentElement.scrollLeft) / scale;
                    this.startY = (e.pageY - myCanvas.offsetTop + myCanvas.parentElement.scrollTop) / scale;
                    this.handlePointIsArea(this.startX, this.startY);
                    if (this.currentR) {
                        this.judgmentPoint(this.startX, this.startY);
                        this.leftDistance = this.startX - this.currentR.x1;
                        this.topDistance = this.startY - this.currentR.y1;
                    }
                    ctx.strokeRect(this.x, this.y, 0, 0);
                    ctx.strokeStyle = "#0000ff";
                    this.myFlag = 1;
                }
            },
            mouseMove(e) {
                const {myCanvas, scale, ctx, reshow} = this;
                this.x = (e.pageX - myCanvas.offsetLeft + myCanvas.parentElement.scrollLeft) / scale;
                this.y = (e.pageY - myCanvas.offsetTop + myCanvas.parentElement.scrollTop) / scale;
                ctx.save();
                myCanvas.style.cursor = "default";
                ctx.clearRect(0, 0, elementWidth, elementHeight);
                ctx.restore();
                reshow(this.x, this.y);
            },
            mouseUp() {
                let {fixPosition, reshow} = this;
                if(this.currentR){
                    fixPosition(this.currentR);
                }
                this.myFlag = 0;
                this.op = 0;
                if (this.currentR) {
                    this.currentNode.x.val = _.cloneDeep(this.currentR.x1);
                    this.currentNode.y.val = _.cloneDeep(this.currentR.y1);
                    this.currentNode.width.val = _.cloneDeep(this.currentR.width);
                    this.currentNode.height.val = _.cloneDeep(this.currentR.height);
                    this.handleMaterialLayer(this.currentR)
                }
                reshow(this.x, this.y);
            },
            //对区域的双击事件
            dbclick(e) {
                const {scale, myCanvas} = this;
                let x = (e.pageX - myCanvas.offsetLeft + myCanvas.parentElement.scrollLeft) / scale;
                let y = (e.pageY - myCanvas.offsetTop + myCanvas.parentElement.scrollTop) / scale;
                let data = this.$refs.MyTree.getCurrentNode();
                if (!data) return;
                if ((data.type === 1 || data.type === 2) && this.judgmentPointIsText(x, y, data.layer)) {
                    this.$prompt('请输入', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputValue: typeof data.layer.text === 'string' ? data.layer.text : data.layer.text.join('')
                    }).then(({value}) => {
                        this.pageList[this.choosePage].children[this.chooseArea].children.map(item => {
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
                        this.drawMaterial();
                    }).catch(() => {
                    })
                }
            },
            //判断双击区域是否可以输入文本
            judgmentPointIsText(x, y, layer) {
                return x >= layer.x1 && x <= layer.x2 && y >= layer.y1 && y <= layer.y2;
            },
            //绘制区域
            reshow(x, y) {
                let {ctx, scale, render, resizeHeight, resizeLeft, resizeWidth, resizeTop, resizeLT, resizeLH, resizeWH, resizeWT} = this;
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
                if (this.checkedMaterial()) {
                    this.drawMaterial();
                }
                if (this.myFlag && allNotIn && this.op < 3) {
                    this.op = 1
                }

            },
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
            },
            //移动选择的区域
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
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
            },
            //删除素材
            delMaterial() {
                let index = this.$refs.MyTree.getCurrentNode().material - 1;
                this.materialLayers.splice(index, 1);
                this.pageList[this.choosePage].children[this.chooseArea].children.splice(index, 1);
                let id = this.pageList[this.choosePage].children[this.chooseArea].id;
                this.$refs.MyTree.setCurrentKey(id);
                this.reDraw();
            },
            //动画开始时对数据的部分处理
            animateText() {
                this.isAnimations = true;
                this.animationsList.map(item => {
                    switch (item.type) {
                        case 4:
                            let countPos = 0, objPos = {};
                            this.PosCount.push(countPos);
                            this.Pos.push(objPos);
                            this.Pos.map((i, index) => {
                                if (!i.timer) {
                                    i.timer = setInterval(() => {
                                        this.PosCount[index] += 1
                                    }, 1000)
                                }
                            });
                            break;
                        case 5:
                            let count = (new Date(item.endTime) - new Date()) / 1000, obj = {};
                            this.DownCount.push(count.toFixed(0));
                            this.Down.push(obj);
                            this.Down.map((i, index) => {
                                if (!i.timer) {
                                    i.timer = setInterval(() => {
                                        this.DownCount[index] -= 1;
                                        if (this.DownCount[index] <= 0) {
                                            clearInterval(i.timer);
                                            i.timer = null;
                                        }
                                    }, 1000)
                                }
                            });
                            break;
                    }
                });
                this.timer = setInterval(this.beginAnimate, 200);
                this.MaskLayer();
            },
            //开始绘制动画
            beginAnimate() {
                const {ctx, myCanvas} = this;
                ctx.clearRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
                this.animationsList.map(item => {
                    ctx.beginPath();
                    switch (item.type) {
                        case 1:
                            ctx.textAlign = 'center';
                            ctx.font = item.font;
                            ctx.fillStyle = '#fff';
                            switch (item.method) {
                                case 1://从右往左
                                    ctx.fillText(item.name, item.x - item.speed * this.r, item.y);
                                    break;
                                case 2://从左往右
                                    ctx.fillText(item.name, item.x + item.speed * this.r, item.y);
                                    break;
                                case 3://从上往下
                                    ctx.fillText(item.name, item.x, item.y + item.speed * this.r);
                                    break;
                                case 4://从下往上
                                    ctx.fillText(item.name, item.x, item.y - item.speed * this.r);
                                    break;
                            }
                            break;
                        case 3:
                            ctx.textAlign = 'center';
                            ctx.font = '40px Aria';
                            ctx.fillStyle = 'red';
                            ctx.fillText(new Date().toLocaleString(), item.x, item.y);
                            break;
                        case 4:
                            this.PosCount.map((i, index) => {
                                if (index === item.index) {
                                    ctx.textAlign = 'center';
                                    ctx.font = '40px Aria';
                                    ctx.fillStyle = 'red';
                                    ctx.fillText('正计时：' + i, item.x, item.y);
                                }
                            });
                            break;
                        case 5:
                            this.DownCount.map((i, index) => {
                                if (index === item.index) {
                                    ctx.textAlign = 'center';
                                    ctx.font = '40px Aria';
                                    ctx.fillStyle = 'red';
                                    ctx.fillText('倒计时：' + i, item.x, item.y);
                                }
                            });
                            break;
                    }
                });
                this.r += 10;
                if (this.r > 400) {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.r = 10;
                    this.timerAll = setInterval(() => {
                        this.drawAllAnimations();
                    }, 1000)
                }
            },
            //处理点击树状结构后的操作
            handleNodeClick(data) {
                this.currentNode = data.animation;
                if (data.areaId) {
                    this.handleCurrentR(data.areaId);
                } else {
                    this.currentR = null;
                }
                if (data.parentIndex === -1) {
                    this.layers = [];
                    this.choosePage = data.index;
                    this.disabled = {
                        isAddPage: false,
                        isDelPage: false,
                        isAddArea: false,
                        isDelArea: true,
                        isMaterial: true,
                        isDelMaterial: true
                    };
                    data.children.map(item => {
                        this.layers.push(item.layer);
                    })
                } else if (data.children === undefined) {
                    this.disabled = {
                        isAddPage: true,
                        isDelPage: true,
                        isAddArea: true,
                        isDelArea: true,
                        isMaterial: false,
                        isDelMaterial: false
                    };
                    this.materialPush(data.layer);
                    this.drawMaterial();
                } else {
                    this.choosePage = data.parentIndex;
                    this.chooseArea = data.index;
                    this.reDraw();
                    this.disabled = {
                        isAddPage: true,
                        isDelPage: true,
                        isAddArea: false,
                        isDelArea: false,
                        isMaterial: false,
                        isDelMaterial: true
                    }
                }

            },
            //添加显示页
            addPage() {
                this.pageList.push({
                    name: PAGENAME + this.pageCount,
                    children: [],
                    index: this.pageCount - 1,
                    id: this.treeId,
                    parentIndex: -1,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.pageAnimation, PAGENAME, this.pageCount)))
                });
                this.choosePage = this.pageCount - 1;
                this.pageCount++;
                this.treeHighlightNode(this.treeId);
                this.disabled = {
                    isAddPage: false,
                    isDelPage: false,
                    isAddArea: false,
                    isDelArea: true,
                    isMaterial: true,
                    isDelMaterial: true
                };
                this.layers = [];
            },
            //删除显示页
            deletePage() {
                if (this.pageCount === 1) return;
                this.pageList.splice(this.choosePage, 1);
                this.pageList.map((item, index) => {
                    let count = index + 1;
                    item.name = item.name.includes(PAGENAME) ? PAGENAME + count : item.name;
                    item.index = index;
                    item.animation.name.val = item.animation.name.val.includes(PAGENAME) ? PAGENAME + count : item.animation.name.val;
                });
                this.choosePage--;
                this.pageCount--;
                if (this.pageList.length) {
                    this.$nextTick(() => {
                        this.$refs.MyTree.setCurrentKey(this.pageList[0].id);
                    });
                    this.disabled = {
                        isAddPage: false,
                        isDelPage: false,
                        isAddArea: true,
                        isDelArea: true,
                        isMaterial: true,
                        isDelMaterial: true
                    }
                } else {
                    this.disabled = {
                        isAddPage: false,
                        isDelPage: true,
                        isAddArea: true,
                        isDelArea: true,
                        isMaterial: true,
                        isDelMaterial: true
                    }
                }
            },
            //添加区域
            addArea() {
                this.disabled.addArea = true;
                let len = this.pageList[this.choosePage].children.length + 1;
                let layer = {
                    x1: 0,
                    y1: 0,
                    x2: 200,
                    y2: 200,
                    strokeStyle: 'skyblue',
                    type: 0,
                    areaId: this.areaId,
                    text: this.areaId,
                    id: this.treeId
                };
                this.pageList[this.choosePage].children.push({
                    name: AREANAME + len,
                    children: [],
                    index: len - 1,
                    id: this.treeId,
                    parentIndex: this.pageList[this.choosePage].index,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.areaAnimation, AREANAME, len))),
                    areaId: this.areaId,
                    layer: layer
                });
                this.chooseArea = len - 1;
                this.layers.push(this.fixPosition(layer));
                this.treeHighlightNode(this.treeId);
                this.disabled = {
                    isAddPage: true,
                    isDelPage: true,
                    isAddArea: false,
                    isDelArea: false,
                    isMaterial: false,
                    isDelMaterial: true
                };
                this.areaId++;
                this.currentR = this.layers[this.layers.length - 1];
                this.reshow(0, 0)
            },
            //删除区域
            deleteArea() {
                this.$nextTick(() => {
                    let data = this.$refs.MyTree.getCurrentNode();
                    this.pageList[data.parentIndex].children.splice(data.index, 1);
                    this.pageList[data.parentIndex].children.map((item, index) => {
                        let count = index + 1;
                        item.name = item.name.includes(AREANAME) ? AREANAME + count : item.name;
                        item.index = index;
                        item.animation.name.val = item.animation.name.val.includes(AREANAME) ? AREANAME + count : item.animation.name.val;
                    });
                    this.$refs.MyTree.setCurrentKey(this.pageList[data.parentIndex].id);
                    this.layers = [];
                    this.pageList[data.parentIndex].children.map(i => {
                        this.layers.push(i.layer);
                    });
                    this.disabled = {
                        isAddPage: true,
                        isDelPage: true,
                        isAddArea: false,
                        isDelArea: true,
                        isMaterial: true,
                        isDelMaterial: true
                    }
                });
            },
            //树状结构高亮设置
            treeHighlightNode(id) {
                this.$nextTick(() => {
                    this.$refs.MyTree.setCurrentKey(id)
                });
                this.treeId++
            },
            //处理动画的添加
            handleAnimation(obj, name, index) {
                obj.name.val = name + index;
                if (obj.UID) {
                    let date = new Date();
                    obj.UID.val = date.getHours().toFixed(0) + date.getMinutes().toFixed(0) + date.getSeconds().toFixed(0) + date.getMilliseconds()
                }
                return obj
            },
            //处理选中区域
            handleCurrentR(id) {
                this.layers.map(item => {
                    if (id === item.areaId) {
                        this.currentR = item;
                    }
                })
            },
            handleIpy(key) {
                console.log(key)
            },
            //重复动画
            drawAllAnimations() {
                const {ctx, myCanvas} = this;
                ctx.clearRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
                this.animationsList.map(item => {
                    ctx.beginPath();
                    switch (item.type) {
                        case 1:
                            ctx.textAlign = 'center';
                            ctx.font = item.font;
                            ctx.fillStyle = '#fff';
                            switch (item.method) {
                                case 1://从右往左
                                    ctx.fillText(item.name, item.x - item.speed * R, item.y);
                                    break;
                                case 2://从左往右
                                    ctx.fillText(item.name, item.x + item.speed * R, item.y);
                                    break;
                                case 3://从上往下
                                    ctx.fillText(item.name, item.x, item.y + item.speed * R);
                                    break;
                                case 4://从下往上
                                    ctx.fillText(item.name, item.x, item.y - item.speed * R);
                                    break;
                            }
                            break;
                        case 3://日期
                            ctx.textAlign = 'center';
                            ctx.font = '40px Aria';
                            ctx.fillStyle = 'red';
                            ctx.fillText(new Date().toLocaleString(), item.x, item.y);
                            break;
                        case 4://正计时
                            this.PosCount.map((i, index) => {
                                if (index === item.index) {
                                    ctx.textAlign = 'center';
                                    ctx.font = '40px Aria';
                                    ctx.fillStyle = 'red';
                                    ctx.fillText('正计时：' + i, item.x, item.y);
                                }
                            });
                            break;
                        case 5://倒计时
                            this.DownCount.map((i, index) => {
                                if (index === item.index) {
                                    ctx.textAlign = 'center';
                                    ctx.font = '40px Aria';
                                    ctx.fillStyle = 'red';
                                    ctx.fillText('倒计时：' + i, item.x, item.y);
                                }
                            });
                            break;
                    }
                });
            },
            //清除动画
            clearAnimations() {
                const {ctx, myCanvas} = this;
                this.isAnimations = false;
                ctx.clearRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
                clearInterval(this.timer);
                this.timer = null;
                clearInterval(this.timerAll);
                this.timerAll = null;
                this.Down.map(item => {
                    clearInterval(item.timer)
                });
                this.Down = [];
                this.DownCount = [];
                this.Pos.map(item => {
                    clearInterval(item.timer)
                });
                this.Pos = [];
                this.PosCount = [];
                $('#layer').remove()
            },
            //预览时添加遮罩，阻止操作
            MaskLayer() {
                const {myCanvas} = this;
                let MyCanvas = {
                    width: $(myCanvas).width() + 4,
                    height: $(myCanvas).height() + 4,
                    top: myCanvas.offsetTop,
                    left: myCanvas.offsetLeft
                };
                let layer = document.createElement('div');
                layer.setAttribute('id', 'layer');
                $(layer).css({
                    position: 'fixed',
                    width: MyCanvas.width,
                    height: MyCanvas.height,
                    backgroundColor: 'rgba(0,0,0,0)',
                    top: MyCanvas.top - 2,
                    left: MyCanvas.left - 2
                });
                $('body').append(layer)
            },
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
                            this.$nextTick(() => {
                                this.$refs.MyTree.setCurrentKey(item.id)
                            });
                            return 0;
                        }
                    })
                }
            },
            //重绘区域
            reDraw() {
                const {ctx} = this;
                ctx.clearRect(0, 0, elementWidth, elementHeight);
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
            },
            //选择素材
            choMaterial(type) {
                if (!this.pageList[this.choosePage].children[this.chooseArea].materialBlock) {
                    this.pageList[this.choosePage].children[this.chooseArea].materialBlock = JSON.parse(JSON.stringify(materialBlock));
                }
                switch (type) {
                    case 1:
                        this.handleSingText();
                        break;
                    case 2:
                        this.handleMultiLine();
                        break;
                    case 3:
                        this.handleDateTime();
                        break;
                    case 4:
                        this.handlePosTime();
                        break;
                    case 5:
                        this.handleDownTime();
                        break;
                    case 6:
                        this.handleTable();
                        break;
                }
                this.disabled = {
                    isAddPage: true,
                    isDelPage: true,
                    isAddArea: true,
                    isDelArea: true,
                    isMaterial: false,
                    isDelMaterial: false
                };
                this.drawMaterial();
            },
            //单行文本
            handleSingText() {
                let area = this.pageList[this.choosePage].children[this.chooseArea];
                let layer = this.pageList[this.choosePage].children[this.chooseArea].layer;
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
                    fontSize: 16
                };
                this.pageList[this.choosePage].children[this.chooseArea].children.push({
                    name: SINGTEXT + area.materialBlock.singText,
                    index: area.materialBlock.singText - 1,
                    id: this.treeId,
                    parentIndex: area.index,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.singTextAnimation, SINGTEXT, area.materialBlock.singText))),
                    material: this.materialId,
                    type: 1,
                    layer: myLayer
                });
                this.treeHighlightNode(this.treeId);
                this.materialId++;
                area.materialBlock.singText++;
                this.materialPush(myLayer)
            },
            //多行文本
            handleMultiLine() {
                let area = this.pageList[this.choosePage].children[this.chooseArea];
                let layer = this.pageList[this.choosePage].children[this.chooseArea].layer;
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
                    fontSize: 16
                };
                this.pageList[this.choosePage].children[this.chooseArea].children.push({
                    name: MULTILINETEXT + area.materialBlock.multiLine,
                    index: area.materialBlock.multiLine - 1,
                    id: this.treeId,
                    parentIndex: area.index,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.multiLineAnimation, MULTILINETEXT, area.materialBlock.multiLine))),
                    material: this.materialId,
                    type: 2,
                    layer: myLayer
                });
                this.treeHighlightNode(this.treeId);
                this.materialId++;
                area.materialBlock.multiLine++;
                this.materialPush(myLayer)
            },
            //时间日期
            handleDateTime() {
                let area = this.pageList[this.choosePage].children[this.chooseArea];
                let layer = this.pageList[this.choosePage].children[this.chooseArea].layer;
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
                    fontSize: 16
                };
                this.pageList[this.choosePage].children[this.chooseArea].children.push({
                    name: DATETIME + area.materialBlock.dateTime,
                    index: area.materialBlock.dateTime - 1,
                    id: this.treeId,
                    parentIndex: area.index,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.dateTimeAnimation, DATETIME, area.materialBlock.dateTime))),
                    material: this.materialId,
                    type: 3,
                    layer: myLayer
                });
                this.treeHighlightNode(this.treeId);
                this.materialId++;
                area.materialBlock.dateTime++;
                this.materialPush(myLayer)
            },
            //正计时
            handlePosTime() {
                let area = this.pageList[this.choosePage].children[this.chooseArea];
                this.pageList[this.choosePage].children[this.chooseArea].children.push({
                    name: POSTIME + area.materialBlock.posTime,
                    index: area.materialBlock.posTime - 1,
                    id: this.treeId,
                    parentIndex: area.index,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.multiLineAnimation, POSTIME, area.materialBlock.posTime))),
                    material: this.materialId,
                    type: 1
                });
                this.treeHighlightNode(this.treeId);
                this.materialId++;
                area.materialBlock.posTime++;
            },
            //倒计时
            handleDownTime() {
                let area = this.pageList[this.choosePage].children[this.chooseArea];
                this.pageList[this.choosePage].children[this.chooseArea].children.push({
                    name: DOWNTIEM + area.materialBlock.downTime,
                    index: area.materialBlock.downTime - 1,
                    id: this.treeId,
                    parentIndex: area.index,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.multiLineAnimation, DOWNTIEM, area.materialBlock.downTime))),
                    material: this.materialId,
                    type: 1
                });
                this.treeHighlightNode(this.treeId);
                this.materialId++;
                area.materialBlock.downTime++;
            },
            //表格
            handleTable() {
                let area = this.pageList[this.choosePage].children[this.chooseArea];
                this.pageList[this.choosePage].children[this.chooseArea].children.push({
                    name: TABLE + area.materialBlock.table,
                    index: area.materialBlock.table - 1,
                    id: this.treeId,
                    parentIndex: area.index,
                    animation: JSON.parse(JSON.stringify(this.handleAnimation(animations.multiLineAnimation, TABLE, area.materialBlock.table))),
                    material: this.materialId,
                    type: 1
                });
                this.treeHighlightNode(this.treeId);
                this.materialId++;
                area.materialBlock.table++;
            },
            //处理点击的点是否位于区域内
            handlePointIsArea(x, y) {
                this.layers.map(item => {
                    if (x >= item.x1 && x < item.x2 && y >= item.y1 && y < item.y2) {
                        this.currentR = item;
                        this.pageList[this.choosePage].children.map(i => {
                            if (i.areaId === item.areaId) {
                                this.chooseArea = i.index;
                                this.$nextTick(() => {
                                    this.$refs.MyTree.setCurrentKey(i.id);
                                    this.currentNode = _.cloneDeep(i.animation);
                                    this.disabled = {
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
            },
            //处理功能菜单数据变化
            handleFuncMenu(data) {
                data = _.cloneDeep(data);
                this.$nextTick(() => {
                    let currentNode = _.cloneDeep(this.$refs.MyTree.getCurrentNode());
                    if (this.pageList.length === 0) return;
                    if (currentNode.parentIndex === -1) {
                        this.pageList[this.choosePage].animation = data;
                        this.pageList[this.choosePage].name = data.name.val;
                    } else if (currentNode.children === undefined) {
                        this.pageList[this.choosePage].children[this.chooseArea].children.map(item => {
                            if (item.id === currentNode.id) {
                                item.animation = data;
                                item.name = data.name.val;
                            }
                        })
                    } else {
                        this.pageList[this.choosePage].children[this.chooseArea].animation = data;
                        this.pageList[this.choosePage].children[this.chooseArea].name = data.name.val;
                        let layer = this.pageList[this.choosePage].children[this.chooseArea].layer;
                        layer.x1 = parseInt(data.x.val);
                        layer.y1 = parseInt(data.y.val);
                        layer.width = data.width.val;
                        layer.height = data.height.val;
                        layer.x2 = parseInt(layer.x1) + parseInt(layer.width);
                        layer.y2 = parseInt(layer.y1) + parseInt(layer.height);
                    }
                });
            },
            drawMaterial() {
                const {ctx} = this;
                ctx.clearRect(0, 0, elementWidth, elementHeight);
                this.materialLayers.map(item => {
                    switch (item.type) {
                        case 1:
                            this.myDrawMaterial.singText(item);
                            break;
                        case 2:
                            this.myDrawMaterial.multiLine(item);
                            break;
                        case 3:
                            this.myDrawMaterial.dateTime_(item);
                            break;
                    }
                });
            },
            checkedMaterial() {
                let data = this.$refs.MyTree.getCurrentNode();
                return data ? data.material : data;
            },
            handleMaterialLayer(rect) {
                this.materialLayers.map(item => {
                    if (item.areaId === rect.areaId) {
                        item.x1 = rect.x1;
                        item.y1 = rect.y1;
                        item.width = rect.width;
                        item.height = rect.height;
                        item.x2 = parseInt(rect.x1) + parseInt(rect.width);
                        item.y2 = parseInt(rect.y1) + parseInt(rect.height);
                    }
                })
            },
            materialPush(layer) {
                let myBoolean = false, myIndex = null;
                this.materialLayers.map((item, index) => {
                    if (item.areaId === layer.areaId) {
                        myBoolean = true;
                        myIndex = index;
                        this.pageList[this.choosePage].children.map(i=>{
                            if(i.areaId === item.areaId){
                                layer.x1 = i.layer.x1;
                                layer.x2 = i.layer.x2;
                                layer.y1 = i.layer.y1;
                                layer.y2 = i.layer.y2;
                                layer.width = i.layer.width;
                                layer.height = i.layer.height;
                            }
                        })
                    }
                });
                if (myBoolean) {
                    this.materialLayers.splice(myIndex, 1, layer)
                } else {
                    this.materialLayers.push(layer)
                }
            }
        },
        watch: {
            pageListW: {
                handler(newVal) {
                    if (newVal.length === 0) {
                        this.layers = [];
                        this.currentNode = {};
                        return
                    }
                    let data1 = this.$refs.MyTree.getCurrentNode();
                    this.$nextTick(() => {
                        let data = this.$refs.MyTree.getCurrentNode();
                        if (data === data1) return;
                        this.currentNode = data.animation;
                        if (data.areaId) {
                            this.handleCurrentR(data.areaId);
                        } else {
                            this.currentR = null;
                        }
                    })
                },
                deep: true
            },
            layers: {
                handler(val) {
                    this.reDraw();
                },
                deep: true
            }
        },
        computed: {
            pageListW() {
                return JSON.parse(JSON.stringify(this.pageList))
            }
        },
        components: {
            FuncMenu
        }
    }
</script>

<style scoped lang="scss">
    .canvas-box {
        display: flex;
    }

    .box {
        width: calc(100% - 500px);
    }

    .btn-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 100%;
        .el-button {
            margin-bottom: 50px;
            height: 40px;
            width: 100px;
        }
    }

    .material-box {
        text-align: left;
    }

    .device-list {
        display: flex;
        & > div {
            width: 30%;
        }
        .node-info {
            display: flex;
            align-items: center;
            width: 70%;
            ul {
                width: 100%;
                li {
                    width: 100%;
                    span {
                        display: inline-block;
                        width: 50%;
                        text-align: left;
                    }
                }
            }
            span {
                width: 50%;
            }
        }
    }
</style>