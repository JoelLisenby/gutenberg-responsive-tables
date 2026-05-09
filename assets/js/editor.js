const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl } = wp.components;
const { Fragment } = wp.element;

const withTableResponsiveControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        if ( props.name !== 'core/table' ) {
            return <BlockEdit {...props} />;
        }

        const { attributes, setAttributes } = props;
        const { responsiveBreakpoint } = attributes;

        return (
            <Fragment>
                <BlockEdit {...props} />

                <InspectorControls>
                    <PanelBody title="Responsive Cards" initialOpen={ false }>
                        <TextControl
                            label="Mobile Breakpoint (px)"
                            help="Leave empty to use automatic theme detection. Example: 768"
                            value={ responsiveBreakpoint || '' }
                            onChange={ ( value ) => {
                                const num = parseInt( value, 10 );
                                setAttributes( {
                                    responsiveBreakpoint: isNaN( num ) ? null : num,
                                } );
                            } }
                            type="number"
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withTableResponsiveControls' );

addFilter(
    'editor.BlockEdit',
    'table-cards-responsive/with-inspector-controls',
    withTableResponsiveControls
);