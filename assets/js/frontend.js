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
                    cell.dataset.originalContent = cell.innerHTML;

                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'card-label';

                    const strong = document.createElement('strong');
                    strong.textContent = headers[index];
                    labelDiv.appendChild(strong);

                    cell.insertBefore(labelDiv, cell.firstChild);

                    cell.dataset.labelProcessed = 'true';
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
    }

    function restoreTable(table) {
        table.querySelectorAll('.card-label').forEach(label => label.remove());

        table.querySelectorAll('tbody tr td').forEach(cell => {
            if (cell.dataset.originalContent) {
                cell.innerHTML = cell.dataset.originalContent;
                delete cell.dataset.originalContent;
            }
            delete cell.dataset.labelProcessed;
            cell.removeAttribute('data-label');
        });

        table.classList.remove('is-cards-active');
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
                if (table.classList.contains('is-cards-active')) {
                    restoreTable(table);
                }
            }
        } else if (mode === 'scroll') {
            const wrapper = table.closest('.table-responsive-scroll');

            if (shouldActivate) {
                if (wrapper) {
                    wrapper.classList.add('is-scroll-active');
                }
                handleHorizontalScroll(table);
            } else {
                if (wrapper) {
                    wrapper.classList.remove('is-scroll-active');
                }
                // Reset inline styles so normal table behavior returns above breakpoint
                table.style.removeProperty('width');
                table.style.removeProperty('min-width');
                table.style.removeProperty('table-layout');
            }
        }
    }

    function init() {
        const tables = document.querySelectorAll(TABLE_SELECTOR);

        tables.forEach(table => {
            if (!table.hasAttribute('data-responsive-mode')) {
                return;
            }

            const mode = table.getAttribute('data-responsive-mode') || 'scroll';
            const breakpoint = getBreakpoint(table);
            const shouldActivate = window.innerWidth <= breakpoint;

            // Initial cleanup for cards (kept for compatibility)
            if (mode === 'cards' && !shouldActivate && table.classList.contains('is-cards-active')) {
                restoreTable(table);
            }

            // Initial cleanup for scroll (above breakpoint)
            if (mode === 'scroll' && !shouldActivate) {
                const wrapper = table.closest('.table-responsive-scroll');
                if (wrapper && wrapper.classList.contains('is-scroll-active')) {
                    wrapper.classList.remove('is-scroll-active');
                }
                table.style.removeProperty('width');
                table.style.removeProperty('min-width');
                table.style.removeProperty('table-layout');
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