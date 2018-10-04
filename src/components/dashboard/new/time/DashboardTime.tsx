import * as React from 'react';
import { formatDate, getFormattedTimeWithSecond, getDateWithMoscowTz } from 'utils/dates';
import { loadMoscowTime } from 'redux/trash-actions/uniq/promise';

import {
  DashboardTimeContainer,
  TimeLineContainer,
  DateLineContainer,
} from 'components/dashboard/new/time/styled/styled';

type StateDashboardTime = {
  date: Date;
  itervalId: any;
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
          date: getDateWithMoscowTz(time.timestamp * 1000),
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