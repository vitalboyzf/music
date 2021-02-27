// 返回目标歌曲索引，index为当前歌曲索引
(function (root) {
    function Index(len) {
        this.index = 0;
        this.len = len;
    }
    Index.prototype = {
        // 获取上一首歌曲的索引
        prev() {
            return this.get(-1);
        },
        // 获取下一首歌曲的索引
        next() {
            return this.get(1);
        },
        get(i) {
            this.index = (this.index + i + this.len) % this.len;
            return this.index;
        }
    };
    root.ControlIndex = Index;
}(window.player || (window.player = {})));