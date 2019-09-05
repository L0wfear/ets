import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { glyphMap } from 'global-styled';

export type EtsGlyphiconProps = {
  id?: string;
  isLoading?: boolean;
  onClick?: () => any;
  className?: string;
  fontSize?: string;
  color?: string;
  glyph: keyof typeof glyphMap,
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;

const AnimationSpin = css`
  animation: ${spin} 1000ms infinite linear;
`;

const AnimationNone = css`
  animation: none !important;
`;

export const GlyphiconStyled = styled.span<EtsGlyphiconProps>`
  position: initial;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  cursor: pointer;

  font-size: ${({ fontSize }) => fontSize ? fontSize : 'inherit'};
  color: ${({ color }) => color ? color : 'inherit'};

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  ${({ isLoading }) => isLoading ? AnimationSpin : AnimationNone};

  :before {
    content: ${({ glyph }) => `"${glyphMap[glyph]}"`};
  }
`;

const EtsGlyphicon: React.FC<EtsGlyphiconProps> = React.memo(
  (props) => {

    return Boolean(props.glyph) && (
      <GlyphiconStyled {...props} />
    );
  },
);

export default EtsGlyphicon;
