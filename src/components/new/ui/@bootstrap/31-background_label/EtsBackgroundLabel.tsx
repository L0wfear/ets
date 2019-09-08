// import * as React from 'react';
import styled from 'styled-components';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export type EtsBackgroundLabelProps = any;

export const LabelBackgroundStyled = styled.span<EtsBackgroundLabelProps>`
  &&& {
    display: inline;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    background-color: #777;
    margin-left: 10px;
    padding: 5px 10px;
    border-radius: ${UiConstants.borderFieldRadius};
    &.label-error {
      background: ${UiConstants.colorError};
    }
  }
`;

const EtsBackgroundLabel = LabelBackgroundStyled;

export default EtsBackgroundLabel;
