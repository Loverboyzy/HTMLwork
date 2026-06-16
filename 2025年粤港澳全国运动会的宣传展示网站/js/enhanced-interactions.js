/**
 * ExtraFunc - 额外功能类
 * 负责网站的扩展功能：动态加载、AJAX请求、实时搜索、图片画廊、无限滚动、键盘导航、语音搜索、通知提示、筛选过滤、快速操作栏等
 */
class ExtraFunc {
    constructor() {
        this.dynLoad();      // 动态内容加载
        this.ajax();         // AJAX 请求
        this.rtSearch();     // 实时搜索
        this.gallery();      // 图片画廊（灯箱效果）
        this.infScroll();    // 无限滚动
        this.keyNav();       // 键盘导航
        this.voice();        // 语音搜索
        this.notify();       // 通知提示
        this.filter();       // 内容筛选
        this.quickBar();     // 快速操作栏
    }

    /**
     * 动态内容加载
     * 从指定 URL 加载内容并显示
     */
    dynLoad() {
        var els = document.querySelectorAll('[data-dynamic-load]');
        els.forEach(el => {
            var url = el.dataset.dynamicLoad;
            this.load(el, url);
        });
    }

    /**
     * 执行动态加载
     * @param {HTMLElement} el - 目标容器元素
     * @param {string} url - 数据 URL
     */
    async load(el, url) {
        try {
            el.innerHTML = '<div class="loading">loading...</div>';
            var res = await fetch(url);
            var data = await res.json();
            if (data.content) {
                el.innerHTML = data.content;
                this.fadeIn(el);
            }
        } catch (err) {
            el.innerHTML = '<div class="error">fail</div>';
        }
    }

    /**
     * 初始化 AJAX 功能
     * 设置 API 端点
     */
    ajax() {
        this.ajaxBtns();
        this.endpoints = {
            athletes: 'api/athletes.json',
            schedule: 'api/schedule.json',
            news: 'api/news.json'
        };
    }

