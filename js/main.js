// ---- Десктопная версия: тултип при наведении ----
(function() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
        const tooltip = document.createElement('div');
        tooltip.id = 'global-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            background: #1e293b;
            color: #f1f5f9;
            font-size: 0.75rem;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            white-space: pre-line;
            max-width: 650px;
            word-wrap: break-word;
            z-index: 99999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: inherit;
            line-height: 1.4;
        `;
        document.body.appendChild(tooltip);

        const terms = document.querySelectorAll('.tooltip-term');
        let timeout;

        function updateTooltipPosition(event) {
            let left = event.clientX + 15;
            let top = event.clientY - 30;
            requestAnimationFrame(() => {
                const rect = tooltip.getBoundingClientRect();
                if (rect.right > window.innerWidth) {
                    left = window.innerWidth - rect.width - 10;
                }
                if (rect.left < 0) {
                    left = 10;
                }
                if (rect.bottom > window.innerHeight) {
                    top = window.innerHeight - rect.height - 10;
                }
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
            });
        }

        function showTooltip(event, text) {
            tooltip.textContent = text;
            tooltip.style.opacity = '1';
            updateTooltipPosition(event);
        }

        function hideTooltip() {
            tooltip.style.opacity = '0';
        }

        terms.forEach(term => {
            const tooltipText = term.querySelector('.tooltip-text');
            if (!tooltipText) return;
            const text = tooltipText.textContent;

            term.addEventListener('mouseenter', (e) => {
                clearTimeout(timeout);
                showTooltip(e, text);
            });
            term.addEventListener('mousemove', (e) => {
                updateTooltipPosition(e);
            });
            term.addEventListener('mouseleave', () => {
                timeout = setTimeout(hideTooltip, 100);
            });
        });
    }
})();

// ---- Мобильная версия: модальное окно по клику ----
(function() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) return; // только для сенсорных устройств

    // Создаём модальное окно
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

    // Закрытие по клику на фон или кнопку
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) {
            modal.classList.remove('active');
        }
    });

    // Находим все термины с подсказками
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

// Анимация появления при скролле
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