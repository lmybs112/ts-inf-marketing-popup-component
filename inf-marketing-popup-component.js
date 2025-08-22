// inf-marketing-popup-component.js
// Web Component 封裝 ProductX_popup.js 中的三種彈窗方式

class InfMarketingPopupComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.brand = this.getAttribute('brand') || 'VER';
        this.brandConfig = null; // 品牌配置
        this.popupType = null; // 將由外部設置
    }

    // 初始化組件
    init() {
        console.log('初始化彈窗組件，類型:', this.popupType);
        
        this.render();
        this.setupStyles();
        this.setupEventListeners();
        
        // 根據類型執行對應的彈窗邏輯
        switch(this.popupType) {
            case 'discount':
                console.log('初始化折扣彈窗');
                this.initDiscountPopup();
                break;
            case 'minibar':
                console.log('初始化迷你欄彈窗');
                this.initMinibarPopup();
                break;
            case 'minibar_anim':
                console.log('初始化動畫迷你欄彈窗');
                this.initMinibarAnimPopup();
                break;
            default:
                console.log('未知彈窗類型:', this.popupType);
        }
    }

    // 渲染組件結構
    render() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div id="inf-marketing-popup-container" class="infScenario">
                <!-- 彈窗內容將根據類型動態生成 -->
            </div>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // 設置樣式
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 載入 Noto Sans TC 字型 */
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;600;700&display=swap');
            
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            /* 完全按照 ProductX_popup.js 的原始樣式 */
            .infScenario .inf_popup_close.small{
                position:absolute;top:-16px;z-index:10000009;right:0;padding:5px;height:12.5px;width:12.5px;border-radius:50%;box-shadow:rgb(54 62 81 / 15%) 0 .0625rem .125rem .0625rem;background:rgba(0,0,0,.3);opacity:1
            }
            .infScenario .inf_popup_close.medium{
                position:absolute;top:-16px;z-index:10000009;right:0;padding:5px;height:20px;width:20px;border-radius:50%;box-shadow:rgb(54 62 81 / 15%) 0 .0625rem .125rem .0625rem;background:rgba(0,0,0,.3);opacity:1
            }
            
            .infScenario #infFITS_sizefast_wrapper{
                padding: 6px;font-family: "Noto Sans TC",sans-serif;text-align: left;box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;letter-spacing: 0.05rem;
            }
            .infScenario .wrapper-flex{
                display: flex;justify-content: space-between;flex-direction: row-reverse;align-items: center;
            }
            .infScenario .logo-img-container{
                position: relative;width: 45px;height: 45px;border-radius: 50%;
            }
            .infScenario .logo-img{
                margin: auto;top: 0;right: 0;left: 0; bottom: 0;position: absolute;height: 42px;width: 42px;border-radius: 50%;background-repeat: no-repeat;background-size: cover;box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
            }
            .infScenario .inf_sf-container{
                display: flex;justify-content: center;font-weight: initial;font-size: 12px;width: 80%;color: gray;justify-content: space-between;align-items: center;
            }
            .infScenario .inf_sf-maintext{
                color: #333;font-size: 12px;white-space: nowrap;text-align: center;font-weight:300;overflow:inherit;text-align: left;line-height: 14px
            }
            .infScenario .inf_sf-main{
                position: relative;display: flex;width: 85%;padding: 6px;border-radius: 10px;align-items: center;display:none;
            }
            .infScenario .inf_sf-main.black{
                background:black !important;
                pointer-events:none !important;
                display:block !important;
            }
            .infScenario #loader-section{
                position: relative;display: flex;width: 85%;padding: 6px;border-radius: 10px;align-items: center;display:none;
            }
            .infScenario .inf_sf-section{
                width: 50%;border-radius: 5px;height: 36px;position:relative
            }
            .infScenario .inf_sf-section-block{
                justify-content: center;width: 100%;height: 100%;border-radius: 5px;text-align: center;display: none;display: flex;align-items: center;color:darkgray
            }
            
            .infScenario .inf_sf-section-block.active{
                background: white;
                color:black;
                max-width:75px !important;
            }
            .infScenario .inf_sf-section-block .front_size{
                font-size: 18px;
                font-weight: 600;
            }
            .infScenario .inf_sf-section-block .front_per{
                font-size: 12px;font-weight: 300
            }
            
            .infScenario #loader{
                position: absolute;
                width: 100%;
                height: 100%;
                text-align: center;
                transform : scale(0.5);
                z-index:10000;
            }
            .infScenario #loader img{
                position: absolute;
                right: 0;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto;
            }
            
            .infScenario .cssload-speeding-wheel {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
            }
            .infScenario .cssload-speeding-wheel {
                width: 31px;
                height: 31px;
                border: 2px solid rgba(97,100,193,0.98);
                border-radius: 50%;
                border-left-color: transparent;
                border-right-color: transparent;
                animation: cssload-spin 625ms infinite linear;
                -o-animation: cssload-spin 625ms infinite linear;
                -ms-animation: cssload-spin 625ms infinite linear;
                -webkit-animation: cssload-spin 625ms infinite linear;
            }
            @keyframes cssload-spin {
                100%{ transform: rotate(360deg); transform: rotate(360deg); }
            }
            
            @-o-keyframes cssload-spin {
                100%{ -o-transform: rotate(360deg); transform: rotate(360deg); }
            }
            
            @-ms-keyframes cssload-spin {
                100%{ -ms-transform: rotate(360deg); transform: rotate(360deg); }
            }
            
            @-webkit-keyframes cssload-spin {
                100%{ -webkit-transform: rotate(360deg); transform: rotate(360deg); }
            }
            
            @-moz-keyframes cssload-spin {
                100%{ -moz-transform: rotate(360deg); transform: rotate(360deg); }
            }
            .infScenario .inf_sf-container {
                -ms-overflow-style: none;  /* Internet Explorer 10+ */
                scrollbar-width: none;  /* Firefox */
            }
            .infScenario .inf_sf-container::-webkit-scrollbar { 
                display: none;  /* Safari and Chrome */
            }
            /* 計時器的容器樣式 */
            .countdown-timer {
                width: 20px;
                height: 20px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                display:none;
            }
            
            /* 圓形進度條 */
            .progress-circle {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: conic-gradient(
                #4CAF50 0%,       /* 開始顏色 */
                #4CAF50 100%      /* 結束顏色 */
                );
                animation: countdown 5s linear forwards;
            }
            
            /* 倒數文字 */
            .countdown-text {
                position: absolute;
                font-size: 10px;
                font-weight: bold;
                color: #FFFFFF;
                display:none;
            }
            
            /* 動畫效果 */
            @keyframes countdown {
                0% { background: conic-gradient(#4CAF50 0%, #4CAF50 100%); }
                100% { background: conic-gradient(#4CAF50 0%, transparent 100%); }
            }
            
            /* 根據位置設定的動畫效果 */
            @keyframes slideFadeIn {
                0% {
                    opacity: 0;
                    transform: translateY(100%);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* RightDown 位置：從右側滑入 */
            @keyframes slideFadeInX {
                0% {
                    opacity: 0;
                    transform: translateX(100%);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            /* LeftDown 位置：從左側滑入 */
            @keyframes slideFadeInmX {
                0% {
                    opacity: 0;
                    transform: translateX(-100%);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            /* CenterDown 位置：從下方滑入 */
            @keyframes slideFadeInCenter {
                0% {
                    opacity: 0;
                    transform: translateY(100%);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .infScenario.desktop-right-top{
                top: var(--desktop-top);
                right: var(--desktop-right);
            }
            .infScenario.desktop-right-bottom{
                bottom: var(--desktop-bottom);
                right: var(--desktop-right);
            }
            .infScenario.desktop-left-bottom{
                bottom: var(--desktop-bottom);
                left: var(--desktop-left);
            }
            
            .infScenario.mobile-abs-center{
                left: 0 !important;
                right: 0 !important;
                margin: auto !important;
                bottom: var(--mobile-bottom) !important;
            }
            
            /* 基本樣式 */
            .infScenario {
                z-index: 1000000000000000;
            }
            
            .mini_price_wrapper {display: flex;gap: 8px;margin: 2px}
            .mini_price_sale { display:flex; gap:8px;color: #EB7454;margin: 0;font-weight: bold;animation: scaleUp3 2.5s ease-in-out forwards;}
            .mini_price { margin: 0;animation: fadeOut3 2.5s ease-in-out forwards;}
            
            /* 動畫效果 */
            @keyframes scaleUp1 {
                0% {
                    opacity: 0;
                    transform: translateX(-5px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeOut1 {
                0% {
                    opacity: 1;
                    color: black;
                }
                100% {
                    opacity: 0.5;
                    color: darkgray;
                    transform: scale(0.9);
                    text-decoration-line: line-through;
                }
            }
            
            @keyframes scaleUp2 {
                0% {
                    opacity: 0;
                    transform: translateX(-130px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeOut2 {
                0% {
                    opacity: 1;
                    color: black;
                    transform: translateX(-130px);
                }
                100% {
                    opacity: 0.5;
                    color: darkgray;
                    transform: scale(0.9) translateX(0);
                    text-decoration-line: line-through;
                }
            }
            
            @keyframes scaleUp3 {
                0% {
                    opacity: 0;
                    transform: translateX(-130px);
                }
                50% {
                    opacity: 0;
                    transform: translateX(-130px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeOut3 {
                0% {
                    opacity: 1;
                    color: black;
                    transform: translateX(-130px);
                }
                50% {
                    opacity: 1;
                    color: black;
                    transform: translateX(-130px);
                }
                100% {
                    opacity: 0.5;
                    color: darkgray;
                    transform: scale(0.9) translateX(0);
                    text-decoration-line: line-through;
                }
            }

            /* 折扣碼容器樣式 */
            .discount-code-container {
                display: flex;
                align-items: center;
                margin-top: 8px;
                background: #f5f5f5;
                border-radius: 4px;
                padding: 4px;
                border: 1px dashed #ccc;
            }
            
            .discount-code {
                flex-grow: 1;
                padding: 4px 8px;
                font-family: monospace;
                font-weight: bold;
                color: #333;
                letter-spacing: 1px;
            }
            
            .copy-btn {
                background: #EB7454;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 12px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            
            .copy-btn:hover {
                background: #d86545;
            }
            
            .copy-btn.copied {
                background: #4CAF50;
            }
            
            .dont-show-today {
                display: flex;
                align-items: center;
                font-size: 12px;
                color: #666;
                cursor: pointer;
                position: absolute;
                top: -16px;
                left: 0;
                z-index: 10000009;
            }
            
            .dont-show-today input[type="checkbox"] {
                margin-right: 4px;
                cursor: pointer;
                accent-color: #000;
            }
            
            .dont-show-today label {
                cursor: pointer;
                user-select: none;
            }
        `;
        this.shadowRoot.appendChild(style);
    }

    // 設置事件監聽器
    setupEventListeners() {
        // 關閉按鈕事件
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.closest('.inf_popup_close')) {
                this.hide();
                this.dispatchEvent(new CustomEvent('popup-close', {
                    detail: { type: this.popupType }
                }));
            }
        });

        // 複製折扣碼事件
        this.shadowRoot.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.copyDiscountCode(e);
            }
        });

        // 今日不再顯示勾選框事件
        this.shadowRoot.addEventListener('change', (e) => {
            if (e.target.id === 'dont-show-today-checkbox') {
                this.handleDontShowToday(e);
            }
        });
    }

    // 複製折扣碼功能
    copyDiscountCode(event) {
        event.preventDefault();
        event.stopPropagation();

        const codeElement = this.shadowRoot.querySelector('.discount-code');
        const code = codeElement.textContent;
        const ctaText = this.getAttribute('cta-text') || '複製折扣碼';

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code)
                .then(() => {
                    const copyBtn = this.shadowRoot.querySelector('.copy-btn');
                    copyBtn.textContent = '已複製';
                    copyBtn.classList.add('copied');

                    setTimeout(() => {
                        copyBtn.textContent = ctaText;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                })
                .catch(err => {
                    console.error('複製失敗: ', err);
                    this.useFallbackCopy(code);
                });
        } else {
            this.useFallbackCopy(code);
        }
    }

    // 備用複製方法
    useFallbackCopy(code) {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                const copyBtn = this.shadowRoot.querySelector('.copy-btn');
                const ctaText = this.getAttribute('cta-text') || '複製折扣碼';
                copyBtn.textContent = '已複製';
                copyBtn.classList.add('copied');

                setTimeout(() => {
                    copyBtn.textContent = ctaText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        } catch (err) {
            console.error('備用複製失敗: ', err);
        }

        document.body.removeChild(textarea);
    }

    // 處理今日不再顯示
    handleDontShowToday(event) {
        const isChecked = event.target.checked;
        
        if (isChecked) {
            // 獲取今天的日期作為 key
            const today = new Date().toISOString().split('T')[0];
            const key = `dont_show_popup_${today}`;
            
            // 儲存到 localStorage
            localStorage.setItem(key, 'true');
            
            console.log(`已設定今日(${today})不再顯示彈窗`);
            
            // 觸發自定義事件
            this.dispatchEvent(new CustomEvent('popup-dont-show-today', {
                detail: { 
                    type: this.popupType,
                    date: today,
                    checked: true
                }
            }));
        } else {
            // 取消勾選時，移除 localStorage 記錄
            const today = new Date().toISOString().split('T')[0];
            const key = `dont_show_popup_${today}`;
            
            localStorage.removeItem(key);
            
            console.log(`已取消今日(${today})不再顯示設定`);
            
            // 觸發自定義事件
            this.dispatchEvent(new CustomEvent('popup-dont-show-today', {
                detail: { 
                    type: this.popupType,
                    date: today,
                    checked: false
                }
            }));
        }
    }

    // 檢查今日是否已設定不再顯示
    shouldShowToday() {
        const today = new Date().toISOString().split('T')[0];
        const key = `dont_show_popup_${today}`;
        
        return !localStorage.getItem(key);
    }

    // 根據位置設置對應的動畫
    getAnimationByLocation() {
        const animations = {
            'LeftDown': 'slideFadeInmX 0.5s ease forwards',
            'CenterDown': 'slideFadeInCenter 0.5s ease forwards',
            'RightDown': 'slideFadeInX 0.5s ease forwards'
        };
        
        // 從組件的 data-location 屬性獲取位置，如果沒有則從配置中獲取
        let location = this.getAttribute('data-location') || 'RightDown';
        
        // 如果沒有 data-location 屬性，則從配置中獲取
        if (!this.getAttribute('data-location') && this.brandConfig) {
            const configMap = {
                'discount': 'Popup_Coupon_Widget',
                'minibar': 'Popup_SocialProof_Info_Widget', 
                'minibar_anim': 'Popup_SocialProof_Recommend_Widget'
            };
            
            const moduleName = configMap[this.popupType];
            if (moduleName) {
                const config = this.brandConfig.find(c => c.Module === moduleName);
                if (config?.ConfigData?.Section_Info?.[0]?.Location) {
                    location = config.ConfigData.Section_Info[0].Location;
                }
            }
        }
        
        return animations[location] || animations['RightDown'];
    }

    // 初始化折扣彈窗
    initDiscountPopup() {
        const container = this.shadowRoot.getElementById('inf-marketing-popup-container');
        container.className = 'infScenario desktop-left-bottom';
        
        // 設置基本樣式，根據位置設置對應動畫
        const animation = this.getAnimationByLocation();
        const baseStyles = `font-weight: 600;font-family: Noto Sans TC,sans-serif;cursor: pointer;display: none;padding: 10px 0;letter-spacing: .1rem;opacity: 0;-webkit-animation: ${animation}; animation: ${animation};width: 360px;`;
        container.style.cssText = baseStyles;

        const discountCode = this.getAttribute('discount-code') || "bra200";
        const discountDescription = this.getAttribute('discount-description') || "運動內衣一件折<span style='font-weight:bold;color:#EB7454'>$200</span>(優惠可累計,買越多省越多)";
        const ctaBackground = this.getAttribute('cta-background') || '#EB7454FF';
        const ctaColor = this.getAttribute('cta-color') || '#FFFFFFFF';
        const ctaText = this.getAttribute('cta-text') || '複製折扣碼';

        // 檢查是否要顯示「今日不再顯示」勾選框
        const shouldShowTodayDisplay = this.getAttribute('today-display-mode') === 'true';
        
        container.innerHTML = `
            ${shouldShowTodayDisplay ? `
            <div class="dont-show-today">
                <input type="checkbox" id="dont-show-today-checkbox">
                <label for="dont-show-today-checkbox">今日不再顯示</label>
            </div>
            ` : ''}
            <div class="inf_popup_close medium" onclick="event.preventDefault();event.stopPropagation();this.parentNode.style.display='none';">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQflBB0KLijuiy0TAAABU0lEQVRo3sWZQZKCMBBFX825gtt4ZPEgbrQKV1wA9nHhFFUOxEmgO19XQtV/Tw2Q7gYI9ExM9HS0eHULLwAEbqTf953ojo/cF96NAP3yMZF4cnbFn3l+8HqYPw74KvzFJ+a1gJ/CGp+Y4bo66KOwhU9c4cSjgcI2/sEpf9JS4V+Cr0JRup9CcbKPQlWqvUJ1oq3CrjQ7hd1JNgqHUo4rHE44FmDyG+4PMVtFuaDvW5ZoeR3VK5ji6xXM8XUKLvhyBTd8mYIr/hsgFpx1VRiIRAZ/fF5hZGyDzys0w5cqOOJLFJzxb4Uhix8aFLdA3Fx4iXEP/qeFsfX3l/4F4kUovgzFNyLxrVj8MBI/jsUbEvGWTLwpFW/LxYWJuDQTF6fi8lzcoBC3aMRNKnGbTtyoFLdqxc1qcbtePLCQj2zkQyv52E4+uJSPbjv18BoCF8n4/kKAFws8B+VnA9YUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA0LTI5VDEwOjQ2OjAzKzAwOjAw6rtp5wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNC0yOVQxMDo0NjowMyswMDowMJvm0VsAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC" style="position:absolute;top:0;bottom:0;right:0;left:0;width:8px;margin:auto;filter: invert(1);">
            </div>
            <div id="infFITS_discount_wrapper" style="background:rgba(255,255,255,1);border-radius:10px;padding: 12px;box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;">
                <div class="wrapper-flex">
                    <div class="inf_sf-container" style="justify-content: space-between; display: block; margin-left:8px;width:100%">
                        <div class="inf_sf-maintext" style="font-weight: 700;margin-bottom: 4px;overflow: hidden;text-overflow: ellipsis">女裝限時優惠</div>
                        <div class="inf_sf-maintext">${discountDescription}</div>
                        <div class="discount-code-container">
                            <div class="discount-code">${discountCode}</div>
                            <button class="copy-btn" style="background: ${ctaBackground}; color: ${ctaColor};">${ctaText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 位置由 CSS 控制，不需要額外設置
        
        // 檢查是否為移動設備
        if (this.isMobileDevice()) {
            container.classList.add('mobile-abs-center');
            container.classList.remove('desktop-left-bottom');
        }
        
        // 應用堆疊樣式
        const stackIndex = this.getAttribute('data-stack-index');
        if (stackIndex && stackIndex > 0) {
            container.setAttribute('data-stack-index', stackIndex);
        }

        // 立即顯示
        this.show();
    }

    // 初始化迷你欄彈窗
    initMinibarPopup() {
        // 先獲取商品資料，成功後再初始化彈窗
        this.loadMinibarProductData().then((productData) => {
            // API 回傳成功後才初始化彈窗
            this.initMinibarPopupContent(productData);
        }).catch((error) => {
            console.error('載入商品資料失敗，不顯示彈窗:', error);
        });
    }

    // 初始化迷你欄彈窗內容（API 成功後調用）
    initMinibarPopupContent(productData) {
        const container = this.shadowRoot.getElementById('inf-marketing-popup-container');
        container.className = 'infScenario desktop-left-bottom';
        
        // 設置基本樣式，根據位置設置對應動畫
        const animation = this.getAnimationByLocation();
        const baseStyles = `font-weight: 600;font-family: Noto Sans TC,sans-serif;cursor: pointer;display: none;padding: 10px 0;letter-spacing: .1rem;opacity: 0;-webkit-animation: ${animation}; animation: ${animation};width: 360px;`;
        container.style.cssText = baseStyles;

        container.innerHTML = `
            <div class="inf_popup_close medium" onclick="event.preventDefault();event.stopPropagation();this.parentNode.style.display='none';">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQflBB0KLijuiy0TAAABU0lEQVRo3sWZQZKCMBBFX825gtt4ZPEgbrQKV1wA9nHhFFUOxEmgO19XQtV/Tw2Q7gYI9ExM9HS0eHULLwAEbqTf953ojo/cF96NAP3yMZF4cnbFn3l+8HqYPw74KvzFJ+a1gJ/CGp+Y4bo66KOwhU9c4cSjgcI2/sEpf9JS4V+Cr0JRup9CcbKPQlWqvUJ1oq3CrjQ7hd1JNgqHUo4rHE44FmDyG+4PMVtFuaDvW5ZoeR3VK5ji6xXM8XUKLvhyBTd8mYIr/hsgFpx1VRiIRAZ/fF5hZGyDzys0w5cqOOJLFJzxb4Uhix8aFLdA3Fx4iXEP/qeFsfX3l/4F4kUovgzFNyLxrVj8MBI/jsUbEvGWTLwpFW/LxYWJuDQTF6fi8lzcoBC3aMRNKnGbTtyoFLdqxc1qcbtePLCQj2zkQyv52E4+uJSPbjv18BoCF8n4/kKAFws8B+VnA9YUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA0LTI5VDEwOjQ2OjAzKzAwOjAw6rtp5wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNC0yOVQxMDo0NjowMyswMDowMJvm0VsAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC" style="position:absolute;top:0;bottom:0;right:0;left:0;width:8px;margin:auto;filter: invert(1);">
            </div>
            <div id="infFITS_sizefast_wrapper" style="background:rgba(255,255,255,1);border-radius:10px;padding: 8px">
                <div class="wrapper-flex">
                    <div class="countdown-timer">
                        <div class="progress-circle"></div>
                        <div class="countdown-text" id="countdown-text">5</div>
                    </div>
                    <div class="inf_sf-container" style="justify-content: space-between; display: block; margin-left:8px">
                        <div class="inf_sf-maintext" style="font-weight: 700;margin-bottom: 4px;overflow: hidden;text-overflow: ellipsis"></div>
                        <div class="inf_sf-maintext"></div>
                        <div id="loader-section" style="display: none;">
                            <div id="loader" style="display: none;">
                                <img src="" height="15px">
                                <div class="cssload-speeding-wheel"></div>
                            </div>
                        </div>
                        <div class='mini_price_wrapper' data-banner="3">
                            <p class="mini_price_sale" data-banner="3"></p>
                            <p class="mini_price" data-banner="3"></p>
                        </div>
                    </div>
                    <div class="logo-img-container">
                        <div class="logo-img"></div>
                    </div>
                </div>
            </div>
        `;

        // 位置由 CSS 控制，不需要額外設置
        
        // 檢查是否為移動設備
        if (this.isMobileDevice()) {
            container.classList.add('mobile-abs-center');
            container.classList.remove('desktop-left-bottom');
        }
        
        // 應用堆疊樣式
        const stackIndex = this.getAttribute('data-stack-index');
        if (stackIndex && stackIndex > 0) {
            container.setAttribute('data-stack-index', stackIndex);
        }

        // 更新顯示內容並顯示彈窗
        this.updateMinibarDisplay(productData);
        this.show();
    }

    // 初始化迷你欄動畫彈窗
    initMinibarAnimPopup() {
        // 先獲取商品資料，成功後再初始化彈窗
        this.loadMinibarAnimProductData().then((productData) => {
            // API 回傳成功後才初始化彈窗
            this.initMinibarAnimPopupContent(productData);
        }).catch((error) => {
            console.error('載入商品資料失敗，不顯示彈窗:', error);
        });
    }

    // 初始化迷你欄動畫彈窗內容（API 成功後調用）
    initMinibarAnimPopupContent(productData) {
        const container = this.shadowRoot.getElementById('inf-marketing-popup-container');
        container.className = 'infScenario desktop-left-bottom';
        
        // 設置基本樣式，根據位置設置對應動畫
        const animation = this.getAnimationByLocation();
        const baseStyles = `font-weight: 600;font-family: Noto Sans TC,sans-serif;cursor: pointer;display: none;padding: 10px 0;letter-spacing: .1rem;opacity: 0;-webkit-animation: ${animation}; animation: ${animation};width: 360px;`;
        container.style.cssText = baseStyles;

        container.innerHTML = `
            <div class="inf_popup_close medium" onclick="event.preventDefault();event.stopPropagation();this.parentNode.style.display='none';">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQflBB0KLijuiy0TAAABU0lEQVRo3sWZQZKCMBBFX825gtt4ZPEgbrQKV1wA9nHhFFUOxEmgO19XQtV/Tw2Q7gYI9ExM9HS0eHULLwAEbqTf953ojo/cF96NAP3yMZF4cnbFn3l+8HqYPw74KvzFJ+a1gJ/CGp+Y4bo66KOwhU9c4cSjgcI2/sEpf9JS4V+Cr0JRup9CcbKPQlWqvUJ1oq3CrjQ7hd1JNgqHUo4rHE44FmDyG+4PMVtFuaDvW5ZoeR3VK5ji6xXM8XUKLvhyBTd8mYIr/hsgFpx1VRiIRAZ/fF5hZGyDzys0w5cqOOJLFJzxb4Uhix8aFLdA3Fx4iXEP/qeFsfX3l/4F4kUovgzFNyLxrVj8MBI/jsUbEvGWTLwpFW/LxYWJuDQTF6fi8lzcoBC3aMRNKnGbTtyoFLdqxc1qcbtePLCQj2zkQyv52E4+uJSPbjv18BoCF8n4/kKAFws8B+VnA9YUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA0LTI5VDEwOjQ2OjAzKzAwOjAw6rtp5wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNC0yOVQxMDo0NjowMyswMDowMJvm0VsAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC" style="position:absolute;top:0;bottom:0;right:0;left:0;width:8px;margin:auto;filter: invert(1);">
            </div>
            <div id="infFITS_sizefast_wrapper" style="background:rgba(255,255,255,1);border-radius:10px;padding: 12px">
                <div class="wrapper-flex">
                    <div class="countdown-timer">
                        <div class="progress-circle"></div>
                        <div class="countdown-text" id="countdown-text">5</div>
                    </div>
                    <div class="inf_sf-container" style="justify-content: space-between; display: block; margin-left:8px">
                        <div class="inf_sf-maintext" style="font-weight: 700;margin-bottom: 4px;overflow: hidden;text-overflow: ellipsis"></div>
                        <div class="inf_sf-maintext"></div>
                        <div id="loader-section" style="display: none;">
                            <div id="loader" style="display: none;">
                                <img src="https://myinffits.com/images/inffits_f_black.png" height="15px">
                                <div class="cssload-speeding-wheel"></div>
                            </div>
                        </div>
                        <div class='mini_price_wrapper' data-banner="3">
                            <p class="mini_price_sale" data-banner="3"></p>
                            <p class="mini_price" data-banner="3"></p>
                        </div>
                    </div>
                    <div class="logo-img-container">
                        <div class="logo-img" style="border-radius:5px"></div>
                    </div>
                </div>
            </div>
        `;

        // 位置由 CSS 控制，不需要額外設置
        
        // 檢查是否為移動設備
        if (this.isMobileDevice()) {
            container.classList.add('mobile-abs-center');
            container.classList.remove('desktop-left-bottom');
        }
        
        // 應用堆疊樣式
        const stackIndex = this.getAttribute('data-stack-index');
        if (stackIndex && stackIndex > 0) {
            container.setAttribute('data-stack-index', stackIndex);
        }

        // 更新顯示內容並顯示彈窗
        this.updateMinibarAnimDisplay(productData);
        this.show();
    }

    // 更新全局位置變數
    updateGlobalPosition(desktop_topValue, desktop_bottomValue, desktop_rightValue, desktop_leftValue, mobile_bottomValue) {
        document.documentElement.style.setProperty('--desktop-top', desktop_topValue);
        document.documentElement.style.setProperty('--desktop-bottom', desktop_bottomValue);
        document.documentElement.style.setProperty('--desktop-right', desktop_rightValue);
        document.documentElement.style.setProperty('--desktop-left', desktop_leftValue);
        document.documentElement.style.setProperty('--mobile-bottom', mobile_bottomValue);
    }

    // 檢查是否為移動設備
    isMobileDevice() {
        return window.innerWidth <= 768;
    }

    // 商品資訊初始化函數 (完全按照 ProductX_popup.js)
    idsInit() {
        var product_id;
        var Brand = this.brand || 'VER';
        var EC = 'SHOPLINE'; // 可以從配置中獲取
        
        if (EC == 'SHOPLINE') {
            var data = document.documentElement.innerHTML;
            // var item_id = data.split('"sku":"')[1].split('"')[0].split(':')[0];
            // product_id = item_id;
            product_id = '66388b9ab83a79001aeea2d1';
        }
        else if (EC == '91APP') {
            // var data = document.documentElement.innerHTML;
            // var item_id = data.split('"sku":"')[1].split('"')[0];
            // product_id = item_id;
        }
        else if (EC == 'PME') {
            var metaTag = document.querySelector('meta[property="og:sku"]');
            if (metaTag) {
                var skuContent = metaTag.getAttribute('content').split('-')[0];
                console.log(skuContent); // 輸出 "FRP99153"
            }
            else if (document.querySelector('.prodnoBox') !== null) {
                var skuContent = document.querySelector('.prodnoBox').innerText.split(':')[1].split('-')[0]
            }
            else {
                console.log('Meta tag not found');
            }
            product_id = skuContent
        }

        var makeid = function (length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        
        //given id & member id --begin
        var member_id = "";
        var lgiven_id = "";
        // 檢查 dataLayer 是否定義
        if (typeof dataLayer !== 'undefined') {
            for (let i = 0; i < dataLayer.length; i++) {
                if (dataLayer[i].Action === "Product-Detail") {
                    // 找到了符合條件的項目，執行後續動作
                    console.log('找到了符合 "gtm.load" 的事件，執行後續動作');
                    console.log('FOUND!!')
                    if (dataLayer[i].Uid !== '') member_id = dataLayer[i].Uid
                    else member_id = ''

                    // 進行其他操作（如果需要的話）
                    break;
                }
                else member_id = ''
            }
        }
        console.log(member_id)

        // Always Generate a pair of LGVID
        var lgvid_exist = false;
        try {
            if (typeof localStorage["LGVID"] !== 'undefined') {
                lgvid_exist = true;
            }
            else {
                lgvid_exist = false;
            }
        }
        catch (e) {
            lgvid_exist = false;
        }
        if (lgvid_exist) {
            lgiven_id = localStorage["LGVID"];
        }
        else {
            lgiven_id = makeid(20);
            localStorage.setItem("LGVID", lgiven_id);
        }
        return { "member_id": member_id, "lgiven_id": lgiven_id, "product_id": product_id }
    }

    // 載入迷你欄商品資料
    async loadMinibarProductData() {
        const ids = this.idsInit();
        const requestData = {
            Brand: this.brand,
            LGVID: ids.lgiven_id,
            MRID: ids.member_id,
            PID: ids.product_id,
            recom_num: "12",
            SP_PID: "xx",
            SELFSP_PID: ids.product_id
        };
        console.log('迷你欄商品資料請求:', requestData);

        try {
            const options = {
                method: 'POST',
                headers: { accept: 'application/json', 'content-type': 'application/json' },
                body: JSON.stringify(requestData)
            };

            const response = await fetch('https://eclm50mys1.execute-api.ap-northeast-1.amazonaws.com/v0/extension/recom_product', options);
            const data = await response.json();
            console.log('迷你欄商品資料回應:', data);

            // 處理 selfsp_trans 數據
            if (data['selfsp_trans'] && data['selfsp_trans'].length > 0) {
                const productData = data['selfsp_trans'].map((item) => {
                    let newItem = Object.assign({}, item['recom_dat']);
                    newItem.sale_price = item['recom_dat'].sale_price
                        ? parseInt(item['recom_dat'].sale_price.replace(/\D/g, "")).toLocaleString()
                        : "";
                    newItem.price = parseInt(
                        item['recom_dat'].price.replace(/\D/g, "")
                    ).toLocaleString();
                    newItem.record_cnt = item.record_cnt
                    return newItem;
                });

                // 更新彈窗顯示
                this.updateMinibarDisplay(productData[0]);
                return productData[0]; // 回傳商品資料
            } else {
                throw new Error('沒有可用的商品資料');
            }
        } catch (error) {
            console.error('載入迷你欄商品資料失敗:', error);
            throw error; // 重新拋出錯誤
        }
    }

    // 載入動畫迷你欄商品資料
    async loadMinibarAnimProductData() {
        const ids = this.idsInit();
        const requestData = {
            Brand: this.brand,
            LGVID: ids.lgiven_id,
            MRID: ids.member_id,
            PID: ids.product_id,
            recom_num: "12",
            SP_PID: "xx"
        };
        console.log('動畫迷你欄商品資料請求:', requestData);

        try {
            const options = {
                method: 'POST',
                headers: { accept: 'application/json', 'content-type': 'application/json' },
                body: JSON.stringify(requestData)
            };

            const response = await fetch('https://eclm50mys1.execute-api.ap-northeast-1.amazonaws.com/v0/extension/recom_product', options);
            const data = await response.json();
            console.log('動畫迷你欄商品資料回應:', data);

            // 處理 sp_trans 數據
            let jsonData_trans = data['sp_trans'].map((item) => {
                let newItem = Object.assign({}, item);
                newItem.sale_price = item.sale_price
                    ? parseInt(item.sale_price.replace(/\D/g, "")).toLocaleString()
                    : "";
                newItem.price = parseInt(
                    item.price.replace(/\D/g, "")
                ).toLocaleString();
                return newItem;
            });

            if (jsonData_trans.length > 0) {
                // 隨機選擇一個商品
                const randomIndex = Math.floor(Math.random() * jsonData_trans.length);
                const selectedProduct = jsonData_trans[randomIndex];
                
                // 如果是測試模式，為動畫迷你欄加上 sale_price
                if (this.getAttribute('data-test-mode') === 'true') {
                    selectedProduct.sale_price = '100';
                }
                
                // 更新彈窗顯示
                this.updateMinibarAnimDisplay(selectedProduct);
                return selectedProduct; // 回傳商品資料
            } else {
                throw new Error('沒有可用的商品資料');
            }
        } catch (error) {
            console.error('載入動畫迷你欄商品資料失敗:', error);
            throw error; // 重新拋出錯誤
        }
    }

    // 更新迷你欄顯示 (完全對應 ProductX_popup.js 的 updateBanner 功能)
    updateMinibarDisplay(productData) {
        const titleElement = this.shadowRoot.querySelector('.inf_sf-maintext');
        const logoElement = this.shadowRoot.querySelector('.logo-img');
        const salePriceElement = this.shadowRoot.querySelector('.mini_price_sale');
        const priceElement = this.shadowRoot.querySelector('.mini_price');
        const container = this.shadowRoot.querySelector('.inf_sf-container');

        // 設置標題
        if (titleElement && productData.title) {
            titleElement.textContent = productData.title;
        }

        // 設置圖片
        if (logoElement && productData.image_link) {
            logoElement.style.backgroundImage = `url("${productData.image_link}")`;
        }

        // 設置商品點擊連結
        if (productData.link) {
            this.setLink(productData.link);
        }

        // 更新描述文字（對應 updateBanner 中的 record_cnt 處理）
        const secondMainText = this.shadowRoot.querySelectorAll('.inf_sf-maintext')[1];
        if (secondMainText && productData.record_cnt) {
            // 獲取配置的描述文字和顏色
            const description = this.getAttribute('minibar-description') || '近期超過 %NUM% 位顧客購買這款商品';
            const ctaColor = this.getAttribute('minibar-cta-color') || '#EB7454';
            
            // 替換 %NUM% 為實際的 record_cnt 並設定顏色
            const displayText = description.replace('%NUM%', `<span style="color:${ctaColor};font-weight:600">${productData.record_cnt}</span>`);
            secondMainText.innerHTML = displayText;
        }

        // 處理庫存顏色提示（對應 updateBanner 中的 stock_top_color 處理）
        if (container && productData.stock_top_color) {
            // 移除舊的庫存顏色提示
            const existingStockColor = container.querySelector('.stock_color');
            if (existingStockColor) {
                existingStockColor.remove();
            }

            // 添加新的庫存顏色提示
            if (productData.stock_top_color === 'unicolor') {
                container.insertAdjacentHTML('beforeend', '<div class="inf_sf-maintext stock_color" style="margin-top:4px">推薦您參考！</div>');
            } else {
                container.insertAdjacentHTML('beforeend', `<div class="inf_sf-maintext stock_color" style="margin-top:4px;display:none">推薦您參考 <span style="color:rgb(235, 116, 84);font-weight:600">${productData.stock_top_color}</span> 色</div>`);
            }
        }

        // 隱藏價格顯示（迷你欄不顯示價格）
        const priceWrapper = this.shadowRoot.querySelector('.mini_price_wrapper');
        if (priceWrapper) {
            priceWrapper.style.display = 'none';
        }
    }

    // 更新動畫迷你欄顯示 (完全對應 ProductX_popup.js 的 updateBanner 功能)
    updateMinibarAnimDisplay(productData) {
        const titleElement = this.shadowRoot.querySelector('.inf_sf-maintext');
        const logoElement = this.shadowRoot.querySelector('.logo-img');
        const salePriceElement = this.shadowRoot.querySelector('.mini_price_sale');
        const priceElement = this.shadowRoot.querySelector('.mini_price');

        // 設置標題
        if (titleElement && productData.title) {
            titleElement.textContent = productData.title;
        }

        // 設置圖片
        if (logoElement && productData.image_link) {
            logoElement.style.backgroundImage = `url("${productData.image_link}")`;
        }

        // 設置商品點擊連結
        if (productData.link) {
            this.setLink(productData.link);
        }

        // 獲取配置的顏色
        const ctaColor = this.getAttribute('minibar-anim-cta-color') || '#EB7454';
        
        // 更新價格顯示（對應 updateBanner 中的價格處理）
        if (productData.sale_price && productData.sale_price !== "") {
            if (salePriceElement) {
                salePriceElement.textContent = `NT$ ${productData.sale_price}`;
                // 設置 sale_price 的顏色為配置的 CTA_color
                salePriceElement.style.color = ctaColor;
            }
            
            // 延遲更新價格動畫（對應 updateBanner 中的 setTimeout）
            setTimeout(() => {
                this.updatePriceAnimation(productData.sale_price, productData.price, '3', ctaColor);
            }, 3000);
        } else {
            if (salePriceElement) {
                salePriceElement.style.display = 'none';
            }
            if (priceElement) {
                Object.assign(priceElement.style, {
                    color: ctaColor, // 使用配置的顏色
                    transform: 'scale(1)',
                    textDecoration: 'none',
                    animation: 'none',
                    fontWeight: 'bold'
                });
            }
        }

        if (priceElement && productData.price) {
            priceElement.textContent = `NT$ ${productData.price}`;
        }

        // 更新描述文字（對應 updateBanner 中的隨機數字處理）
        const secondMainText = this.shadowRoot.querySelectorAll('.inf_sf-maintext')[1];
        if (secondMainText) {
            // 獲取配置的描述文字和顏色
            const description = this.getAttribute('minibar-anim-description') || '熱銷優惠！有 %NUM% 人加入購物車';
            const ctaColor = this.getAttribute('minibar-anim-cta-color') || '#EB7454';
            
            // 生成隨機數字（對應 updateBanner 中的 getRandomThreeDigit）
            const randomNum = Math.floor(Math.random() * 900) + 100;
            
            // 替換 %NUM% 為實際的隨機數字並設定顏色
            const displayText = description.replace('%NUM%', `<span style="color:${ctaColor};font-weight:600">${randomNum}</span>`);
            secondMainText.innerHTML = displayText;
        }
    }

    // 更新價格動畫 (完全對應 ProductX_popup.js 的 updatePrice 函數)
    updatePriceAnimation(salePrice, originalPrice, order, ctaColor = '#EB7454') {
        const wrapper = this.shadowRoot.querySelector('.mini_price_wrapper[data-banner="' + order + '"]');
        if (!wrapper) return;

        const discountPercent = parseInt(100 - parseInt(salePrice.replace(',', '')) * 100 / parseInt(originalPrice.replace(',', '')));
        
        wrapper.innerHTML = `
            <span class="mini_price_sale" data-banner="${order}" style="color: ${ctaColor};">${discountPercent}% off<span style='color:black'>NT$ ${salePrice}</span></span>
            <span class="mini_price" data-banner="${order}">NT$ ${originalPrice}</span>
        `;

        // 觸發動畫重新播放
        const saleElement = this.shadowRoot.querySelector('.mini_price_sale[data-banner="' + order + '"]');
        const originalElement = this.shadowRoot.querySelector('.mini_price[data-banner="' + order + '"]');

        if (saleElement && originalElement) {
            saleElement.style.animation = 'none';
            originalElement.style.animation = 'none';

            // 重新啟用動畫
            requestAnimationFrame(() => {
                saleElement.style.animation = '';
                originalElement.style.animation = '';
            });
        }
    }

    // 顯示彈窗
    show() {
        // 檢查今日是否已設定不再顯示
        if (!this.shouldShowToday()) {
            console.log('今日已設定不再顯示彈窗，跳過顯示');
            return;
        }
        
        const container = this.shadowRoot.getElementById('inf-marketing-popup-container');
        container.style.display = 'block';
        this.dispatchEvent(new CustomEvent('popup-show', {
            detail: { type: this.popupType }
        }));
    }

    // 隱藏彈窗
    hide() {
        const container = this.shadowRoot.getElementById('inf-marketing-popup-container');
        container.style.display = 'none';
    }

    // 設置產品數據
    setProductData(data) {
        if (!data) return;

        const titleElement = this.shadowRoot.querySelector('.inf_sf-maintext');
        const logoElement = this.shadowRoot.querySelector('.logo-img');
        const salePriceElement = this.shadowRoot.querySelector('.mini_price_sale');
        const priceElement = this.shadowRoot.querySelector('.mini_price');

        if (titleElement && data.title) {
            titleElement.textContent = data.title;
        }

        if (logoElement && data.image_link) {
            logoElement.style.backgroundImage = `url("${data.image_link}")`;
        }

        if (salePriceElement && data.sale_price) {
            salePriceElement.textContent = `NT$ ${data.sale_price}`;
        }

        if (priceElement && data.price) {
            priceElement.textContent = `NT$ ${data.price}`;
        }
    }

    // 設置連結
    setLink(url) {
        const container = this.shadowRoot.getElementById('inf-marketing-popup-container');
        if (url) {
            container.style.cursor = 'pointer';
            container.onclick = () => {
                window.open(url, '_blank');
            };
        }
    }

    // 獲取品牌配置
    async getBrandConfig() {
        try {
            const response = await fetch('https://api.inffits.com/mkt_brand_config_proc/GetItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ Brand: this.brand })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const config = await response.json();
            console.log('品牌配置:', config);
            return config;
        } catch (error) {
            console.error('獲取品牌配置失敗:', error);
            return null;
        }
    }

    // 根據品牌配置更新彈窗設置
    async updateByBrandConfig() {
        // 如果已經有品牌配置，直接使用
        if (this.brandConfig) {
            this.applyBrandConfig(this.brandConfig);
            return;
        }

        // 否則調用 API 獲取配置
        const config = await this.getBrandConfig();
        if (!config) {
            console.log('無法獲取品牌配置，使用預設設置');
            return;
        }

        this.applyBrandConfig(config);
    }

    // 應用品牌配置
    applyBrandConfig(configArray) {
        // 找到對應的模組配置
        let moduleConfig = null;
        
        switch (this.popupType) {
            case 'discount':
                const discountModule = configArray.find(config => config.Module === 'Popup_Coupon_Widget');
                moduleConfig = discountModule?.ConfigData?.Section_Info?.[0];
                break;
            case 'minibar':
                const minibarModule = configArray.find(config => config.Module === 'Popup_SocialProof_Info_Widget');
                moduleConfig = minibarModule?.ConfigData?.Section_Info?.[0];
                break;
            case 'minibar_anim':
                const minibarAnimModule = configArray.find(config => config.Module === 'Popup_SocialProof_Recommend_Widget');
                moduleConfig = minibarAnimModule?.ConfigData?.Section_Info?.[0];
                break;
        }
        
        if (!moduleConfig) {
            console.log(`未找到 ${this.popupType} 的有效配置`);
            return;
        }
        
        // 根據彈窗類型更新內容
        switch (this.popupType) {
            case 'discount':
                if (moduleConfig.Code) {
                    this.setAttribute('discount-code', moduleConfig.Code);
                }
                if (moduleConfig.Description) {
                    this.setAttribute('discount-description', moduleConfig.Description);
                }
                break;
            case 'minibar':
                // 更新迷你欄彈窗的標題和描述
                const titleElement = this.shadowRoot.querySelector('.inf_sf-maintext');
                if (titleElement && moduleConfig.Title) {
                    titleElement.textContent = moduleConfig.Title;
                }
                break;
            case 'minibar_anim':
                // 更新動畫迷你欄彈窗的標題和描述
                const titleElements = this.shadowRoot.querySelectorAll('.inf_sf-maintext');
                if (titleElements[0] && moduleConfig.Title) {
                    titleElements[0].textContent = moduleConfig.Title;
                }
                if (titleElements[1] && moduleConfig.Description) {
                    titleElements[1].textContent = moduleConfig.Description;
                }
                break;
        }
    }
}

// 註冊 Web Component
customElements.define('inf-marketing-popup-component', InfMarketingPopupComponent);

// 導出組件類別供外部使用
window.InfMarketingPopupComponent = InfMarketingPopupComponent;

// 便捷的腳本創建方法
window.createInfMarketingPopup = function(options = {}) {
    const {
        brand = 'VER',                // 品牌名稱
        type = 'discount',           // 彈窗類型：discount, minibar, minibar_anim
        discountCode = 'bra200',     // 折扣碼
        discountDescription = "運動內衣一件折<span style='font-weight:bold;color:#EB7454'>$200</span>(優惠可累計,買越多省越多)", // 折扣描述
        ctaBackground = '#EB7454FF', // CTA 按鈕背景色
        ctaColor = '#FFFFFFFF',      // CTA 按鈕文字色
        ctaText = '複製折扣碼',      // CTA 按鈕文字
        todayDisplayMode = false,    // 是否顯示「今日不再顯示」勾選框
        minibarDescription = '近期超過 %NUM% 位顧客購買這款商品', // minibar 描述文字
        minibarCtaColor = '#EB7454', // minibar 數字顏色
        minibarAnimDescription = '熱銷優惠！有 %NUM% 人加入購物車', // minibar_anim 描述文字
        minibarAnimCtaColor = '#EB7454', // minibar_anim 數字顏色
        productData = null,          // 產品數據對象
        link = null,                 // 點擊連結
        autoShow = true,             // 是否自動顯示
        delay = null,                // 延遲顯示時間（毫秒）
        position = null,             // 自定義位置
        onShow = null,               // 顯示回調
        onClose = null,              // 關閉回調
        onCopy = null,               // 複製回調
        brandConfig = null           // 品牌配置（避免重複 API 調用）
    } = options;

    // 創建組件元素
    const popupElement = document.createElement('inf-marketing-popup-component');
    
    // 先設置所有屬性，再添加到 DOM
    popupElement.setAttribute('type', type);
    popupElement.setAttribute('brand', brand);
    
    // 如果有測試模式，設置測試標記
    if (options.test === true) {
        popupElement.setAttribute('data-test-mode', 'true');
    }
    
    // 如果有品牌配置，直接設置給組件
    if (brandConfig) {
        popupElement.brandConfig = brandConfig;
    }
    
    // 根據類型設置對應的屬性
    if (type === 'discount') {
        popupElement.setAttribute('discount-code', discountCode);
        popupElement.setAttribute('discount-description', discountDescription);
        popupElement.setAttribute('cta-background', ctaBackground);
        popupElement.setAttribute('cta-color', ctaColor);
        popupElement.setAttribute('cta-text', ctaText);
        popupElement.setAttribute('today-display-mode', todayDisplayMode.toString());
    } else if (type === 'minibar') {
        // 設置 minibar 彈窗的配置屬性
        popupElement.setAttribute('minibar-description', minibarDescription);
        popupElement.setAttribute('minibar-cta-color', minibarCtaColor);
        console.log('設置 minibar 類型彈窗');
    } else if (type === 'minibar_anim') {
        // 設置 minibar_anim 彈窗的配置屬性
        popupElement.setAttribute('minibar-anim-description', minibarAnimDescription);
        popupElement.setAttribute('minibar-anim-cta-color', minibarAnimCtaColor);
        console.log('設置 minibar_anim 類型彈窗');
    }
    
    // 手動觸發初始化，確保類型已設置
    popupElement.popupType = type;
    popupElement.init();
    
    // 獲取對應類型的 config 來取得 Location
    let location = 'RightDown'; // 預設位置
    if (brandConfig) {
        const configMap = {
            'discount': 'Popup_Coupon_Widget',
            'minibar': 'Popup_SocialProof_Info_Widget', 
            'minibar_anim': 'Popup_SocialProof_Recommend_Widget'
        };
        
        const moduleName = configMap[type];
        if (moduleName) {
            const config = brandConfig.find(c => c.Module === moduleName);
            if (config?.ConfigData?.Section_Info?.[0]?.Location) {
                location = config.ConfigData.Section_Info[0].Location;
            }
        }
    }

    // 檢查螢幕寬度，決定是否使用獨立位置堆疊邏輯
    const isLargeScreen = window.innerWidth >= 1200;
    
    // 手機版統一使用 CenterDown 位置
    if (window.innerWidth < 768) {
        location = 'CenterDown';
    }
    
    // 設置堆疊索引和強制位置
    let stackIndex = 0;
    
    if (isLargeScreen) {
        // 大螢幕：每個位置獨立堆疊
        const existingPopups = document.querySelectorAll('inf-marketing-popup-component');
        const locationCounts = {
            'LeftDown': 0,
            'CenterDown': 0,
            'RightDown': 0
        };
        
        // 計算每個位置已有的彈窗數量
        existingPopups.forEach(popup => {
            const popupLocation = popup.getAttribute('data-location') || 'RightDown';
            if (locationCounts.hasOwnProperty(popupLocation)) {
                locationCounts[popupLocation]++;
            }
        });
        
        // 使用當前位置的堆疊索引
        stackIndex = locationCounts[location] || 0;
        popupElement.setAttribute('data-location', location);
    } else {
        // 小螢幕：統一堆疊
        const existingPopups = document.querySelectorAll('inf-marketing-popup-component');
        stackIndex = existingPopups.length;
    }
    
    popupElement.setAttribute('data-stack-index', stackIndex);
    
    // 根據 config Location 和堆疊索引設置位置
    const getPositionByLocation = (location, stackIndex) => {
        const basePositions = {
            'LeftDown': [
                { top: 'calc(100vh - 140px)', left: '20px', right: 'auto' },
                { top: 'calc(100vh - 250px)', left: '20px', right: 'auto' },
                { top: 'calc(100vh - 360px)', left: '20px', right: 'auto' },
                { top: 'calc(100vh - 470px)', left: '20px', right: 'auto' },
                { top: 'calc(100vh - 580px)', left: '20px', right: 'auto' }
            ],
            'CenterDown': [
                { top: 'calc(100vh - 140px)', left: '50%', right: 'auto' },
                { top: 'calc(100vh - 250px)', left: '50%', right: 'auto' },
                { top: 'calc(100vh - 360px)', left: '50%', right: 'auto' },
                { top: 'calc(100vh - 470px)', left: '50%', right: 'auto' },
                { top: 'calc(100vh - 580px)', left: '50%', right: 'auto' }
            ],
            'RightDown': [
                { top: 'calc(100vh - 140px)', right: '20px', left: 'auto' },
                { top: 'calc(100vh - 250px)', right: '20px', left: 'auto' },
                { top: 'calc(100vh - 360px)', right: '20px', left: 'auto' },
                { top: 'calc(100vh - 470px)', right: '20px', left: 'auto' },
                { top: 'calc(100vh - 580px)', right: '20px', left: 'auto' }
            ]
        };
        
        return basePositions[location] || basePositions['RightDown'];
    };
    

    
    const positions = getPositionByLocation(location, stackIndex);
    
    if (positions[stackIndex]) {
        popupElement.style.position = 'fixed';
        popupElement.style.top = positions[stackIndex].top;
        popupElement.style.right = positions[stackIndex].right || 'auto';
        popupElement.style.left = positions[stackIndex].left || 'auto';
        popupElement.style.bottom = 'auto';
        popupElement.style.zIndex = '1000000000000000';
        
        // 對於 CenterDown 位置，需要特殊處理 transform
        if (location === 'CenterDown') {
            // 先設置基本位置，動畫會處理 transform
            popupElement.style.transform = 'translateX(-50%)';
        } else if (positions[stackIndex].transform) {
            // 其他位置如果有 transform，也要設置
            popupElement.style.transform = positions[stackIndex].transform;
        }
    }
    


    // 添加到頁面
    document.body.appendChild(popupElement);

    // 等待組件初始化完成
    setTimeout(() => {
        // 設置產品數據
        if (productData) {
            popupElement.setProductData(productData);
        }

        // 設置連結
        if (link) {
            popupElement.setLink(link);
        }

        // 設置自定義位置
        if (position) {
            const container = popupElement.shadowRoot.getElementById('inf-marketing-popup-container');
            if (container) {
                Object.assign(container.style, position);
            }
        }

        // 綁定事件監聽器
        if (onShow) {
            popupElement.addEventListener('popup-show', onShow);
        }
        
        if (onClose) {
            popupElement.addEventListener('popup-close', onClose);
        }

        // 自定義複製事件（僅適用於 discount 類型）
        if (onCopy && type === 'discount') {
            popupElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('copy-btn')) {
                    onCopy(discountCode);
                }
            });
        }

        // 自動顯示邏輯
        if (autoShow) {
            if (delay !== null) {
                setTimeout(() => {
                    popupElement.show();
                }, delay);
            } else {
                // 根據類型設置預設延遲
                let defaultDelay = 0;
                switch (type) {
                    case 'minibar':
                        // minibar 類型等待 API 回傳後再顯示，不在這裡自動顯示
                        defaultDelay = null;
                        break;
                    case 'minibar_anim':
                        // minibar_anim 類型等待 API 回傳後再顯示，不在這裡自動顯示
                        defaultDelay = null;
                        break;
                    default:
                        defaultDelay = 0;     // 立即顯示
                }
                
                // 只有當 defaultDelay 不為 null 時才自動顯示
                if (defaultDelay !== null) {
                    if (defaultDelay > 0) {
                        setTimeout(() => {
                            popupElement.show();
                        }, defaultDelay);
                    } else {
                        popupElement.show();
                    }
                }
                // 如果 defaultDelay 為 null，則不自動顯示（等待 API 回傳）
            }
        }
    }, 100);

    // 返回組件實例和便捷方法
    return {
        element: popupElement,
        show: () => popupElement.show(),
        hide: () => popupElement.hide(),
        setProductData: (data) => popupElement.setProductData(data),
        setLink: (url) => popupElement.setLink(url),
        destroy: () => {
            if (popupElement.parentNode) {
                popupElement.parentNode.removeChild(popupElement);
            }
        }
    };
};

// 根據品牌配置創建彈窗的方法
window.createInfMarketingPopupByBrand = function(brand, options = {}) {
    return new Promise((resolve, reject) => {
        // 檢查是否使用測試模式
        if (options.test === true) {
            // 開發階段使用假資料測試
            const configArray = [
                {
                    "Brand": "ALMI",
                    "ConfigData": {
                        "Section_Info": [
                            {
                                "Description": "可以使用優惠券一次",
                                "CTA_background": "#EB7454FF",
                                "Title": "女裝限時優惠",
                                "CTA_text": "複製折扣碼",
                                "Code": "bra200",
                                "CTA_color": "#FFFFFFFF",
                                "TodayDisplayMode": false,
                                "DisplayList": [
                                    "inffits_landing_page_cond",
                                    "inffits_category_page_cond",
                                    "inffits_product_page_cond"
                                ],
                                "TimeValid": "2025-08-22~2025-10-23",
                                "Location": "RightDown",
                                "status": true
                            }
                        ]
                    },
                    "Dashboard_Imgsrc_link": "https://icon-sets.iconify.design/ic/page-5.html",
                    "Dashboard_Title": "彈跳優惠券版位",
                    "Module": "Popup_Coupon_Widget",
                    "Dashboard_Imgsrc": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2m-11-4l2.03 2.71L16 11l4 5H8zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6z\"/></svg>"
                },
                {
                    "Brand": "ALMI",
                    "ConfigData": {
                        "Section_Info": [
                            {
                                "CTA_color": "#000000",
                                "Description": "近期超過%NUM%位顧客購買這款商品",
                                "DisplayList": [
                                    "inffits_landing_page_cond",
                                    "inffits_category_page_cond",
                                    "inffits_product_page_cond"
                                ],
                                "TimeValid": "2025-08-11~2025-10-12",
                                "Title": "商品名稱",
                                "Location": "RightDown",
                                "status": true
                            }
                        ]
                    },
                    "Dashboard_Imgsrc_link": "https://icon-sets.iconify.design/ic/page-5.html",
                    "Dashboard_Title": "彈跳促購資訊版位",
                    "Module": "Popup_SocialProof_Info_Widget",
                    "Dashboard_Imgsrc": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zm-5.04-6.71l-2.75 3.54l-1.96-2.36L6.5 17h11z\"/></svg>"
                },
                {
                    "Brand": "ALMI",
                    "ConfigData": {
                        "Section_Info": [
                            {
                                "CTA_color": "#CA0000FF",
                                "sale_price_display": true,
                                "Description": "熱銷優惠!!！有%NUM%人加入購物車!!!",
                                "DisplayList": [
                                    "inffits_landing_page_cond",
                                    "inffits_category_page_cond",
                                    "inffits_product_page_cond"
                                ],
                                "TimeValid": "2025-08-11~2025-10-18",
                                "Title": "商品名稱",
                                "Location": "RightDown",
                                "status": true
                            }
                        ]
                    },
                    "Dashboard_Imgsrc_link": "https://icon-sets.iconify.design/ic/page-5.html",
                    "Dashboard_Title": "彈跳商品推薦導購",
                    "Module": "Popup_SocialProof_Recommend_Widget",
                    "Dashboard_Imgsrc": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 2C6.48 2 2 6.48 2 12c0 1.33.26 2.61.74 3.77L8 10.5l3.3 2.78L14.58 10H13V8h5v5h-2v-1.58L11.41 16l-3.29-2.79l-4.4 4.4A10 10 0 0 0 12 22h8c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10m7.5 18.5c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1\"/></svg>"
                }
            ];
            
            console.log('使用開發測試資料:', configArray);
            processConfigArray(configArray);
        } else {
            // 調用 API 獲取品牌配置
            fetch('https://api.inffits.com/mkt_brand_config_proc/GetItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ Brand: brand })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(configArray => {
                console.log('品牌配置:', configArray);
                processConfigArray(configArray);
            })
            .catch(error => {
                console.error('獲取品牌配置失敗:', error);
                // 如果 API 調用失敗，不顯示任何彈窗
                console.log('API 調用失敗，不顯示任何彈窗');
                resolve([]);
            });
        }
        
        // 處理配置陣列的函數
        function processConfigArray(configArray) {
            // 解析新的 API 格式
            const popups = [];
            let discountConfig = null;
            let minibarConfig = null;
            let minibarAnimConfig = null;
            
            // 檢查日期是否在有效範圍內的函數
            function isDateInRange(timeValidStr) {
                if (!timeValidStr || timeValidStr.trim() === '') {
                    return true; // 如果沒有時間限制，則永遠有效
                }
                
                // 修正日期獲取邏輯，使用本地時間而非 UTC 時間
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const today = `${year}-${month}-${day}`;
                
                const [startDateStr, endDateStr] = timeValidStr.split('~');
                
                if (!startDateStr || !endDateStr) {
                    return true; // 如果格式不正確，預設為有效
                }
                
                const isValid = today >= startDateStr && today <= endDateStr;
                console.log(`日期檢查: 今天(${today}) >= 起始日(${startDateStr}) && 今天(${today}) <= 結束日(${endDateStr}) = ${isValid}`);
                
                return isValid;
            }
            
            // 遍歷配置陣列，根據 Module 類型分配配置
            configArray.forEach(config => {
                if (config.Module === 'Popup_Coupon_Widget' && config.ConfigData?.Section_Info?.[0]) {
                    const sectionInfo = config.ConfigData.Section_Info[0];
                    if (sectionInfo.status && isDateInRange(sectionInfo.TimeValid)) {
                        discountConfig = sectionInfo;
                        console.log('✓ 折扣彈窗配置有效');
                    } else {
                        console.log('✗ 折扣彈窗配置無效 - status:', sectionInfo.status, 'TimeValid:', sectionInfo.TimeValid, '日期檢查結果:', isDateInRange(sectionInfo.TimeValid));
                    }
                } else if (config.Module === 'Popup_SocialProof_Info_Widget' && config.ConfigData?.Section_Info?.[0]) {
                    const sectionInfo = config.ConfigData.Section_Info[0];
                    if (sectionInfo.status && isDateInRange(sectionInfo.TimeValid)) {
                        minibarConfig = sectionInfo;
                        console.log('✓ 迷你欄彈窗配置有效');
                    } else {
                        console.log('✗ 迷你欄彈窗配置無效 - status:', sectionInfo.status, 'TimeValid:', sectionInfo.TimeValid, '日期檢查結果:', isDateInRange(sectionInfo.TimeValid));
                    }
                } else if (config.Module === 'Popup_SocialProof_Recommend_Widget' && config.ConfigData?.Section_Info?.[0]) {
                    const sectionInfo = config.ConfigData.Section_Info[0];
                    if (sectionInfo.status && isDateInRange(sectionInfo.TimeValid)) {
                        minibarAnimConfig = sectionInfo;
                        console.log('✓ 動畫迷你欄彈窗配置有效');
                    } else {
                        console.log('✗ 動畫迷你欄彈窗配置無效 - status:', sectionInfo.status, 'TimeValid:', sectionInfo.TimeValid, '日期檢查結果:', isDateInRange(sectionInfo.TimeValid));
                    }
                }
            });
            
            console.log('最終配置結果:', {
                discountConfig: !!discountConfig,
                minibarConfig: !!minibarConfig,
                minibarAnimConfig: !!minibarAnimConfig
            });
            
            // 創建折扣彈窗 (Popup_Coupon_Widget)
            if (discountConfig) {
                const discountPopup = window.createInfMarketingPopup({
                    brand: brand,
                    type: 'discount',
                    discountCode: discountConfig.Code || 'bra200',
                    discountDescription: discountConfig.Description || "運動內衣一件折<span style='font-weight:bold;color:#EB7454'>$200</span>(優惠可累計,買越多省越多)",
                    ctaBackground: discountConfig.CTA_background || '#EB7454FF',
                    ctaColor: discountConfig.CTA_color || '#FFFFFFFF',
                    ctaText: discountConfig.CTA_text || '複製折扣碼',
                    todayDisplayMode: discountConfig.TodayDisplayMode || false, // 從配置中獲取 TodayDisplayMode
                    delay: 0, // 折扣彈窗立即顯示
                    brandConfig: configArray, // 傳遞完整配置給組件
                    ...options
                });
                popups.push(discountPopup);
                console.log('創建折扣彈窗 (Popup_Coupon_Widget)');
            }
            
            // 創建迷你欄彈窗 (Popup_SocialProof_Info_Widget)
            if (minibarConfig) {
                const minibarPopup = window.createInfMarketingPopup({
                    brand: brand,
                    type: 'minibar',
                    minibarDescription: minibarConfig.Description || '近期超過 %NUM% 位顧客購買這款商品', // 傳遞 Description 配置
                    minibarCtaColor: minibarConfig.CTA_color || '#EB7454', // 傳遞 CTA_color 配置
                    delay: 0, // 立即顯示
                    brandConfig: configArray, // 傳遞完整配置給組件
                    ...options
                });
                popups.push(minibarPopup);
                console.log('創建迷你欄彈窗 (Popup_SocialProof_Info_Widget)');
            }
            
            // 創建動畫迷你欄彈窗 (Popup_SocialProof_Recommend_Widget)
            if (minibarAnimConfig) {
                const minibarAnimPopup = window.createInfMarketingPopup({
                    brand: brand,
                    type: 'minibar_anim',
                    minibarAnimDescription: minibarAnimConfig.Description || '熱銷優惠！有 %NUM% 人加入購物車', // 傳遞 Description 配置
                    minibarAnimCtaColor: minibarAnimConfig.CTA_color || '#EB7454', // 傳遞 CTA_color 配置
                    delay: 0, // 立即顯示
                    brandConfig: configArray, // 傳遞完整配置給組件
                    ...options
                });
                popups.push(minibarAnimPopup);
                console.log('創建動畫迷你欄彈窗 (Popup_SocialProof_Recommend_Widget)');
            }
            
            // 如果沒有配置任何彈窗，不顯示任何彈窗
            if (popups.length === 0) {
                console.log('未找到有效的品牌配置，不顯示任何彈窗');
            }
            
            resolve(popups);
        }
    });
};

// 預設配置的便捷方法
window.createDiscountPopup = function(options = {}) {
    return window.createInfMarketingPopup({
        type: 'discount',
        ...options
    });
};

window.createMinibarPopup = function(options = {}) {
    return window.createInfMarketingPopup({
        type: 'minibar',
        ...options
    });
};

window.createMinibarAnimPopup = function(options = {}) {
    return window.createInfMarketingPopup({
        type: 'minibar_anim',
        ...options
    });
};