    /**
     * AJAX 按钮点击事件
     * 点击按钮从服务器获取数据
     */
    ajaxBtns() {
        var btns = document.querySelectorAll('[data-ajax]');
        btns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                var url = btn.dataset.ajax;
                var target = btn.dataset.target;
                await this.fetchData(url, target, btn);
            });
        });
    }

    /**
     * 获取 AJAX 数据
     * @param {string} url - 数据接口地址
     * @param {string} tid - 目标元素 ID
     * @param {HTMLElement} btn - 触发按钮
     */
    async fetchData(url, tid, btn) {
        var t = document.getElementById(tid);
        if (!t) return;
        btn.classList.add('loading');
        btn.disabled = true;
        try {
            var res = await fetch(url);
            var data = await res.json();
            if (data.success) {
                this.render(t, data);
                this.msg('ok', 'success');
            } else {
                throw new Error(data.message || 'fail');
            }
        } catch (err) {
            this.msg(err.message, 'error');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }

    /**
     * 渲染数据到页面
     * @param {HTMLElement} t - 目标容器
     * @param {object} data - 数据对象
     */
    render(t, data) {
        if (Array.isArray(data.items)) {
            var html = data.items.map(item =>
                '<div class="data-item" data-id="' + item.id + '"><h3>' + item.title + '</h3><p>' + item.description + '</p></div>'
            ).join('');
            t.innerHTML = html;
        } else {
            t.innerHTML = '<div class="data-item">no data</div>';
        }
        this.fadeIn(t);
    }

    /**
     * 初始化实时搜索
     * 为搜索框添加实时建议功能
     */
    rtSearch() {
        var inputs = document.querySelectorAll('.realtime-search');
        inputs.forEach(inp => { this.setupSrch(inp); });
    }

    /**
     * 设置搜索框
     * @param {HTMLElement} inp - 输入框元素
     */
    setupSrch(inp) {
        var timeout;
        var box = this.createBox(inp); // 创建建议框
        inp.addEventListener('input', (e) => {
            clearTimeout(timeout);
            var q = e.target.value.trim();
            if (q.length > 0) {
                // 300ms 防抖后获取建议
                timeout = setTimeout(() => { this.getSuggest(q, box); }, 300);
            } else {
                box.style.display = 'none';
            }
        });
        // 点击其他区域关闭建议框
        document.addEventListener('click', (e) => {
            if (!inp.contains(e.target) && !box.contains(e.target)) box.style.display = 'none';
        });
    }

    /**
     * 创建搜索建议框
     * @param {HTMLElement} inp - 输入框元素
     * @returns {HTMLElement} - 创建的建议框
     */
    createBox(inp) {
        var box = document.createElement('div');
        box.className = 'search-suggestions';
        inp.parentNode.appendChild(box);
        return box;
    }

    /**
     * 获取搜索建议
     * @param {string} q - 搜索关键词
     * @param {HTMLElement} box - 建议框元素
     */
    async getSuggest(q, box) {
        try {
            // 模拟搜索建议（实际项目中应调用真实 API）
            var list = [q + ' - 1', q + ' - 2', q + ' - 3'];
            var html = list.map(s => '<div class="suggestion-item">' + s + '</div>').join('');
            box.innerHTML = html;
            box.style.display = 'block';
            // 点击建议项填充到输入框
            box.querySelectorAll('.suggestion-item').forEach((item, i) => {
                item.addEventListener('click', () => {
                    var inp = box.previousElementSibling;
                    inp.value = list[i];
                    box.style.display = 'none';
                });
            });
        } catch (err) {
            console.log('search err');
        }
    }

    /**
     * 初始化图片画廊
     * 点击图片显示灯箱效果
     */
    gallery() {
        var gals = document.querySelectorAll('.image-gallery');
        gals.forEach(g => { this.setupGal(g); });
    }

    /**
     * 设置图片画廊
     * @param {HTMLElement} g - 画廊容器
     */
    setupGal(g) {
        var imgs = g.querySelectorAll('.gallery-item img');
        var lb = this.createLb(); // 创建灯箱
        imgs.forEach((img, i) => {
            img.addEventListener('click', () => { this.openLb(lb, imgs, i); });
        });
    }

    /**
     * 创建灯箱元素
     * @returns {HTMLElement} - 灯箱元素
     */
    createLb() {
        var lb = document.createElement('div');
        lb.className = 'lightbox';
        lb.innerHTML = `
            <div class="lightbox-content">
                <img class="lightbox-image" src="" alt="">
                <button class="lightbox-close">X</button>
                <button class="lightbox-prev">&lt;</button>
                <button class="lightbox-next">&gt;</button>
            </div>`;
        document.body.appendChild(lb);
        return lb;
    }

    /**
     * 打开灯箱
     * @param {HTMLElement} lb - 灯箱元素
     * @param {NodeList} imgs - 图片列表
     * @param {number} idx - 当前图片索引
     */
    openLb(lb, imgs, idx) {
        var img = lb.querySelector('.lightbox-image');
        img.src = imgs[idx].src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 绑定导航按钮事件
        lb.querySelector('.lightbox-prev').onclick = () => this.navLb(lb, imgs, idx - 1);
        lb.querySelector('.lightbox-next').onclick = () => this.navLb(lb, imgs, idx + 1);
        lb.querySelector('.lightbox-close').onclick = () => this.closeLb(lb);

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLb(lb);
            if (e.key === 'ArrowLeft') this.navLb(lb, imgs, idx - 1);
            if (e.key === 'ArrowRight') this.navLb(lb, imgs, idx + 1);
        });
    }

    /**
     * 灯箱图片导航
     * @param {HTMLElement} lb - 灯箱元素
     * @param {NodeList} imgs - 图片列表
     * @param {number} idx - 目标图片索引
     */
    navLb(lb, imgs, idx) {
        if (idx >= 0 && idx < imgs.length) {
            var img = lb.querySelector('.lightbox-image');
            img.src = imgs[idx].src;
        }
    }

    /**
     * 关闭灯箱
     * @param {HTMLElement} lb - 灯箱元素
     */
    closeLb(lb) {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * 初始化无限滚动
     * 滚动到底部自动加载更多内容
     */
    infScroll() {
        var els = document.querySelectorAll('[data-infinite-scroll]');
        els.forEach(el => { this.setupInf(el); });
    }

    /**
     * 设置无限滚动
     * @param {HTMLElement} el - 滚动容器
     */
    setupInf(el) {
        var loading = false;
        var page = 1;
        window.addEventListener('scroll', () => {
            if (loading) return;
            var st = window.pageYOffset || document.documentElement.scrollTop;
            var wh = window.innerHeight;
            var dh = document.documentElement.scrollHeight;
            // 滚动到距离底部1000px时加载更多
            if (st + wh >= dh - 1000) { this.loadMore(el, page++); }
        });
    }

    /**
     * 加载更多内容
     * @param {HTMLElement} el - 容器元素
     * @param {number} page - 页码
     */
    async loadMore(el, page) {
        var loader = document.createElement('div');
        loader.className = 'infinite-scroll-loader';
        loader.textContent = 'loading...';
        el.appendChild(loader);
        try {
            // 模拟网络请求延迟
            await new Promise(r => setTimeout(r, 1000));
            var html = this.genMore(page); // 生成新内容
            el.insertAdjacentHTML('beforeend', html);
            loader.remove();
            this.fadeIn(el);
        } catch (err) {
            loader.textContent = 'fail';
        }
    }

    /**
     * 生成更多内容（模拟数据）
     * @param {number} page - 页码
     * @returns {string} - HTML 字符串
     */
    genMore(page) {
        var arr = [];
        for (var i = 1; i <= 5; i++) {
            arr.push('<div class="infinite-item"><h3>p' + page + ' - ' + i + '</h3><p>content</p></div>');
        }
        return arr.join('');
    }

    /**
     * 初始化键盘导航
     * 支持 Tab 循环和方向键网格导航
     */
    keyNav() {
        this.tabNav();
        this.arrowNav();
    }

    /**
     * Tab 键循环导航
     * 在最后一个元素时跳回第一个
     */
    tabNav() {
        var els = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') this.handleTab(e, els);
        });
    }

    /**
     * 处理 Tab 键导航
     * @param {KeyboardEvent} e - 键盘事件
     * @param {NodeList} els - 可聚焦元素列表
     */
    handleTab(e, els) {
        var idx = Array.from(els).indexOf(document.activeElement);
        if (e.shiftKey) {
            // Shift+Tab：回到最后一个
            if (idx === 0) { e.preventDefault(); els[els.length - 1].focus(); }
        } else {
            // Tab：跳到第一个
            if (idx === els.length - 1) { e.preventDefault(); els[0].focus(); }
        }
    }

    /**
     * 方向键网格导航
     * 在网格中用方向键移动焦点
     */
    arrowNav() {
        var grids = document.querySelectorAll('.nav-grid');
        grids.forEach(g => {
            var items = g.querySelectorAll('.nav-item');
            items.forEach((item, i) => {
                item.addEventListener('keydown', (e) => { this.handleArrow(e, items, i); });
            });
        });
    }

    /**
     * 处理方向键导航
     * @param {KeyboardEvent} e - 键盘事件
     * @param {NodeList} items - 网格项列表
     * @param {number} i - 当前索引
     */
    handleArrow(e, items, i) {
        var cols = Math.sqrt(items.length); // 假设正方形网格
        var ti = i;
        switch (e.key) {
            case 'ArrowLeft': e.preventDefault(); ti = i - 1; break;
            case 'ArrowRight': e.preventDefault(); ti = i + 1; break;
            case 'ArrowUp': e.preventDefault(); ti = i - cols; break;
            case 'ArrowDown': e.preventDefault(); ti = i + cols; break;
        }
        if (ti >= 0 && ti < items.length) items[ti].focus();
    }

    /**
     * 初始化语音搜索
     * 使用 Web Speech API 实现语音输入
     */
    voice() {
        var btns = document.querySelectorAll('[data-voice-search]');
        btns.forEach(btn => {
            btn.addEventListener('click', () => { this.startVoice(btn); });
        });
    }

    /**
     * 启动语音识别
     * @param {HTMLElement} btn - 语音按钮
     */
    startVoice(btn) {
        // 检查浏览器是否支持语音识别
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.msg('not supported', 'error');
            return;
        }
        var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        var rec = new SR();
        rec.lang = 'zh-CN'; // 设置中文
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.start();
        btn.classList.add('listening');
        btn.textContent = '...';

        // 识别结果
        rec.onresult = (e) => {
            var txt = e.results[0][0].transcript;
            var inp = btn.previousElementSibling;
            inp.value = txt;
            this.msg(txt, 'success');
        };
        // 语音结束
        rec.onspeechend = () => { rec.stop(); btn.classList.remove('listening'); btn.textContent = 'voice'; };
        // 错误处理
        rec.onerror = () => { this.msg('fail', 'error'); btn.classList.remove('listening'); btn.textContent = 'voice'; };
    }

    /**
     * 初始化通知系统
     * 创建通知容器
     */
    notify() {
        this.notifyBox = document.createElement('div');
        this.notifyBox.className = 'notification-container';
        document.body.appendChild(this.notifyBox);
    }

    /**
     * 显示通知消息
     * @param {string} text - 消息内容
     * @param {string} type - 消息类型（success/error/info）
     * @param {number} dur - 显示时长（毫秒）
     */
    msg(text, type, dur) {
        type = type || 'info';
        dur = dur || 3000;
        var n = document.createElement('div');
        n.className = 'notification notification-' + type;
        n.innerHTML = '<span>' + text + '</span><button class="notification-close">x</button>';
        this.notifyBox.appendChild(n);
        setTimeout(() => n.classList.add('show'), 100);

        // 自动关闭
        var tid = setTimeout(() => { this.removeMsg(n); }, dur);
        // 点击关闭按钮
        n.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(tid);
            this.removeMsg(n);
        });
    }

    /**
     * 移除通知
     * @param {HTMLElement} n - 通知元素
     */
    removeMsg(n) {
        n.classList.remove('show');
        setTimeout(() => n.remove(), 300);
    }

    /**
     * 初始化内容筛选
     * 点击按钮筛选显示/隐藏项目
     */
    filter() {
        var els = document.querySelectorAll('[data-filter]');
        els.forEach(el => { this.setupFilter(el); });
    }

    /**
     * 设置筛选功能
     * @param {HTMLElement} el - 筛选容器
     */
    setupFilter(el) {
        var btns = el.querySelectorAll('.filter-button');
        var items = el.querySelectorAll('.filter-item');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                var val = btn.dataset.filterValue;
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 显示/隐藏匹配的项目
                items.forEach(item => {
                    if (val === 'all' || item.dataset.category === val) {
                        item.style.display = '';
                        this.fadeIn(item);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /**
     * 初始化快速操作栏
     * 提供常用操作的快捷按钮
     */
    quickBar() {
        this.createBar();
        this.shortcut();
    }

    /**
     * 创建快速操作栏
     */
    createBar() {
        var bar = document.createElement('div');
        bar.className = 'quick-action-bar';
        bar.innerHTML = `
            <button class="quick-action" data-action="home">Home</button>
            <button class="quick-action" data-action="search">Search</button>
            <button class="quick-action" data-action="back">Back</button>
            <button class="quick-action" data-action="forward">Fwd</button>
            <button class="quick-action" data-action="refresh">Refresh</button>`;
        document.body.appendChild(bar);

        bar.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', () => { this.doAction(btn.dataset.action); });
        });
    }

    /**
     * 执行快捷操作
     * @param {string} act - 操作类型
     */
    doAction(act) {
        switch (act) {
            case 'home': window.location.href = 'index.html'; break;
            case 'search': var inp = document.querySelector('.search-input'); if (inp) inp.focus(); break;
            case 'back': window.history.back(); break;
            case 'forward': window.history.forward(); break;
            case 'refresh': window.location.reload(); break;
        }
    }

    /**
     * 键盘快捷键
     * Alt+1~5 触发对应操作
     */
    shortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                var acts = ['home', 'search', 'back', 'forward', 'refresh'];
                this.doAction(acts[parseInt(e.key) - 1]);
            }
        });
    }

    /**
     * 淡入动画
     * 元素从小到大、从不透明到透明动画
     * @param {HTMLElement} el - 目标元素
     */
    fadeIn(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.3s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 50);
    }
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => { new ExtraFunc(); });

// 支持 CommonJS 模块导出
if (typeof module !== 'undefined' && module.exports) { module.exports = ExtraFunc; }
