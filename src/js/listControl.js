(function (root) {
    function listControl(data, wrapper) {
        const musicList = [];
        const list = document.createElement("div");
        const dl = document.createElement("dl");
        const dt = document.createElement("dt");
        const close = document.createElement("div");
        list.className = "list";
        close.className = "close";
        dt.innerHTML = "播放列表";
        close.innerHTML = "关闭";
        list.appendChild(dl);
        list.appendChild(close);
        dl.appendChild(dt);
        data.forEach(function (musicItem, index) {
            const dd = document.createElement("dd");
            dd.innerHTML = musicItem.name;
            musicList.push(dd);
            dd.addEventListener("touchend", () => {
                changeSelect(index);
            });
            dl.appendChild(dd);
        });
        wrapper.appendChild(list);
        const listHeight = list.offsetHeight;
        list.style.transform = `translateY(${listHeight}px)`;
        list.style.transition = "all 0.3s";
        // 列表滑出窗口
        function slideUp() {
            list.style.transform = `translateY(0px)`;
        }
        // 列表滑下窗口
        function slideDown() {
            list.style.transform = `translateY(${listHeight}px)`;
        }
        // 关闭按钮，列表下滑消失
        close.addEventListener("touchend", () => {
            slideDown();
        });
        // 默认选中第0个元素
        changeSelect(0);
        function changeSelect(index) {
            for (let i = 0; i < musicList.length; i++) {
                musicList[i].className = "";
            }
            musicList[index].className = "active";
        }
        return {
            musicList,
            dom: list,
            slideUp,
            slideDown,
            changeSelect
        };
    }
    root.listControl = listControl;
}(window.player || (window.player = {})));