import * as React from 'react';
import styled from 'styled-components';

export const BadgeStyled = styled.span`
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background-color: #777;
  border-radius: 10px;
`;

export type EtsBadgeProps = {};

const EtsBadge: React.FC<EtsBadgeProps> = React.memo(
  (props) => {
    return (
      <BadgeStyled {...props} />
    );
  },
);

export default EtsBadge;
