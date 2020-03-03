import styled, { css } from 'styled-components';
import { get } from 'lodash';
import { DefaultFirstDt } from 'components/new/ui/app_header/styled';

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
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-top: 0px;
  `,
  left: css`
    top: 0;
    transform: translate(-100%);
    left: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 1px solid black;
  `,
  right: css`
    top: 0;
    transform: translate(100%);
    right: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 1px solid black;
  `,
  default: css`
    transform: initial;
    left: initial;
  `,
};

export const SecondMenuContainer = styled.dl<{ position?: 'bottom_left' | 'right'; }>`
  position: relative;
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
  border: 1px solid rgba(0,0,0, 0.15);
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0,0,0,.175);

  padding: 8px 0px;

  ${({ position }) => get(buPosition, position) || get(buPosition, 'default')};
`;

export const SecondMenuItemContainer = styled(DefaultFirstDt)<{ noneEffect?: boolean;  }>`
  pointer-events: all;
  min-width: 250px;
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
