import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import styled from 'styled-components';

export const ColStyled = styled(Col)``;

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
};

const EtsCol: React.FC<EtsColProps> = React.memo(
  (props) => {
    return (
      <ColStyled {...props} />
    );
  },
);

export default EtsCol;
