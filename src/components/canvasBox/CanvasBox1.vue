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
                <el-button type="primary" @click="clearAnimations1" :disabled="!isAnimations">清除动画</el-button>
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
    </div>
</template>

<script>
    import {animations} from "../../assets/js/animation";
    import FuncMenu from '../../components/funcMenu/FuncMenu';

    import myDrawMaterial from './drawMaterial';
    import Canvas from './canvas';
    import Animations from './animations';

    const elementWidth = 600, elementHeight = 800, SPEED = 8, R = 400;
    const PAGENAME = '显示页',
        AREANAME = '区域',
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
                animationsList: [],
                materialId: 1,
                materialLayers: [],
                clickAndMove: {
                    click: false,
                    move: false
                },
                myIndexCount: 0,
                myDrawMaterial: null,
                Canvas: null,
                Animations: null,
            }
        },
        mounted() {
            this.myDrawMaterial = new myDrawMaterial(this);
            this.Canvas = new Canvas(this);
            this.Animations = new Animations(this);
        },
        methods: {
            //删除素材
            delMaterial() {
                let id = this.$refs.MyTree.getCurrentNode().id, MIndex, AIndex;
                let type = this.$refs.MyTree.getCurrentNode().type;
                let name = type === 1 ? 'singText' : type === 2 ? 'multiLine' : type === 3 ? 'dateTime' : type === 4 ? 'posTime' : type === 5 ? 'downTime' : 'table';
                this.materialLayers.map((item, i) => {
                    if (item.id === id) {
                        MIndex = i
                    }
                });
                this.materialLayers.splice(MIndex, 1);
                this.pageList[this.choosePage].children[this.chooseArea].children.map((item, i) => {
                    if (item.id === id) {
                        AIndex = i
                    }
                });
                this.pageList[this.choosePage].children[this.chooseArea].children.splice(AIndex, 1);
                this.pageList[this.choosePage].children[this.chooseArea].materialBlock[name]--;
                let newId = this.pageList[this.choosePage].children[this.chooseArea].id;
                this.$refs.MyTree.setCurrentKey(newId);
                this.Canvas.reDraw();
            },
            //动画开始时对数据的部分处理
            animateText() {
                this.isAnimations = true;
                this.animationsList = [];
                this.pageList.map((i, indexI) => {
                    this.animationsList[indexI] = {};
                    this.animationsList[indexI].timer = null;
                    this.animationsList[indexI].fun = null;
                    if (i.children) {
                        this.animationsList[indexI].children = []
                    }
                    i.children.map((j, indexJ) => {
                        this.animationsList[indexI].children[indexJ] = {};
                        this.animationsList[indexI].children[indexJ].timer = null;
                        this.animationsList[indexI].children[indexJ].fun = null;
                        this.animationsList[indexI].children[indexJ].time = 0;
                        this.animationsList[indexI].children[indexJ].layer = j.layer;
                        if (j.children) {
                            this.animationsList[indexI].children[indexJ].children = []
                        }
                        j.children.map((k, indexK) => {
                            this.animationsList[indexI].children[indexJ].children[indexK] = {};
                            this.animationsList[indexI].children[indexJ].children[indexK].timer = null;
                            this.animationsList[indexI].children[indexJ].children[indexK].fun = null;
                            this.animationsList[indexI].children[indexJ].children[indexK].layer = k.layer;
                            this.animationsList[indexI].children[indexJ].children[indexK].time = k.animation.stay.val * 5;
                            this.animationsList[indexI].children[indexJ].time += k.animation.stay.val * 5;
                        })
                    })
                });
                this.animationsList.map((i) => {
                    i.children.map((j) => {
                        let len = j.children.length;
                        let q = 0;
                        if(len){
                            j.children[q].fun = this.Animations.draw(j.children[q].layer);
                            j.timer = setInterval(() => {
                                q++;
                                if (q >= len) {
                                    q = 0
                                }
                                j.children[q].fun = this.Animations.draw(j.children[q].layer);

                            }, 5000)
                        }
                    })
                });
            },
            //开始绘制动画
            beginAnimate(item) {
                switch (item.type) {
                    case 1:
                        this.Animations.drawSingText(item);
                        break;
                    case 2:
                        this.Animations.drawMultiLine(item);
                        break;
                    case 3:
                        this.Animations.drawDateTime(item);
                        break;
                    case 4:
                        this.Animations.drawPosTime();
                        break;
                    case 5:
                        this.Animations.drawDownTime();
                        break;
                    case 6:
                        this.Animations.drawTable();
                        break;
                }

            },
            //处理点击树状结构后的操作
            handleNodeClick(data) {
                this.currentNode = data.animation;
                if (data.areaId) {
                    this.handleCurrentR(data.areaId);
                } else {
                    this.Canvas.currentR = null;
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
                    this.Canvas.currentR = null;
                } else {
                    this.choosePage = data.parentIndex;
                    this.chooseArea = data.index;
                    this.Canvas.reDraw();
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
                this.Canvas.layers.push(this.Canvas.fixPosition(layer));
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
                this.Canvas.currentR = this.Canvas.layers[this.Canvas.layers.length - 1];
                this.Canvas.reshow(0, 0)
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
                    this.Canvas.layers = [];
                    this.pageList[data.parentIndex].children.map(i => {
                        this.Canvas.layers.push(i.layer);
                    });
                    this.locationMaterial();
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
                this.Canvas.layers.map(item => {
                    if (id === item.areaId) {
                        this.Canvas.currentR = item;
                    }
                })
            },
            handleIpy(key) {
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
                const {ctx, myCanvas} = this.Canvas;
                this.isAnimations = false;
                ctx.clearRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
                this.animationsList.map((i) => {
                    i.children.map((j) => {
                        clearInterval(j.timer);
                        j.timer = null;
                    })
                });
            },
            //清除动画
            clearAnimations1() {
                const {ctx, myCanvas} = this.Canvas;
                ctx.clearRect(200, 400, 200, 200);
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
            //选择素材
            choMaterial(type) {
                if (!this.pageList[this.choosePage].children[this.chooseArea].materialBlock) {
                    this.pageList[this.choosePage].children[this.chooseArea].materialBlock = JSON.parse(JSON.stringify(materialBlock));
                }
                this.disabled = {
                    isAddPage: true,
                    isDelPage: true,
                    isAddArea: true,
                    isDelArea: true,
                    isMaterial: false,
                    isDelMaterial: false
                };
                this.Canvas.currentR = null;
                switch (type) {
                    case 1:
                        this.myDrawMaterial.handleSingText();
                        break;
                    case 2:
                        this.myDrawMaterial.handleMultiLine();
                        break;
                    case 3:
                        this.myDrawMaterial.handleDateTime();
                        break;
                    case 4:
                        this.myDrawMaterial.handlePosTime();
                        break;
                    case 5:
                        this.myDrawMaterial.handleDownTime();
                        break;
                    case 6:
                        this.myDrawMaterial.handleTable();
                        break;
                }
                this.drawMaterial();
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
                                this.materialLayers.map(i=>{
                                    if(i.areaId === item.areaId){
                                        i.animation = item.animation;
                                    }
                                });
                                this.drawMaterial();
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
            //画素材
            drawMaterial() {
                const {ctx} = this.Canvas;
                ctx.clearRect(0, 0, elementWidth, elementHeight);
                this.Canvas.drawPixel(0, elementWidth, 0, elementHeight);
                this.materialLayers.map(item => {
                    // this.Canvas.drawPixel(item.x1,item.x2,item.y1,item.y2);
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
            //处理素材
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
            //添加素材
            materialPush(layer) {
                let myBoolean = false, myIndex = null;
                this.materialLayers.map((item, index) => {
                    if (item.areaId === layer.areaId) {
                        myBoolean = true;
                        myIndex = index;
                        this.pageList[this.choosePage].children.map(i => {
                            if (i.areaId === item.areaId) {
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
            },
            //检查素材
            checkedMaterial() {
                let data = this.$refs.MyTree.getCurrentNode();
                return data ? data.material : data;
            },
            //对素材进行重新整理
            locationMaterial() {
                this.materialLayers = [];
                this.pageList[this.choosePage].children.map(item => {
                    if (item.children.length > 0) {
                        this.materialLayers.push(item.children[0].layer)
                    }
                })
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
                        if (data.areaId && !data.material) {
                            this.handleCurrentR(data.areaId);
                        } else {
                            this.Canvas.currentR = null;
                        }
                    })
                },
                deep: true
            },
            'Canvas.layers': {
                handler(val) {
                    this.Canvas.reDraw();
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