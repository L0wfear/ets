import * as React from 'react';
import styled from 'styled-components';
import { glyphMap } from 'global-styled';

export const GlyphiconStyled = styled.span<Pick<EtsGlyphiconProps, 'glyph' | 'id' | 'onClick' | 'className'>>`
  position: initial;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: normal;
  line-height: 1;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  :before {
    content: ${({ glyph }) => `"${glyphMap[glyph]}"`};
  }
`;

export type EtsGlyphiconProps = {
  id?: string;
  isLoading?: boolean;
  onClick?: () => any;
  className?: string;
  glyph: keyof typeof glyphMap,
};

const EtsGlyphicon: React.FC<EtsGlyphiconProps> = React.memo(
  ({ isLoading, ...props }) => {

    return Boolean(props.glyph) && (
      <GlyphiconStyled {...props} />
    );
  },
);

export default EtsGlyphicon;
