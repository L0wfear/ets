import * as React from 'react';
import styled from 'styled-components';
import * as Dropdown from 'react-bootstrap/lib/Dropdown';

export const DropdownToggleStyled = styled(Dropdown.Toggle)``;

export type EtsDropdownToggleProps = any;

const EtsDropdownToggle: React.FC<EtsDropdownToggleProps> = React.memo(
  (props) => {
    return (
      <DropdownToggleStyled {...props} />
    );
  },
);

export default EtsDropdownToggle;
