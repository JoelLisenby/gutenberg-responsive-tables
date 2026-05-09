const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl } = wp.components;
const { createElement, Fragment } = wp.element;

const withTableResponsiveControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/table') {
            return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes } = props;
        const { responsiveBreakpoint } = attributes;

        return createElement(
            Fragment,
            null,
            createElement(BlockEdit, props),
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: 'Responsive Cards', initialOpen: false },
                    createElement(TextControl, {
                        label: 'Mobile Breakpoint (px)',
                        help: 'Leave empty to use automatic theme detection. Example: 768',
                        value: responsiveBreakpoint || '',
                        type: 'number',
                        onChange: (value) => {
                            const num = parseInt(value, 10);
                            setAttributes({
                                responsiveBreakpoint: isNaN(num) ? null : num,
                            });
                        },
                    })
                )
            )
        );
    };
}, 'withTableResponsiveControls');

addFilter(
    'editor.BlockEdit',
    'table-cards-responsive/with-inspector-controls',
    withTableResponsiveControls
);