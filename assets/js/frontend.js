(function () {
    'use strict';

    const TABLE_SELECTOR = '.wp-block-table table';

    function getBreakpoint(table) {
        const custom = table.getAttribute('data-responsive-breakpoint');
        if (custom) return parseInt(custom, 10);

        const styles = getComputedStyle(document.documentElement);
        const vars = ['--wp--breakpoint--mobile', '--mobile-breakpoint', '--breakpoint-mobile'];

        for (const v of vars) {
            const val = styles.getPropertyValue(v).trim();
            if (val) {
                const num = parseInt(val, 10);
                if (num > 0) return num;
            }
        }
        return 782;
    }

    function setupCards(table) {
        const thead = table.querySelector('thead');
        if (!thead) return;

        const headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
        if (!headers.length) return;

        table.querySelectorAll('tbody tr').forEach(row => {
            row.querySelectorAll('td').forEach((cell, index) => {
                if (cell.dataset.labelProcessed === 'true') return;

                if (headers[index]) {
                    const originalContent = Array.from(cell.childNodes);
                    cell.innerHTML = '';

                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'card-label';

                    const strong = document.createElement('strong');
                    strong.textContent = headers[index];
                    labelDiv.appendChild(strong);

                    const valueDiv = document.createElement('div');
                    valueDiv.className = 'card-value';

                    originalContent.forEach(node => {
                        valueDiv.appendChild(node);
                    });

                    cell.appendChild(labelDiv);
                    cell.appendChild(valueDiv);

                    cell.dataset.labelProcessed = 'true';
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
    }

    function handleHorizontalScroll(table) {
        table.style.setProperty('width', 'auto', 'important');
        table.style.setProperty('min-width', 'max-content', 'important');
        table.style.setProperty('table-layout', 'auto', 'important');
    }

    function updateTable(table) {
        const mode = table.getAttribute('data-responsive-mode') || 'scroll';
        const breakpoint = getBreakpoint(table);
        const shouldActivate = window.innerWidth <= breakpoint;

        if (mode === 'cards') {
            if (shouldActivate) {
                if (!table.classList.contains('is-cards-active')) {
                    table.classList.add('is-cards-active');
                    setupCards(table);
                }
            } else {
                table.classList.remove('is-cards-active');
            }
        } 
        else if (mode === 'scroll' && shouldActivate) {
            handleHorizontalScroll(table);
        }
    }

    function init() {
        const tables = document.querySelectorAll(TABLE_SELECTOR);

        tables.forEach(table => {
            if (!table.hasAttribute('data-responsive-cards') && 
                !table.hasAttribute('data-responsive-breakpoint')) {
                return;
            }
            updateTable(table);
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                document.querySelectorAll(TABLE_SELECTOR).forEach(updateTable);
            }, 150);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();