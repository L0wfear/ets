import * as React from 'react';
import { get } from 'lodash';

import * as components from 'components/ui/input/ReactSelect/styled/styled';
import styled, { css } from 'styled-components';
import { MultiValueProps } from 'react-select/src/components/MultiValue';

const NotActiveEmployeeStyle = css`
  background-color: rgba(234, 66, 255, 0.05);
  border: 1px solid rgba(234, 66, 255, 0.24);
`;

const pathToActiveStatus = ['data', 'rowData', 'active_for_brigade'];

const MultiValueWithCheckActive = styled(components.MultiValue)<MultiValueProps<any>>`
  &&& {
    ${(props) => (
      !get(props, pathToActiveStatus, true) && NotActiveEmployeeStyle
    )}
  }
`;

const MultiValueEmployeeDutyMission = (props) => (
  <MultiValueWithCheckActive {...props}>
    {
      `${props.children}${!get(props, pathToActiveStatus, true) ? ` (Неактивный сотрудник)` : ''}`
    }
  </MultiValueWithCheckActive>
);

export default React.memo(MultiValueEmployeeDutyMission);
