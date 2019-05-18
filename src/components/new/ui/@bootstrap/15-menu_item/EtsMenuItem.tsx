import * as React from 'react';
import styled from 'styled-components';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';

export const MenuItemStyled = styled(MenuItem)``;

export type EtsMenuItemProps = any;

const EtsMenuItem: React.FC<EtsMenuItemProps> = React.memo(
  (props) => {
    return (
      <MenuItemStyled {...props} />
    );
  },
);

export default EtsMenuItem;
