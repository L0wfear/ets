import * as React from 'react';
import { get } from 'lodash';

import * as components from 'components/old/ui/input/ReactSelect/styled/styled';
import styled from 'styled-components';
import { MultiValueProps } from 'react-select/src/components/MultiValue';
import { RedOptionsStyle } from 'global-styled/global-styled';

const pathToActiveStatus = ['data', 'rowData', 'active_for_brigade'];

const MultiValueWithCheckActive = styled(components.MultiValue)<MultiValueProps<any>>`
  &&& {
    ${(props) => (
    !get(props, pathToActiveStatus, true) && RedOptionsStyle
  )}
  }
`;

const MultiValueEmployeeDutyMission = (props) => (
  <MultiValueWithCheckActive {...props}>
    {
      `${props.children}${!get(props, pathToActiveStatus, true) ? ` (Не работает)` : ''}`
    }
  </MultiValueWithCheckActive>
);

export default React.memo(MultiValueEmployeeDutyMission);
