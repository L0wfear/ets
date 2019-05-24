import * as React from 'react';
import styled, { css } from 'styled-components';
import { defaultEtsTheme } from '../colors';

export type EtsButtonProps = {
  themeName?: keyof typeof defaultEtsTheme['button'];
  active?: boolean;
  block?: boolean;
  bsSize?: 'small' | 'input';
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: (event?: any) => void;
  title?: string;
  type?: 'submit' | 'button';
  whiteSpace?: 'normal';
};

const bsSizeCssSmall = css`
  padding: 5px 20px;
`;
const bsSizeCssDefault = css`
  padding: 6px 12px;
`;

const bsSizeCssInput = css`
  ${bsSizeCssDefault}
  height: 38px;
`;

const widthCssDefault = css`
  width: 100%;
`;
const whiteSpaceCssNormal = css`
  white-space: normal;
`;

export const ButtonStyled = styled.button<EtsButtonProps>`
  &&& {
    user-select: none;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    outline-offset: -2px;
    line-height: 1.5;

    border-radius: ${({ theme, themeName }) => theme.button[themeName || 'default'].borderRadius.default };
    border: ${({ theme, themeName }) => theme.button[themeName || 'default'].border.default};
    box-shadow: ${({ theme, themeName }) => theme.button[themeName || 'default'].boxShadow.default};

    cursor: ${({ disabled }) => !disabled ? 'pointer' : 'not-allowed'};

    background-color: ${({ theme, disabled, active, themeName }) => (
      !disabled
      ? (
          !active
            ? theme.button[themeName || 'default'].backgroundColor.default
            : theme.button[themeName || 'default'].backgroundColor.focus
        )
        : (
          !active
            ? theme.button[themeName || 'default'].backgroundColor.disabled
            : theme.button[themeName || 'default'].backgroundColor.disabledFocus
        )
    )};
    color: ${({ theme, disabled, active, themeName }) => (
      !disabled
        ? (
          !active
            ? theme.button[themeName || 'default'].color.default
            : theme.button[themeName || 'default'].color.focus
        )
        : (
          !active
            ? theme.button[themeName || 'default'].color.disabled
            : theme.button[themeName || 'default'].color.disabledFocus
        )
    )};
    opacity: ${({ theme, disabled, active, themeName }) => (
      !disabled
        ? theme.button[themeName || 'default'].opacity.default
        : (
          !active
            ? theme.button[themeName || 'default'].opacity.disabled
            : theme.button[themeName || 'default'].opacity.disabledFocus
        )
    )};

    &:hover {
      background-color: ${({ theme, disabled, active, themeName }) => (
        !disabled
          ? theme.button[themeName || 'default'].backgroundColor.hover
          : (
            !active
              ? theme.button[themeName || 'default'].backgroundColor.disabled
              : theme.button[themeName || 'default'].backgroundColor.disabledFocus
          )
      )};
      color: ${({ theme, disabled, active, themeName }) => (
        !disabled
          ? theme.button[themeName || 'default'].color.hover
          : (
            !active
              ? theme.button[themeName || 'default'].color.disabled
              : theme.button[themeName || 'default'].color.disabledFocus
          )
      )};
    }

    &:focus {
      background-color: ${({ theme, disabled, themeName }) => (
        !disabled
          ? theme.button[themeName || 'default'].backgroundColor.focus
          : theme.button[themeName || 'default'].backgroundColor.disabled
      )};
      color: ${({ theme, disabled, themeName }) => (
        !disabled
          ? theme.button[themeName || 'default'].color.focus
          : theme.button[themeName || 'default'].color.disabled
      )};
      outline: 5px auto -webkit-focus-ring-color;
    }

    ${({ block }) => (
      block && widthCssDefault
    )}


    ${({ whiteSpace }) => (
      whiteSpace === 'normal' && whiteSpaceCssNormal
    )}

    ${({ bsSize }) => (
      bsSize === 'small'
        ? bsSizeCssSmall
        : (
            bsSize === 'input'
              ? bsSizeCssInput
              : bsSizeCssDefault
        )
    )}
  }
`;

const EtsButton: React.FC<EtsButtonProps> = React.memo(
  (props) => (
    <ButtonStyled
      {...props}
      type={props.type || 'button'}
    />
  ),
);

export default EtsButton;
