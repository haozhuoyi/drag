<template>
    <div class="div-main">
        <div class="div-drag" @mousedown="move" v-for="i in 100" :key="i" :id="i">
            桌子
        </div>
        <div ref="room1" class="div-adsorbent">
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            positionX: 0,
            positionY: 0,
            coordinateArray: []
        }
    },
    mounted () {
        // 左上
        const leftTopX = this.$refs.room1.offsetLeft
        const leftTopY = this.$refs.room1.offsetTop
        // 右下
        const rightBottomX = this.$refs.room1.offsetLeft + this.$refs.room1.clientWidth
        const rightBottomY = this.$refs.room1.offsetTop + this.$refs.room1.clientHeight
        // 坐标类型，左上x，左上y，右下x，右下y
        this.coordinateArray = [['room', leftTopX, leftTopY, rightBottomX, rightBottomY]]
    },
    methods: {
        move (e) {
            const odiv = e.target

            const disX = e.clientX - odiv.offsetLeft
            const disY = e.clientY - odiv.offsetTop
            let resultsDeep = []
            for (let index = 0; index < this.coordinateArray.length; index++) {
                const item = this.coordinateArray[index]
                if (odiv.id === item[5]) {
                    this.coordinateArray.splice(index, 1)
                }
            }
            document.onmousemove = (e) => {
                const left = e.clientX - disX
                const top = e.clientY - disY

                const resultArray = this.checkAdsorbent(left, top, left + odiv.clientWidth, top + odiv.clientHeight)

                odiv.style.left = resultArray[0] + 'px'
                odiv.style.top = resultArray[1] + 'px'

                this.positionX = resultArray[0]
                this.positionY = resultArray[1]
                resultsDeep = JSON.parse(JSON.stringify(resultArray))
            }
            document.onmouseup = (e) => {
                // 坐标类型，左上x，左上y，右下x，右下y，组件id
                this.coordinateArray.push(['element', resultsDeep[0], resultsDeep[1], resultsDeep[0] + odiv.clientWidth, resultsDeep[1] + odiv.clientHeight, odiv.id])

                console.log(JSON.stringify(this.coordinateArray))
                document.onmousemove = null
                document.onmouseup = null
            }
        },
        checkAdsorbent (ltx, lty, rbx, rby) {
            let resultArrayX = ltx
            let resultArrayY = lty
            for (let index = 0; index < this.coordinateArray.length; index++) {
                const item = this.coordinateArray[index]
                const type = item[0]
                const leftTopX = item[1]
                const leftTopY = item[2]
                const rightBottomX = item[3]
                const rightBottomY = item[4]
                // 磁场范围
                const roomAdsorbentArea = 15
                const elementAdsorbentArea = 15
                if (type === 'room') {
                    // 上顶点和下顶点都在磁场范围内
                    if (lty > leftTopY && lty < rightBottomY && rby > leftTopY && rby < rightBottomY) {
                        if (ltx > leftTopX && ltx < leftTopX + roomAdsorbentArea) {
                            // 左边框
                            resultArrayX = leftTopX
                        } else if (rbx > rightBottomX - roomAdsorbentArea && rbx < rightBottomX) {
                            // 右边框
                            resultArrayX = rightBottomX - rbx + ltx
                        }
                    }
                    // 左顶点和右顶点都在磁场范围内
                    if (ltx > leftTopX && ltx < rightBottomX && rbx > leftTopX && rbx < rightBottomX) {
                        if (lty > leftTopY && lty < leftTopY + roomAdsorbentArea) {
                            // 上边框
                            resultArrayY = leftTopY
                        } else if (rby > rightBottomY - roomAdsorbentArea && rby < rightBottomY) {
                            // 下边框
                            resultArrayY = rightBottomY - rby + lty
                        }
                    }
                } else if (type === 'element') {
                    const middleX = (leftTopX + rightBottomX) / 2
                    const middleY = (leftTopY + rightBottomY) / 2

                    const elMiddleX = (ltx + rbx) / 2
                    const elMiddleY = (lty + rby) / 2
                    if (elMiddleY > middleY - elementAdsorbentArea && elMiddleY < middleY + elementAdsorbentArea) {
                        if (rbx > leftTopX - elementAdsorbentArea && rbx < leftTopX) {
                            // 父组件左中点 ＝》 子组件右中点
                            resultArrayX = leftTopX - rbx + ltx
                            resultArrayY = middleY - ((rby - lty) / 2)
                        } else if (ltx > rightBottomX && ltx < rightBottomX + elementAdsorbentArea) {
                            // 父组件右中点 ＝》 子组件左中点
                            resultArrayX = rightBottomX
                            resultArrayY = middleY - ((rby - lty) / 2)
                        }
                    } else if (elMiddleX > middleX - elementAdsorbentArea && elMiddleX < middleX + elementAdsorbentArea) {
                        if (rby > leftTopY - elementAdsorbentArea && rby < leftTopY) {
                            // 父组件上中点 ＝》 子组件下中点
                            resultArrayX = middleX - ((rbx - ltx) / 2)
                            resultArrayY = leftTopY - rby + lty
                        } else if (lty > rightBottomY && lty < rightBottomY + elementAdsorbentArea) {
                            // 父组件下中点 ＝》 子组件上中点
                            resultArrayX = middleX - ((rbx - ltx) / 2)
                            resultArrayY = rightBottomY
                        }
                    }
                }
            }
            return [resultArrayX, resultArrayY]
        }
    }
}

</script>
<style>

.div-main{
    width: 100vw;
    height: 100vh;
}
.div-drag{
    position: absolute;
    width: 50px;
    height: 30px;
    background: #666;
    z-index: 2;
}

.div-adsorbent{
    position: absolute;
    top: 300px;
    left: 500px;
    width: 400px;
    height: 400px;
    border: 1px black solid;
}
</style>

