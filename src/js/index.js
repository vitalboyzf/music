(function (player) {
    function MusicPlayer(dom) {
        this.wrap = dom;
        this.dataList = [];
        this.record = null;
        this.controlBtn = null;
        this.rotateTimer = null;
        this.indexObj = null;
        this.curIndex = 0;
        this.list = null;
        this.progress = player.progress.progressImplFn();
    }
    MusicPlayer.prototype = {
        init() {
            this.getDom();
            this.getData("../mock/data.json");
        },
        getDom() {
            this.record = document.querySelector(".songImg img");
            this.controlBtn = document.querySelectorAll(".control li");
        },
        // 获取歌曲数据
        getData(url) {
            fetch(url).then(res => res.json()).then(data => {
                this.dataList = data;
                this.indexObj = new player.ControlIndex(data.length);
                // 加载列表切歌控制
                this.listControl(data);
                // 加载音乐
                this.loadMusic(this.indexObj.index);
                // 加载音乐控制 （切歌）
                this.musicControl();
                this.dragProgress();
                player.music.audio.addEventListener("canplay", () => {

                });
            });
        },
        // 列表切歌
        listControl(data) {
            const that = this;
            this.list = window.player.listControl(data, this.wrap);
            this.controlBtn[4].addEventListener("touchend", () => {
                this.list.slideUp();
            });
            this.list.musicList.forEach((musicItem, i) => {
                musicItem.addEventListener("touchend", () => {
                    if (this.curIndex === i) return;
                    this.indexObj.index = i;
                    player.music.status = "play";
                    that.loadMusic(i);
                    that.list.slideDown();
                });
            });
        },
        loadMusic(index) {
            player.music.load(this.dataList[index].audioSrc);
            player.render(this.dataList[index]);

            this.progress.renderAllTime(this.dataList[index].duration);
            if (player.music.status === "play") {
                player.music.play();
                this.controlBtn[2].className = "playing";
            }
            this.list.changeSelect(index);
            this.curIndex = index;

            player.music.onPlayEnd(() => {
                this.loadMusic(this.indexObj.next());
                this.progress.move(0);
            });
        },
        musicControl() {
            const that = this;
            // 上一首
            this.controlBtn[1].addEventListener("touchend", () => {
                player.music.status = "play";
                this.loadMusic(this.indexObj.prev());
                that.progress.move(0);
            });
            // 播放/暂停
            this.controlBtn[2].addEventListener("touchend", function () {
                if (player.music.status === "play") {
                    player.music.pause();
                    this.className = "";
                    that.imgStop();
                    that.progress.stop();
                } else {
                    // 当前为暂停，点击播放
                    player.music.play();
                    this.className = "playing";
                    const deg = that.record.dataset.rotate || 0;
                    that.imgRotate(deg);
                    that.progress.move();
                }
            });
            // 下一首
            this.controlBtn[3].addEventListener("touchend", () => {
                player.music.status = "play";
                this.loadMusic(this.indexObj.next());
                that.progress.move(0);
            });
        },
        imgRotate(deg) {
            clearInterval(this.rotateTimer);
            deg = parseFloat(deg);
            this.rotateTimer = setInterval(() => {
                deg = (deg + 0.2) % 360;
                this.record.style.transform = "rotate(" + deg + "deg)";
                this.record.dataset.rotate = deg;
            }, 1000 / 60);
        },
        imgStop() {
            clearInterval(this.rotateTimer);
        },
        dragProgress() {
            const circle = player.progress.dragImplFn(document.querySelector(".circle"));
            circle.init();
            circle.start = () => {
                this.progress.stop();
            };
            // 拖拽圆点
            circle.move = (percent) => {
                // this.progress.move(percent);// 进度条更新
                this.progress.update(percent);
            };
            // 抬起圆点
            circle.end = (percent) => {
                const curTime = this.dataList[this.indexObj.index].duration * percent;
                player.music.playTo(curTime);
                player.music.play();
                this.progress.move(percent);// 进度条更新
                // 图片转动
                const deg = this.record.dataset.rotate || 0;
                this.imgRotate(deg);
                this.controlBtn[2].className = "playing";
            };
            circle.click = (percent) => {
                circle.move(percent);
                circle.end(percent);
            };
        }
    };
    const music = new MusicPlayer(document.getElementById("wrapper"));
    music.init();
}(window.player));