import * as React from 'react';
import styled, { css } from 'styled-components';

type EtsDropdownMenuProps = {
  pullRight?: boolean;
  dropup?: boolean;
};

const pullRightCss = css`
  right: 0;
  left: auto;
`;

const dropupCss = css`
  top: auto;
  bottom: 100%;
  margin-bottom: 2px;
`;

export const EtsDropdownMenuContainer = styled.ul<EtsDropdownMenuProps>`
  position: absolute;
  z-index: 1000;

  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  padding: 5px 0;
  margin: 2px 0 0;
  font-size: 14px;
  text-align: left;
  display: block;
  background-color: #fff;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border: 1px solid #ccc;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 4px;
  -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
  box-shadow: 0 6px 12px rgba(0,0,0,.175);

  ${({ pullRight }) => (
    pullRight && pullRightCss
  )}

  ${({ dropup }) => (
    dropup && dropupCss
  )}
`;

const EtsDropdownMenu: React.FC<EtsDropdownMenuProps> = React.memo(
  (props) => {
    return (
      <EtsDropdownMenuContainer {...props} />
    );
  },
);

export default EtsDropdownMenu;
