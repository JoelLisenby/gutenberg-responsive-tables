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
                    // Save original HTML for restoration
                    cell.dataset.originalContent = cell.innerHTML;

                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'card-label';

                    const strong = document.createElement('strong');
                    strong.textContent = headers[index];
                    labelDiv.appendChild(strong);

                    // Insert label at the beginning of the cell
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

            // Restore on initial load if needed
            const mode = table.getAttribute('data-responsive-mode') || 'scroll';
            const breakpoint = getBreakpoint(table);
            const shouldActivate = window.innerWidth <= breakpoint;

            if (mode === 'cards' && !shouldActivate && table.classList.contains('is-cards-active')) {
                restoreTable(table);
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