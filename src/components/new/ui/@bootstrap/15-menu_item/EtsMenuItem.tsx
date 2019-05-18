import * as React from 'react';
import styled from 'styled-components';
// import * as MenuItem from 'react-bootstrap/lib/MenuItem';

export const MenuItemAnchorStyled = styled.a`
  display: block;
  padding: 3px 20px;
  clear: both;
  font-weight: 400;
  line-height: 1.42857143;
  color: #333;
  white-space: nowrap;

  &:hover {
    color: #262626;
    text-decoration: none;
    background-color: #f5f5f5;
  }
`;

export const MenuItemStyled = styled.li`
  list-style: none;
  cursor: pointer;
`;

export type EtsMenuItemProps = {
  id?: string;
  eventKey: string | number;
  onSelect: (eventKey: string | number, event?: any) => any;
};

const EtsMenuItem: React.FC<EtsMenuItemProps> = React.memo(
  (props) => {
    const handleClick = React.useCallback(
      (event) => {
        event.preventDefault();
        props.onSelect(props.eventKey, event);
      },
      [props.onSelect, props.eventKey],
    );
    return (
      <MenuItemStyled onClick={handleClick}>
        <MenuItemAnchorStyled href="#">
          {props.children}
        </MenuItemAnchorStyled>
      </MenuItemStyled>
    );
  },
);

export default EtsMenuItem;
