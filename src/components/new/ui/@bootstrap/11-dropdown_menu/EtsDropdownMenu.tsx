import * as React from 'react';
import styled from 'styled-components';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';

export const DropdownMenuStyled = styled(Dropdown.Menu)``;

export type EtsDropdownMenuProps = any;

const EtsDropdownMenu: React.FC<EtsDropdownMenuProps> = React.memo(
  (props) => {
    return (
      <DropdownMenuStyled {...props} />
    );
  },
);

export default EtsDropdownMenu;
