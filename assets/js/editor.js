const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl, RadioControl, TextControl } = wp.components;
const { createElement, Fragment } = wp.element;
const { __ } = wp.i18n;

const withTableResponsiveControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/table') {
            return createElement(BlockEdit, props);
        }

        const { attributes, setAttributes } = props;
        const { enableResponsive, responsiveMode, responsiveBreakpoint } = attributes;

        return createElement(
            Fragment,
            null,
            createElement(BlockEdit, props),
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { 
                        title: __('Responsive Behavior', 'table-cards-responsive'), 
                        initialOpen: true 
                    },
                    createElement(ToggleControl, {
                        label: __('Enable Responsive Mode', 'table-cards-responsive'),
                        checked: enableResponsive,
                        onChange: (value) => setAttributes({ enableResponsive: value }),
                    }),
                    enableResponsive && createElement(
                        Fragment,
                        null,
                        createElement(RadioControl, {
                            label: __('Responsive Mode', 'table-cards-responsive'),
                            selected: responsiveMode || 'scroll',
                            options: [
                                { 
                                    label: __('Horizontal Scroll', 'table-cards-responsive'), 
                                    value: 'scroll' 
                                },
                                { 
                                    label: __('Rows to Cards', 'table-cards-responsive'), 
                                    value: 'cards' 
                                },
                            ],
                            onChange: (value) => setAttributes({ responsiveMode: value }),
                        }),
                        // Breakpoint control now available for BOTH modes
                        createElement(TextControl, {
                            label: __('Responsive Breakpoint (px)', 'table-cards-responsive'),
                            help: __('Screen width below which responsive mode activates (Horizontal Scroll or Cards). Leave empty to use automatic theme detection (default ~782px).', 'table-cards-responsive'),
                            type: 'number',
                            value: responsiveBreakpoint || '',
                            onChange: (value) => {
                                const num = parseInt(value, 10);
                                setAttributes({ responsiveBreakpoint: isNaN(num) ? null : num });
                            },
                        })
                    )
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