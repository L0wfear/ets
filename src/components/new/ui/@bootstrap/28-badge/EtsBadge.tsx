import * as React from 'react';
import styled from 'styled-components';
import * as Badge from 'react-bootstrap/lib/Badge';

export const BadgeStyled = styled(Badge)``;

type EtsBadgeProps = any;

const EtsBadge: React.FC<EtsBadgeProps> = React.memo(
  (props) => {
    return (
      <BadgeStyled {...props} />
    );
  },
);

export default EtsBadge;
