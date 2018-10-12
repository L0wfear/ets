import * as React from 'react';
import {
  formatDate, getFormattedTimeWithSecond, getDateWithMoscowTz, getDateWithMoscowTzByTimestamp,
} from 'utils/dates';
import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';

import {
  DashboardTimeContainer,
  TimeLineContainer,
  DateLineContainer,
} from 'components/dashboard/time/styled/styled';

type StateDashboardTime = {
  date: Date;
  itervalId: NodeJS.Timeout;
};

class DashboardTime extends React.Component<{}, StateDashboardTime> {
  state = {
    date: getDateWithMoscowTz(),
    itervalId: setInterval(() => this.updateDateOnSecond(), 1000),
  }

  componentDidMount() {
    loadMoscowTime()
      .then(({ time }) => {
        clearInterval(this.state.itervalId);

        this.setState({
          date: getDateWithMoscowTzByTimestamp(time.timestamp * 1000),
          itervalId: setInterval(() => this.updateDateOnSecond(), 1000),
        })
      })
  }

  componentWillUnmount() {
    clearInterval(this.state.itervalId);
  }

  updateDateOnSecond = () => {
    const { date } = this.state;
    
    date.setSeconds(date.getSeconds() + 1);

    this.setState({ date });
  }

  render() {
    const { date } = this.state;

    return (
      <DashboardTimeContainer>
        <TimeLineContainer>{getFormattedTimeWithSecond(date) || '--:--:--'}</TimeLineContainer>
        <DateLineContainer>{formatDate(date, 'DD MMMM YYYY') || '--:------:--'}</DateLineContainer>
      </DashboardTimeContainer>
    )
  }
};

export default DashboardTime;