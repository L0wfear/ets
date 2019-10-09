import styled, { css } from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { StringFieldUi } from 'components/@next/@ui/renderFields/StringField/styled';
import { NumberFieldUi } from 'components/@next/@ui/renderFields/NumberField/styled';

const EtsAddon = styled.span`
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 400;
  color: #555;
  text-align: center;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  border-radius: ${UiConstants.borderFieldRadius};
  white-space: nowrap;
  vertical-align: middle;
`;

const cssHasRightAddon = css`
  ${EtsAddon} {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  ${StringFieldUi} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    &.has-error {
      border-radius: ${UiConstants.borderFieldRadius} 0 0 0
    }
  }
  ${NumberFieldUi} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
`;
const EtsGroup = styled.div<{ has_right_addon?: boolean }>`
  width: 100%;
  display: flex;

  ${({ has_right_addon }) => has_right_addon && cssHasRightAddon};
`;

const EtsInputGroup = {
  Group: EtsGroup,
  Addon: EtsAddon,
};

export default EtsInputGroup;
