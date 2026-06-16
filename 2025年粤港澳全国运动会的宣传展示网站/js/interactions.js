/**
 * AdvInteract - 高级交互功能类
 * 负责网站的进阶交互功能：标签页、提示框、进度条、计数动画、视差滚动、地理位置、模态框、拖拽、手势、键盘快捷键等
 */
class AdvInteract {
    constructor() {
        this.tabs();       // 标签页切换
        this.tips();       // 提示框
        this.progress();   // 进度条动画
        this.counter();    // 数字计数动画
        this.parallax();   // 视差滚动效果
        this.geo();        // 地理位置获取
    }

    /**
     * 标签页切换功能
     * 点击按钮切换对应内容区域
     */
    tabs() {
        var containers = document.querySelectorAll('.tabs-container');
        containers.forEach(c => {
            var btns = c.querySelectorAll('.tab-btn');      // 标签按钮
            var contents = c.querySelectorAll('.tab-content'); // 内容区域

            btns.forEach((btn, i) => {
                btn.addEventListener('click', () => {
                    // 移除所有按钮和内容的激活状态
                    btns.forEach(b => b.classList.remove('active'));
                    contents.forEach(ct => ct.classList.remove('active'));

                    // 激活当前点击的按钮和对应内容
                    btn.classList.add('active');
                    if (contents[i]) contents[i].classList.add('active');
                });
            });
        });
    }

    /**
     * 提示框功能
     * 鼠标悬停时显示提示信息
     */
    tips() {
        var els = document.querySelectorAll('[data-tooltip]'); // 带有提示的元素
        els.forEach(el => {
            var tip;
            // 鼠标进入时创建提示框
            el.addEventListener('mouseenter', () => {
                tip = document.createElement('div');
                tip.className = 'tooltip-popup';
                tip.textContent = el.dataset.tooltip;
                document.body.appendChild(tip);

                // 计算提示框位置：元素上方居中
                var r = el.getBoundingClientRect();
                tip.style.left = r.left + (r.width / 2) - (tip.offsetWidth / 2) + 'px';
                tip.style.top = r.top - tip.offsetHeight - 10 + 'px';
                tip.style.opacity = '1';
            });

            // 鼠标离开时移除提示框
            el.addEventListener('mouseleave', () => { if (tip) tip.remove(); });

            // 鼠标移动时提示框跟随
            el.addEventListener('mousemove', (e) => {
                if (tip) {
                    tip.style.left = e.pageX - (tip.offsetWidth / 2) + 'px';
                    tip.style.top = e.pageY - tip.offsetHeight - 15 + 'px';
                }
            });
        });
    }

