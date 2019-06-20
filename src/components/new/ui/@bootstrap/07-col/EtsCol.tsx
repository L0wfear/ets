import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import styled from 'styled-components';
import { isNumber } from 'util';

export const ColStyled = styled(Col as any)`
  z-index: ${({ zIndex }) => isNumber(zIndex) ? zIndex : 'auto'};
`;

export type EtsColProps = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xsOffset?: number;
  smOffset?: number;
  mdOffset?: number;
  lgOffset?: number;

  style?: object;
  className?: string;
  onClick?: (...arg: any) => any;

  zIndex?: number;
};

const EtsCol: React.FC<EtsColProps> = React.memo(
  (props) => {
    return (
      <ColStyled {...props} />
    );
  },
);

export default EtsCol;
