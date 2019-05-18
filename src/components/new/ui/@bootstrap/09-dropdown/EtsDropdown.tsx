import * as React from 'react';
import styled from 'styled-components';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';

export const DropdownStyled = styled(Dropdown)``;

export type EtsDropdownProps = any;

const EtsDropdown: React.FC<EtsDropdownProps> = React.memo(
  (props) => {
    return (
      <DropdownStyled {...props} />
    );
  },
);

export default EtsDropdown;
