import * as React from 'react';
import styled from 'styled-components';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

export const GlyphiconStyled = styled(Glyphicon)``;

type EtsGlyphiconProps = any;

const EtsGlyphicon: React.FC<EtsGlyphiconProps> = React.memo(
  (props) => (
    <GlyphiconStyled {...props} />
  ),
);

export default EtsGlyphicon;
