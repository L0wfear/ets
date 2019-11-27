import styled, { css } from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { darken } from 'polished';

type EtsPageWrapProps = {
  inheritDisplay?: boolean;
  autoHeight?: boolean;
  smallPaddings?: boolean;
};

export const DivRelative = styled.div`
  position: relative;
`;

export const DivNone = styled.div`
  display: none;
`;

export const DivGreen = styled.div`
  color: green;
`;

export const SpanGreen = styled.span`
  color: green;
`;

export const DivRed = styled.div`
  color: ${UiConstants.colorError};
`;

export const SpanRed = styled.span`
  color: ${UiConstants.colorError};
`;

export const ColorSpan = styled.span<{ color: string; }>`
  color: ${({ color }) => color};
`;

export const MarkNewRegistry = styled.div`
  width: 5px;
  height: 5px;
  background-color: #7fc650;
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
  border: 1px solid rgba(0, 0, 0, 0.3);
`;

export const EtsPageWrap = styled.div<EtsPageWrapProps>`
  position: relative;
  height: 100%;

  padding: 10px 15px;
  overflow: auto;

  &:focus {
    outline: 0px !important;
    -webkit-appearance: none;
  }
`;

export const EtsGreyPageWrap = styled.div<EtsPageWrapProps>`
  position: relative;
  height: 100%;
  background: #eeeeee;
  padding:  ${ ({ smallPaddings }) => smallPaddings ? '10px 0px' : '10px 15px' };
  overflow: auto;

  &:focus {
    outline: 0px !important;
    -webkit-appearance: none;
  }
`;

export const FlexContainer = styled.div<{ isWrap?: boolean; direction?: string; alignItems?: string; }>`
  display: flex;
  flex-wrap: ${({ isWrap }) => (isWrap ? 'wrap' : 'initial')};
  flex-direction: ${({ direction }) => (direction ? direction : 'initial')};
  align-items: ${({ alignItems }) => alignItems || 'initial'};
`;

export const Flex = styled.div<{
  grow?: number;
  shrink?: number;
  basis?: number;
  none?: boolean;
}>`
  flex: ${({ grow }) => grow || 0} ${({ shrink }) => shrink || 0}
    ${({ basis }) => basis || 0}px;
  display: ${({ none }) => (none ? 'none' : 'initial')};
`;

export const BorderDash = styled.div<{
  width?: number;
  borderStyle?: string;
  color?: string;
}>`
  border: ${(props) => {
    const { width = 1, borderStyle = 'solid', color = 'black' } = props;
    return `${width}px ${borderStyle} ${color}`;
  }};
  border-radius: 3px;
  padding: 5px 0;
  padding-bottom: 15px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 15px 0px;
`;

export const DisplayFlexAlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const DisplayFlexAlignCenterSpaceBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DisplayFlexAlignCenterFooterForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

export const FooterEnd = styled.div<{ margin?: number; }>`
  display: flex;
  justify-content: flex-end;

  &>* {
    margin-right: ${({ margin }) => `${margin || 10}px`};

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const ButtonGroupWrapperMargin = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  button {
    margin-right: 10px;
    &:last-child {
      margin-right: 0px;
    }
  }
`;

export const HrDelimiter = styled.div`
  border-bottom: 1px solid #ddd;
  margin: 30px 0px;
`;

// <<< Переделать это УГ, привести к дизайн системе
export const SlimH4 = styled.h4`
  font-weight: 500!important;
  margin-top: 25px;
`;

export const InfoBlock = styled.div`
  color: #fff;
  background: ${UiConstants.colorBlue};
  padding: 10px 15px;
  border-radius: 3px;
  box-shadow: 0 0.125em 0.375em 0 rgba(0,0,0,.27);
  position: relative;
  font-size: 12px;
  &:before {
    content: '';
    border-width: 11px;
    border-style: solid;
    border-color: transparent transparent rgb(0, 125, 255);
    border-image: initial;
    position: absolute;
    top: -19px;
    left: 27px;
  }
`;

export const RedOptionsStyle = css`
  background-color: ${UiConstants.colorError};
  border: none!important;
  color: white!important;
  .react-select__multi-value__remove{
    border: solid 1px!important;
    border-color: ${darken(0.1, UiConstants.colorError)}!important;
    &:hover {
      background: ${darken(0.1, UiConstants.colorError)}!important;
    }
  }
  .react-select__multi-value__label {
    border: solid 1px!important;
    border-color: ${darken(0.1, UiConstants.colorError)}!important;
    border-left: none!important;
  }
`;