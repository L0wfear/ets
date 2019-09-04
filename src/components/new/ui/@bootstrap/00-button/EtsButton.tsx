import * as React from 'react';
import styled, { css } from 'styled-components';
import themeButton from 'components/new/ui/@bootstrap/@themes/default/button/themeButton';
import { GlyphiconStyled } from '../01-glyphicon/EtsGlyphicon';
import { withRequirePermission, WithRequirePermissionAddProps, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

export type EtsButtonProps = WithRequirePermissionProps & {
  bsClass?: string;
  themeName?: keyof typeof themeButton;
  active?: boolean;
  block?: boolean;
  bsSize?: 'small' | 'input' | 'xsmall';
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: (event?: any) => void;
  title?: string;
  type?: 'submit' | 'button';
  whiteSpace?: 'normal';

  style?: object;
};
type EtsButtonPropsWrap = EtsButtonProps & WithRequirePermissionAddProps;

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

export const ButtonStyled = styled.button<EtsButtonPropsWrap>`
  &&& {
    user-select: none;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    outline-offset: -2px;
    line-height: 1.5;

    transition: all 0.5s;

    border-radius: ${({ theme, themeName }) => theme.button[themeName || 'default'].borderRadius.default };
    border: ${({ theme, themeName }) => theme.button[themeName || 'default'].border.default};
    box-shadow: ${({ theme, themeName }) => theme.button[themeName || 'default'].boxShadow.default};

    cursor: ${({ disabled }) => !disabled ? 'pointer' : 'not-allowed'};

    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 33px;

    ${GlyphiconStyled} {
      margin: 0 5px;
    }

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

const EtsButton: React.FC<EtsButtonPropsWrap> = React.memo(
  (props) => {
    // тк что-то где-то поддормаживает и дисейбл не сразу появляется
    const [localDisabled, setLocalDisabled] = React.useState(false);

    const handleClick = React.useCallback(
      (...arg) => {
        if ((!localDisabled && !props.disabled) && props.onClick) {
          setLocalDisabled(true);
          setTimeout(
            () => {
              setLocalDisabled(false);
            },
            300,
          );
          props.onClick(...arg);
        }
      },
      [Boolean(props.disabled), localDisabled, props.onClick],
    );

    return (
      <ButtonStyled
        {...props}
        disabled={props.disabled}
        type={props.type || 'button'}
        onClick={handleClick}
      />
    );
  },
);

export default withRequirePermission<EtsButtonProps>()(EtsButton);
