/**
 * GamesWebsite - 全运会网站主功能类
 * 负责网站的核心功能：主题切换、返回顶部、图片懒加载、轮播、搜索、表单验证等
 */
class GamesWebsite {
    constructor() {
        this.init();
    }

    /**
     * 初始化所有功能
     */
    init() {
        this.themeToggle();     // 主题切换
        this.backTop();         // 返回顶部按钮
        this.smoothScroll();    // 平滑滚动
        this.lazyImg();         // 图片懒加载
        this.carousel();        // 轮播图
        this.search();          // 搜索功能
        this.storage();         // 本地存储
        this.anim();            // 动画效果
    }

    /**
     * 主题切换功能
     * 亮色/暗色模式切换，并保存到 localStorage
     */
    themeToggle() {
        // 从本地存储获取主题设置，默认为亮色
        var theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);

        // 创建主题切换按钮
        var nav = document.querySelector('.navbar .container');
        if (nav && !document.querySelector('.theme-toggle-btn')) {
            var btn = document.createElement('button');
            btn.className = 'theme-toggle-btn';
            // 按钮文字：暗色显示"日"，亮色显示"夜"
            btn.innerHTML = theme === 'dark' ? '日' : '夜';
            btn.title = '切换';
            nav.appendChild(btn);

            // 点击切换主题
            btn.addEventListener('click', () => {
                var cur = document.documentElement.getAttribute('data-theme');
                var next = cur === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
                btn.innerHTML = next === 'dark' ? '日' : '夜';
                // 添加过渡动画
                document.body.style.transition = 'background-color 0.5s ease';
                setTimeout(() => { document.body.style.transition = ''; }, 500);
            });
        }
    }

    /**
     * 返回顶部按钮
     * 滚动超过300px后显示，点击可平滑回到顶部
     */
    backTop() {
        if (!document.querySelector('.back-to-top-btn')) {
            var btn = document.createElement('button');
            btn.className = 'back-to-top-btn';
            btn.innerHTML = 'TOP';
            btn.title = '顶部';
            document.body.appendChild(btn);

            // 使用节流避免频繁触发滚动事件
            var tick = false;
            window.addEventListener('scroll', () => {
                if (!tick) {
                    window.requestAnimationFrame(() => {
                        var st = window.pageYOffset || document.documentElement.scrollTop;
                        // 滚动超过300px显示按钮
                        st > 300 ? btn.classList.add('visible') : btn.classList.remove('visible');
                        tick = false;
                    });
                    tick = true;
                }
            });

            // 点击返回顶部
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    /**
     * 平滑滚动
     * 为所有锚点链接添加平滑滚动效果
     */
    smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                var t = document.querySelector(this.getAttribute('href'));
                if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    /**
     * 图片懒加载
     * 使用 IntersectionObserver 实现图片进入视口时才开始加载
     */
    lazyImg() {
        var imgs = document.querySelectorAll('img[data-src]');
        var obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    // 将 data-src 的值赋给 src，开始加载图片
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    // 停止观察已加载的图片
                    obs.unobserve(img);
                }
            });
        });
        imgs.forEach(img => obs.observe(img));
    }

    /**
     * 轮播图功能
     * 自动轮播，每5秒切换一张幻灯片
     */
    carousel() {
        var slider = document.querySelector('.hero-slider');
        if (slider) {
            var slides = slider.querySelectorAll('.slide');
            var cur = 0;           // 当前索引
            var total = slides.length;  // 总数量

            // 定时轮播
            setInterval(() => {
                cur = (cur + 1) % total;  // 循环递增
                var r = slider.querySelector('#slide' + (cur + 1));
                if (r) {
                    r.checked = true;
                    this.slideAnim(slides[cur]);
                }
            }, 5000);
        }
    }

    /**
     * 幻灯片切换动画
     * @param {HTMLElement} s - 幻灯片元素
     */
    slideAnim(s) {
        s.style.opacity = '0';
        s.style.transform = 'scale(0.95)';
        setTimeout(() => {
            s.style.transition = 'all 0.8s ease';
            s.style.opacity = '1';
            s.style.transform = 'scale(1)';
        }, 50);
    }

    /**
     * 搜索功能
     * 实时搜索，有防抖处理
     */
    search() {
        var inp = document.querySelector('.search-input');
        if (inp) {
            var t;
            inp.addEventListener('input', (e) => {
                clearTimeout(t);
                // 300ms 防抖
                t = setTimeout(() => {
                    var q = e.target.value.toLowerCase();
                    this.doSearch(q);
                }, 300);
            });
        }
    }

    /**
     * 执行搜索
     * @param {string} q - 搜索关键词
     */
    doSearch(q) {
        var els = document.querySelectorAll('[data-searchable]');
        els.forEach(el => {
            var txt = el.textContent.toLowerCase();
            if (txt.includes(q) || q === '') {
                el.style.display = '';
                el.classList.remove('search-highlight');
            } else {
                el.style.display = 'none';
            }
        });
        // 高亮匹配的关键词
        if (q.length > 0) this.highlight(q);
    }

    /**
     * 高亮搜索结果
     * @param {string} q - 搜索关键词
     */
    highlight(q) {
        // 使用 TreeWalker 遍历所有文本节点
        var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var nodes = [];
        var n;
        while (n = w.nextNode()) {
            // 跳过 script、style、nav 等不需要高亮的元素
            if (n.parentElement.closest('script, style, nav')) continue;
            nodes.push(n);
        }
        nodes.forEach(node => {
            var txt = node.textContent;
            var reg = new RegExp('(' + q + ')', 'gi');
            if (reg.test(txt)) {
                var h = txt.replace(reg, '<mark class="search-highlight">$1</mark>');
                var wrap = document.createElement('div');
                wrap.innerHTML = h;
                node.parentNode.replaceChild(wrap, node);
            }
        });
    }

    /**
     * 用户偏好存储
     * 记录访问次数等信息到本地存储
     */
    storage() {
        var c = localStorage.getItem('visitCount') || 0;
        var nc = parseInt(c) + 1;
        localStorage.setItem('visitCount', nc);
        this.savePref();
        this.loadPref();
    }

    /**
     * 保存用户偏好设置
     */
    savePref() {
        var p = {
            visitCount: localStorage.getItem('visitCount') || 0,
            lastVisit: new Date().toISOString(),
            theme: localStorage.getItem('theme') || 'light',
            fav: JSON.parse(localStorage.getItem('favoriteSports') || '[]')
        };
        localStorage.setItem('userPref', JSON.stringify(p));
    }

    /**
     * 加载用户偏好设置
     */
    loadPref() {
        var s = localStorage.getItem('userPref');
        if (s) {
            var p = JSON.parse(s);
            console.log('visit:' + p.visitCount);
        }
    }

    /**
     * 动画效果
     * 为带有 data-animate 属性的元素添加进入视口时的动画
     */
    anim() {
        var els = document.querySelectorAll('[data-animate]');
        var obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('animated');
            });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
        // 页面加载完成后添加 loaded 类
        window.addEventListener('load', () => { document.body.classList.add('loaded'); });
    }

    /**
     * 表单验证
     * 为所有表单添加验证功能
     */
    formCheck() {
        var forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.checkForm(form)) e.preventDefault();
            });
            var inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(inp => {
                inp.addEventListener('blur', () => this.checkField(inp));
                inp.addEventListener('input', () => this.clearErr(inp));
            });
        });
    }

    /**
     * 检查整个表单
     * @param {HTMLFormElement} form - 表单元素
     * @returns {boolean} - 是否通过验证
     */
    checkForm(form) {
        var ok = true;
        var inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(inp => { if (!this.checkField(inp)) ok = false; });
        return ok;
    }

    /**
     * 检查单个表单项
     * @param {HTMLElement} f - 表单元素
     * @returns {boolean} - 是否通过验证
     */
    checkField(f) {
        var v = f.value.trim();
        var t = f.type;
        var ok = true;
        var msg = '';

        // 必填检查
        if (f.hasAttribute('required') && !v) {
            ok = false;
            msg = '必填';
        }

        // 邮箱格式检查
        if (t === 'email' && v) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(v)) { ok = false; msg = '邮箱格式不对'; }
        }

        // 手机号格式检查
        if (t === 'tel' && v) {
            var re2 = /^1[3-9]\d{9}$/;
            if (!re2.test(v)) { ok = false; msg = '手机格式不对'; }
        }

        this.showErr(f, ok, msg);
        return ok;
    }

    /**
     * 显示错误信息
     * @param {HTMLElement} f - 表单元素
     * @param {boolean} ok - 是否通过
     * @param {string} msg - 错误消息
     */
    showErr(f, ok, msg) {
        var g = f.closest('.form-group');
        if (!g) return;
        g.classList.remove('error', 'success');

        if (!ok) {
            g.classList.add('error');
            var e = g.querySelector('.error-message');
            if (!e) {
                e = document.createElement('span');
                e.className = 'error-message';
                g.appendChild(e);
            }
            e.textContent = msg;
        } else if (f.value.trim()) {
            g.classList.add('success');
        }
    }

    /**
     * 清除错误信息
     * @param {HTMLElement} f - 表单元素
     */
    clearErr(f) {
        var g = f.closest('.form-group');
        if (g) {
            g.classList.remove('error');
            var e = g.querySelector('.error-message');
            if (e) e.remove();
        }
    }

    /**
     * 节流函数
     * 限制函数在指定时间内最多执行一次
     * @param {Function} fn - 要执行的函数
     * @param {number} t - 时间间隔（毫秒）
     * @returns {Function} - 包装后的函数
     */
    throttle(fn, t) {
        var flag;
        return function() {
            var args = arguments;
            var ctx = this;
            if (!flag) {
                fn.apply(ctx, args);
                flag = true;
                setTimeout(() => flag = false, t);
            }
        };
    }

    /**
     * 防抖函数
     * 函数在指定时间后才执行，频繁调用只会执行一次
     * @param {Function} fn - 要执行的函数
     * @param {number} d - 延迟时间（毫秒）
     * @returns {Function} - 包装后的函数
     */
    debounce(fn, d) {
        var tid;
        return function() {
            var args = arguments;
            var ctx = this;
            clearTimeout(tid);
            tid = setTimeout(() => fn.apply(ctx, args), d);
        };
    }
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => { new GamesWebsite(); });

// 支持 CommonJS 模块导出
if (typeof module !== 'undefined' && module.exports) { module.exports = GamesWebsite; }
