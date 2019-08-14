import * as React from 'react';
import styled from 'styled-components';
import * as Label from 'react-bootstrap/lib/Label';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';

export const LabelBackgroundStyled = styled(Label)`
  &&& {
    margin-left: 10px;
    padding: 5px 10px;
    border-radius: ${UiConstants.borderFieldRadius};
    &.label-error {
      background: ${UiConstants.colorError};
    }
  }
`;

export type EtsBackgroundLabelProps = any;

const EtsBackgroundLabel: React.FC<EtsBackgroundLabelProps> = React.memo(
  (props) => {
    return (
      <LabelBackgroundStyled {...props} />
    );
  },
);

export default EtsBackgroundLabel;
