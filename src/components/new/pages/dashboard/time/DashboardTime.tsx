import * as React from 'react';
import { get } from 'lodash';
import {
  formatDate,
  getFormattedTimeWithSecond,
  getDateWithMoscowTz,
  getDateWithMoscowTzByTimestamp,
} from 'utils/dates';

import {
  DashboardTimeContainer,
  TimeLineContainer,
  DateLineContainer,
} from 'components/new/pages/dashboard/time/styled/styled';
import useMoscowTime from 'components/new/utils/hooks/services/useList/useMoscowTime';

const DashboardTimeNew: React.FC<{ page: string }> = React.memo(
  (props) => {
    const [date, setDate] = React.useState(getDateWithMoscowTz());

    const moscowTime = useMoscowTime(props.page);

    React.useEffect(
      () => {
        const timestamp = get(moscowTime.list, '0.timestamp', null);
        let intervalIdtemp = null;
        let countInc = 0;

        if (timestamp) {
          const currentDate = getDateWithMoscowTzByTimestamp(timestamp * 1000);
          currentDate.setSeconds(currentDate.getSeconds() + countInc);
          setDate(currentDate);

          intervalIdtemp = setInterval(
            () => {
              countInc = countInc + 1;
              const newDate = getDateWithMoscowTzByTimestamp(timestamp * 1000);
              newDate.setSeconds(newDate.getSeconds() + countInc);
              setDate(newDate);
            },
            1000,
          );
        }

        return () => clearInterval(intervalIdtemp);
      },
      [moscowTime],
    );

    return (
      <DashboardTimeContainer>
        <TimeLineContainer>{getFormattedTimeWithSecond(date) || '--:--:--'}</TimeLineContainer>
        <DateLineContainer>{formatDate(date, 'DD MMMM YYYY') || '--:------:--'}</DateLineContainer>
      </DashboardTimeContainer>
    );
  },
);

export default DashboardTimeNew;
