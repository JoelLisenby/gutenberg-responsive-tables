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
                if (headers[index]) {
                    // Accessibility improvement: add visually hidden label + data-label
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'screen-reader-text';
                    labelSpan.textContent = headers[index] + ': ';
                    cell.insertBefore(labelSpan, cell.firstChild);

                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
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