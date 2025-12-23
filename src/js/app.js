document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 滚动动画监听 (Scroll Reveal) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                scrollObserver.unobserve(entry.target); // 动画一次后停止
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-anim').forEach(el => {
        scrollObserver.observe(el);
    });

    // --- 2. 通用轮播图逻辑 (Auto Slider) ---
    class AutoSlider {
        constructor(container, interval = 4000) {
            this.container = container;
            this.slides = container.querySelectorAll('.slide');
            this.dots = container.querySelectorAll('.dot');
            this.clickArea = container.querySelector('.slider-click-area');

            this.intervalDuration = interval;
            this.timer = null;
            this.currentIndex = 0;

            // 仅当有幻灯片时初始化
            if (this.slides.length > 0) {
                this.init();
            }
        }

        init() {
            // 绑定点击事件
            if (this.clickArea) {
                this.clickArea.addEventListener('click', () => {
                    this.nextSlide();
                    this.resetTimer(); // 用户手动操作后，重置计时器

                    // 震动反馈
                    if (navigator.vibrate) navigator.vibrate(10);
                });
            }

            // 启动自动轮播
            this.startTimer();
        }

        showSlide(index) {
            // 移除当前激活状态
            this.slides[this.currentIndex].classList.remove('active');
            if (this.dots[this.currentIndex]) {
                this.dots[this.currentIndex].classList.remove('active');
            }

            // 更新索引
            this.currentIndex = index;

            // 添加新的激活状态
            this.slides[this.currentIndex].classList.add('active');
            if (this.dots[this.currentIndex]) {
                this.dots[this.currentIndex].classList.add('active');
            }
        }

        nextSlide() {
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.showSlide(nextIndex);
        }

        startTimer() {
            this.timer = setInterval(() => {
                this.nextSlide();
            }, this.intervalDuration);
        }

        resetTimer() {
            clearInterval(this.timer);
            this.startTimer();
        }
    }

    // 初始化页面上所有的轮播图
    // 第一个参数是 DOM 元素，第二个参数是自动切换间隔(ms)
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach((slider, index) => {
        // 给不同的轮播图设置稍微错开的时间，增加视觉的丰富度
        // 第一个 4000ms，第二个 5000ms
        new AutoSlider(slider, 4000 + (index * 1000));
    });

    console.log('[PureEditor] Welcome page interactive ready.');
});