    /**
     * 进度条动画
     * 进入视口时自动填充进度条
     */
    progress() {
        var bars = document.querySelectorAll('.progress-bar-fill');
        var obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    var bar = entry.target;
                    // 获取 data-width 属性作为进度百分比
                    var w = bar.dataset.width || '100';
                    setTimeout(() => { bar.style.width = w + '%'; }, 200);
                    // 停止观察已动画过的进度条
                    obs.unobserve(bar);
                }
            });
        }, { threshold: 0.5 }); // 元素50%可见时触发
        bars.forEach(bar => obs.observe(bar));
    }

    /**
     * 数字计数动画
     * 进入视口时从0动画到目标数字
     */
    counter() {
        var els = document.querySelectorAll('[data-count]'); // 带有目标数字的元素
        var obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.countAnim(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        els.forEach(el => obs.observe(el));
    }

    /**
     * 执行计数动画
     * @param {HTMLElement} el - 目标元素
     */
    countAnim(el) {
        var target = parseInt(el.dataset.count); // 目标数字
        var dur = 2000; // 动画持续时间（毫秒）
        var inc = target / (dur / 16); // 每帧增加的值（约60fps）
        var cur = 0;
        var timer = setInterval(() => {
            cur += inc;
            if (cur >= target) { cur = target; clearInterval(timer); }
            el.textContent = Math.floor(cur);
        }, 16);
    }

    /**
     * 视差滚动效果
     * 元素根据滚动位置以不同速度移动
     */
    parallax() {
        var els = document.querySelectorAll('[data-parallax]');
        var tick = false;
        var update = () => {
            els.forEach(el => {
                // 获取视差速度因子，默认为0.5
                var spd = parseFloat(el.dataset.parallax) || 0.5;
                var y = -(window.pageYOffset * spd);
                el.style.transform = 'translateY(' + y + 'px)';
            });
            tick = false;
        };
        // 滚动时更新位置，使用 requestAnimationFrame 节流
        window.addEventListener('scroll', () => {
            if (!tick) { window.requestAnimationFrame(update); tick = true; }
        });
    }

    /**
     * 地理位置获取
     * 获取用户当前经纬度
     */
    geo() {
        var els = document.querySelectorAll('.geo-location');
        if (els.length === 0) return;

        // 检查浏览器是否支持地理定位 API
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => { this.showLoc(pos.coords.latitude, pos.coords.longitude); },
                () => { console.log('geo fail'); }
            );
        }
    }

    /**
     * 显示位置信息
     * @param {number} lat - 纬度
     * @param {number} lon - 经度
     */
    showLoc(lat, lon) {
        var els = document.querySelectorAll('.geo-location');
        els.forEach(el => {
            el.innerHTML = '<div class="location-info"><strong>位置</strong><p>纬度: ' + lat.toFixed(4) + '</p><p>经度: ' + lon.toFixed(4) + '</p></div>';
        });
    }

    /**
     * 模态框功能
     * 点击触发器打开模态框，支持ESC键和点击外部关闭
     */
    modal() {
        // 点击触发器打开模态框
        var triggers = document.querySelectorAll('[data-modal]');
        triggers.forEach(t => {
            t.addEventListener('click', () => {
                var id = t.dataset.modal;
                var m = document.getElementById(id);
                if (m) {
                    m.classList.add('active');
                    document.body.style.overflow = 'hidden'; // 禁止背景滚动
                }
            });
        });

        // 点击关闭按钮或遮罩层关闭模态框
        var closers = document.querySelectorAll('.modal-close, .modal-overlay');
        closers.forEach(c => {
            c.addEventListener('click', () => {
                var m = c.closest('.modal');
                if (m) {
                    m.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // 按 ESC 键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                var m = document.querySelector('.modal.active');
                if (m) {
                    m.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }

    /**
     * 拖拽功能
     * 支持将可拖拽元素拖放到目标区域
     */
    drag() {
        var drags = document.querySelectorAll('[draggable="true"]');
        var zones = document.querySelectorAll('.drop-zone');

        // 为可拖拽元素添加拖拽事件
        drags.forEach(el => {
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', el.id);
                el.classList.add('dragging');
            });
            el.addEventListener('dragend', () => { el.classList.remove('dragging'); });
        });

        // 为目标区域添加放置事件
        zones.forEach(z => {
            z.addEventListener('dragover', (e) => {
                e.preventDefault(); // 允许放置
                z.classList.add('drag-over');
            });
            z.addEventListener('dragleave', () => { z.classList.remove('drag-over'); });
            z.addEventListener('drop', (e) => {
                e.preventDefault();
                z.classList.remove('drag-over');
                var id = e.dataTransfer.getData('text/plain');
                var el = document.getElementById(id);
                if (el) {
                    z.appendChild(el);
                    this.dropMsg(z, 'ok');
                }
            });
        });
    }

    /**
     * 显示拖放反馈信息
     * @param {HTMLElement} z - 目标区域
     * @param {string} type - 反馈类型（'ok' 或其他）
     */
    dropMsg(z, type) {
        var msg = document.createElement('div');
        msg.className = 'drop-feedback ' + type;
        msg.textContent = type === 'ok' ? '放好了' : '失败';
        z.appendChild(msg);
        setTimeout(() => { msg.remove(); }, 2000);
    }

    /**
     * 手势识别功能
     * 识别触摸滑动方向（上、下、左、右）
     */
    gesture() {
        var els = document.querySelectorAll('.gesture-area');
        var sx, sy, st; // 起始坐标和时间

        els.forEach(el => {
            // 触摸开始：记录起始位置和时间
            el.addEventListener('touchstart', (e) => {
                var touch = e.touches[0];
                sx = touch.clientX;
                sy = touch.clientY;
                st = Date.now();
            });

            // 触摸结束：计算滑动方向
            el.addEventListener('touchend', (e) => {
                if (!sx || !sy) return;
                var touch = e.changedTouches[0];
                var dx = sx - touch.clientX;  // 水平距离
                var dy = sy - touch.clientY;  // 垂直距离
                var dt = Date.now() - st;     // 滑动时间

                // 判断滑动方向：水平或垂直，滑动距离大于50px且时间小于300ms
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (Math.abs(dx) > 50 && dt < 300) this.swipe(el, dx > 0 ? 'left' : 'right');
                } else {
                    if (Math.abs(dy) > 50 && dt < 300) this.swipe(el, dy > 0 ? 'up' : 'down');
                }
                sx = sy = null;
            });
        });
    }

    /**
     * 处理滑动事件
     * @param {HTMLElement} el - 触发滑动的元素
     * @param {string} dir - 滑动方向
     */
    swipe(el, dir) {
        // 派发自定义 swipe 事件
        var ev = new CustomEvent('swipe', { detail: { direction: dir } });
        el.dispatchEvent(ev);
        // 添加滑动动画类
        el.classList.add('swipe-' + dir);
        setTimeout(() => { el.classList.remove('swipe-' + dir); }, 300);
    }

    /**
     * 键盘快捷键功能
     * 支持 Ctrl+K 搜索、Ctrl+H 首页、? 显示帮助
     */
    keys() {
        var map = {
            'Ctrl+K': () => this.openSrch(),   // 打开搜索
            'Ctrl+H': () => this.goHome(),     // 前往首页
            '?': () => this.helpKeys()         // 显示快捷键帮助
        };
        document.addEventListener('keydown', (e) => {
            var k = (e.ctrlKey ? 'Ctrl+' : '') + e.key;
            if (map[k]) { e.preventDefault(); map[k](); }
        });
    }

    /**
     * 打开搜索框
     */
    openSrch() {
        var inp = document.querySelector('.search-input');
        if (inp) { inp.focus(); inp.scrollIntoView({ behavior: 'smooth' }); }
    }

    /**
     * 前往首页
     */
    goHome() { window.location.href = 'index.html'; }

    /**
     * 显示快捷键帮助
     */
    helpKeys() { alert('Ctrl+K搜索 Ctrl+H首页'); }
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => { new AdvInteract(); });

// 支持 CommonJS 模块导出
if (typeof module !== 'undefined' && module.exports) { module.exports = AdvInteract; }
