import * as React from 'react';
import { formatDate, getFormattedTimeWithSecond, getDateWithMoscowTz } from 'utils/dates';
import { loadMoscowTime } from 'redux/trash-actions/uniq/promise';

require('components/dashboard/new/time/DashboardTime.scss');

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

  updateDateOnSecond = () => {
    const { date } = this.state;
    
    date.setSeconds(date.getSeconds() + 1);

    this.setState({ date });
  }

  render() {
    const { date } = this.state;

    return (
      <div className="dashboard_time">
        <div className="time_line">{getFormattedTimeWithSecond(date) || '--:--:--'}</div>
        <div className="date_line">{formatDate(date, 'DD MMMM YYYY') || '--:------:--'}</div>
      </div>
    )
  }
};

export default DashboardTime;