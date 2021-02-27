(function (root) {
    class Progress {
        constructor() {
            this.durTime = 0;
            this.frameId = null;
            this.startTime = 0;
            this.stopPercent = 0;
            this.getDom();
        }
        getDom() {
            this.curTime = document.querySelector(".curTime");
            this.circle = document.querySelector(".circle");
            this.frontBg = document.querySelector(".frontBg");
            this.totalTime = document.querySelector(".totalTime");
        }
        renderAllTime(time) {
            this.durTime = time;
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
        }
        formatTime(time) {
            time = Math.round(time);
            let m = Math.floor(time / 60);// 分
            let s = time % 60;// 秒
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            return m + ":" + s;
        }
        // 移动进度条
        move(stopPer) {
            this.stopPercent = stopPer === undefined ? this.stopPercent : stopPer;
            cancelAnimationFrame(this.frameId);
            this.startTime = new Date().getTime();
            const frame = () => {
                const curTime = new Date().getTime();
                const per = this.stopPercent + (curTime - this.startTime) / (this.durTime * 1000);
                if (per < 1) {
                    this.update(per);
                } else {
                    cancelAnimationFrame(this.frameId);
                }
                this.frameId = requestAnimationFrame(frame);
            };
            frame();
        }
        // 更新进度条
        update(per) {
            // 更新左侧进度时间
            // per * this.durTime * 1000;
            const curTime = this.formatTime(per * this.durTime);
            this.curTime.innerHTML = curTime;
            // 更新前背景
            this.frontBg.style.width = per * 100 + "%";
            // 更新圆点位置
            const l = this.circle.nextElementSibling.offsetWidth;
            this.circle.style.transform = `translateX(${l}px)`;
        }
        // 停止进度条运动
        stop() {
            cancelAnimationFrame(this.frameId);
            // 暂停时已经走过的百分比
            this.stopPercent += (new Date().getTime() - this.startTime) / (this.durTime * 1000);
        }
    }
    class Drag {
        constructor(obj) {
            this.dom = obj;
            this.startPointX = 0;
            this.startLeft = 0;
            this.percent = 0;
        }
        init() {
            this.dom.style.transform = "translateX(0)";
            this.dom.addEventListener("touchstart", (e) => {
                // 找到第一个手指触摸的X轴点
                this.startPointX = e.changedTouches[0].pageX;
                // left值取translateX的值
                this.startLeft = parseFloat(this.dom.style.transform.split("(")[1]);
                this.start && this.start();
                e.preventDefault();
            });
            this.dom.addEventListener("touchmove", (e) => {
                e.preventDefault();
                // 差值为当前手指的位置减去startPoint
                const disPoint = e.changedTouches[0].pageX - this.startPointX;
                let left = this.startLeft + disPoint;
                const parentWidth = this.dom.offsetParent.offsetWidth;
                if (left < 0) left = 0;
                else if (left > parentWidth) {
                    left = parentWidth;
                }
                this.dom.style.transform = `translateX(${left}px)`;
                // 计算走过的百分比
                this.percent = left / parentWidth;
                this.move && this.move(this.percent);
            });
            this.dom.addEventListener("touchend", (e) => {
                this.end && this.end(this.percent);
            });
            this.dom.parentNode.addEventListener("touchend", (e) => {
                const startPoint = this.dom.parentNode.offsetLeft;
                let offsetLeft = e.changedTouches[0].pageX - startPoint;
                const parentWidth = this.dom.offsetParent.offsetWidth;
                if (offsetLeft < 0) offsetLeft = 0;
                else if (offsetLeft > parentWidth) {
                    offsetLeft = parentWidth;
                }
                this.dom.style.transform = `translateX(${offsetLeft}px)`;
                this.percent = offsetLeft / parentWidth;
                this.click && this.click(this.percent);
                e.preventDefault();
            });
        }
    }
    function instanceProgress() {
        return new Progress();
    }
    function instanceDrag(dom) {
        return new Drag(dom);
    }
    root.progress = {
        progressImplFn: instanceProgress,
        dragImplFn: instanceDrag
    };
}(window.player || (window.player = {})));