import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { DefaultFirstDt } from 'components/app_header/styled';

export const PageMenuMainDl = styled.dl`
  display: flex;
  margin: 0;
  white-space: nowrap;
  user-select: none;
`;

const buPosition = {
  bottom_left: css`
    transform: translate(-100%);
    left: 100%;
  `,
  left: css`
    top: 0;
    transform: translate(-100%);
    left: 0;
    `,
  right: css`
    top: 0;
    transform: translate(100%);
    right: 0;
  `,
  default: css`
    transform: initial;
    left: initial;
  `,
};

export const SecondMenuContainer = styled.dl<{ position?: 'bottom_left' | 'right' }>`
  position: relative;
  ${({ position }) => get(buPosition, position) || get(buPosition, 'default')};
  position: absolute;
  display: flex;
  margin: 0;
  white-space: nowrap;
  color: black;

  display: flex;
  flex-direction: column;
  cursor: default;

  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ccc;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);

  padding: 8px 0px;
`;

export const SecondMenuItemContainer = styled(DefaultFirstDt)<{ noneEffect?: boolean  }>`
  pointer-events: all;
  cursor: ${({ noneEffect }) => noneEffect ? 'default' : 'pointer'};
  background-color: ${({ active }) => active ? 'rgba(110, 158, 88, 0.4)' : 'inherit'};
  margin: 0;
  color: #000;
  :hover {
    background-color: ${({ noneEffect, active }) => (
      noneEffect
        ? 'initial'
        : active
        ? 'rgba(110, 158, 88, 0.4)'
        : '#f5f5f5'
    )};
  }
`;
