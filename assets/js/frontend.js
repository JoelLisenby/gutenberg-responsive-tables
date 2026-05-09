/**
 * Table Cards Responsive - Frontend (Advanced Version)
 * Dynamically activates card mode based on per-table breakpoint.
 */
(function () {
    'use strict';

    const TABLE_SELECTOR = '.wp-block-table table';

    function getBreakpointForTable(table) {
        // Per-table custom breakpoint (from sidebar)
        const custom = table.getAttribute('data-responsive-breakpoint');
        if (custom) {
            return parseInt(custom, 10);
        }

        // Try to detect from theme CSS variables
        const rootStyles = getComputedStyle(document.documentElement);
        const candidates = [
            '--wp--breakpoint--mobile',
            '--mobile-breakpoint',
            '--breakpoint-mobile'
        ];

        for (const variable of candidates) {
            const value = rootStyles.getPropertyValue(variable).trim();
            if (value) {
                const parsed = parseInt(value, 10);
                if (parsed > 0) return parsed;
            }
        }

        // Final fallback
        return 782;
    }

    function setupTableCards(table) {
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
    }

    function updateTableState(table) {
        const breakpoint = getBreakpointForTable(table);
        const isBelowBreakpoint = window.innerWidth <= breakpoint;

        if (isBelowBreakpoint) {
            if (!table.classList.contains('is-cards-active')) {
                table.classList.add('is-cards-active');
                setupTableCards(table);
            }
        } else {
            table.classList.remove('is-cards-active');
        }
    }

    function initResponsiveCards() {
        const tables = document.querySelectorAll(TABLE_SELECTOR);

        tables.forEach(table => {
            // Only process tables that have opted into card mode
            if (!table.hasAttribute('data-responsive-cards') && 
                !table.hasAttribute('data-responsive-breakpoint')) {
                return;
            }

            updateTableState(table);
        });
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initResponsiveCards);
        } else {
            initResponsiveCards();
        }

        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const tables = document.querySelectorAll(
                    '.wp-block-table table.is-cards-active, ' +
                    '.wp-block-table table[data-responsive-cards], ' +
                    '.wp-block-table table[data-responsive-breakpoint]'
                );
                tables.forEach(updateTableState);
            }, 150);
        });
    }

    init();
})();