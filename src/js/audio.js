(function (root) {
    function AudioManager() {
        this.audio = new Audio();
        this.status = "pause";
    }
    AudioManager.prototype = {
        // 加载歌曲
        load(src) {
            this.audio.src = src;
            this.audio.load();
        },
        // 歌曲播放
        play() {
            this.audio.play();
            this.status = "play";
        },
        // 歌曲暂停
        pause() {
            this.audio.pause();
            this.status = "pause";
        },
        // 歌曲播放完毕的回调函数
        onPlayEnd(fn) {
            this.audio.onended = fn;
        },
        // 跳转到某一时间
        playTo(time) {
            // 单位s
            this.audio.currentTime = time;
        }
    };
    root.music = new AudioManager();
}(window.player || (window.player = {})));