import * as React from 'react';
import { Label } from 'react-bootstrap';

import { DUTY_MISSION_STATUS_LABELS } from './DutyMissionsTable';

export const onlyActiveEmployeeNotification = () => {
  global.NOTIFICATION_SYSTEM.notify('В наряд-задание можно добавить только активного на данный момент времени сотрудника', 'info');
};

export const FormTitle = props =>
  <div>
    {`Наряд-задание № ${props.number || ''}`}
    <Label bsStyle="default" style={{ marginLeft: 10 }}>{DUTY_MISSION_STATUS_LABELS[props.status]}</Label>
  </div>;
