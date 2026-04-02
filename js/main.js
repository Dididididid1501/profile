// ---- Десктопная версия: статический тултип (не следует за мышью) ----
(function() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
        const tooltip = document.createElement('div');
        tooltip.id = 'global-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: #1e293b;
            color: #f1f5f9;
            font-size: 0.8rem;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            white-space: pre-line;
            max-width: 650px;
            word-wrap: break-word;
            z-index: 99999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: inherit;
            line-height: 1.4;
        `;
        document.body.appendChild(tooltip);

        const terms = document.querySelectorAll('.tooltip-term');
        let hideTimeout = null;
        let activeTerm = null;

        function positionTooltip(term) {
            const rect = term.getBoundingClientRect();
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Показываем снизу от термина
            let top = rect.bottom + scrollTop + 5;
            let left = rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2);
            // Коррекция по горизонтали, чтобы не выходил за экран
            if (left + tooltip.offsetWidth > window.innerWidth + scrollLeft) {
                left = window.innerWidth + scrollLeft - tooltip.offsetWidth - 10;
            }
            if (left < scrollLeft) {
                left = scrollLeft + 10;
            }
            // Если снизу не влезает, показываем сверху
            if (top + tooltip.offsetHeight > window.innerHeight + scrollTop) {
                top = rect.top + scrollTop - tooltip.offsetHeight - 5;
            }
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }

        function showTooltip(term, text) {
            if (hideTimeout) clearTimeout(hideTimeout);
            if (activeTerm === term && tooltip.style.opacity === '1') {
                return;
            }
            tooltip.textContent = text;
            tooltip.style.opacity = '0';
            positionTooltip(term);
            // Небольшая задержка, чтобы позиция применилась
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
            });
            activeTerm = term;
        }

        function hideTooltip() {
            if (hideTimeout) clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                activeTerm = null;
            }, 100);
        }

        terms.forEach(term => {
            const tooltipSpan = term.querySelector('.tooltip-text');
            if (!tooltipSpan) return;
            const text = tooltipSpan.textContent;

            term.addEventListener('mouseenter', () => {
                showTooltip(term, text);
            });
            term.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        });
    }
})();

// ---- Мобильная версия: модальное окно по клику ----
(function() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return;

    let modal = document.querySelector('.modal-tooltip');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-tooltip';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-text"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    const modalText = modal.querySelector('.modal-text');
    const closeBtn = modal.querySelector('.modal-close');
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) {
            modal.classList.remove('active');
        }
    });
    const terms = document.querySelectorAll('.tooltip-term');
    terms.forEach(term => {
        const tooltipSpan = term.querySelector('.tooltip-text');
        if (!tooltipSpan) return;
        const text = tooltipSpan.textContent;
        term.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            modalText.innerHTML = text.replace(/\n/g, '<br>');
            modal.classList.add('active');
        });
    });
})();

// ---- Анимация появления при скролле ----
const fadeElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
fadeElements.forEach(el => observer.observe(el));

window.addEventListener('load', () => {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
});