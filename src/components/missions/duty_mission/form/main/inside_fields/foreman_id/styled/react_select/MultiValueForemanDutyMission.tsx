import * as React from 'react';
import { get } from 'lodash';

import * as components from 'components/ui/input/ReactSelect/styled/styled';

const pathToActiveStatus = ['data', 'rowData', 'active_for_brigade'];

const MultiValueForemanDutyMission = (props) => (
  <components.SingleValue {...props}>
    {
      `${props.children}${!get(props, pathToActiveStatus, true) ? ` (Неактивный сотрудник)` : ''}`
    }
  </components.SingleValue>
);

export default React.memo(MultiValueForemanDutyMission);
