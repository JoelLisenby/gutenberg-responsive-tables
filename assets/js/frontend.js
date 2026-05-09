/**
 * Table Cards Responsive - Frontend
 */
(function () {
    'use strict';

    const TABLE_SELECTOR = '.wp-block-table table';

    function getMobileBreakpoint(table) {
        // 1. Per-table breakpoint (highest priority)
        const tableBreakpoint = table.getAttribute('data-responsive-breakpoint');
        if (tableBreakpoint) {
            return parseInt(tableBreakpoint, 10);
        }

        // 2. Try to detect from theme CSS variables
        const root = document.documentElement;
        const styles = getComputedStyle(root);

        const candidates = [
            '--wp--breakpoint--mobile',
            '--mobile-breakpoint',
            '--breakpoint-mobile'
        ];

        for (const variable of candidates) {
            const value = styles.getPropertyValue(variable).trim();
            if (value) {
                const parsed = parseInt(value, 10);
                if (parsed > 0) return parsed;
            }
        }

        // 3. Final fallback
        return 782;
    }

    function initResponsiveCards() {
        const tables = document.querySelectorAll(TABLE_SELECTOR);

        tables.forEach(table => {
            // Only process tables that opted into card mode
            if (!table.hasAttribute('data-responsive-cards') && 
                !table.hasAttribute('data-responsive-breakpoint')) {
                return;
            }

            const thead = table.querySelector('thead');
            if (!thead) return;

            const headers = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
            if (!headers.length) return;

            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (headers[index]) {
                        cell.setAttribute('data-label', headers[index]);
                    }
                });
            });
        });
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initResponsiveCards);
        } else {
            initResponsiveCards();
        }
    }

    init();

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initResponsiveCards, 200);
    });
})();