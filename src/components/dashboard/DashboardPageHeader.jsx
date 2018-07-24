import React from 'react';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';

import { FluxContext } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';

let error = false;

@FluxContext
export default class DashboardPageHeader extends React.Component {

  state = {
    time: '--:--:--',
    date: '-- -- ----',
    summ: -1,
    count: 0,
    lastDate: new Date(),
  }

  componentDidMount() {
    this.getTime();
  }
  componentWillUnmount() {
    this.resetInterval();
  }

  getTime() {
    this.context.flux.getActions('dashboard').getMoscowTime().then(({ timestamp }) => {
      this.timeInterval = setInterval(this.updateClock.bind(this), 1000);

      const backDate = moment(timestamp * 1000).utcOffset(3);

      this.setState({
        time: backDate.format('HH:mm:ss'),
        date: backDate.format('DD MMMM YYYY'),
        prevDate: backDate,
      });
    }).catch((e) => {
      console.error(e);
      if (!error) {
        error = true;
        this.componentDidMount();
      } else {
        this.setState({
          time: '--:--:--',
          date: '-- -- ----',
        });
      }
    });
  }

  resetInterval() {
    clearInterval(this.timeInterval);
  }

  updateClock() {
    let { summ, count, lastDate } = this.state;

    const prevDate = moment(this.state.prevDate).add(1, 'seconds').utcOffset(3);
    const time = prevDate.format('HH:mm:ss');
    const date = prevDate.format('DD MMMM YYYY');

    if (summ === -1) {
      summ = 0;
    } else {
      count += 1;
      summ += (new Date()) - lastDate;
    }

    if (Math.abs((summ / 1000) - count) > 0.1) {
      this.resetInterval();
      this.getTime();

      summ = -1;
      count = 0;
    }

    lastDate = new Date();
    this.setState({ prevDate, time, date, lastDate, summ, count });
  }
  render() {
    return (
      <Row>
        <Col md={4} />
        <Col md={4}>
          <Div className="dashboard-time" id="dashboard-time">
            {this.state.time}
          </Div>
          <Div className="dashboard-date">
            {this.state.date}
          </Div>
        </Col>
        <Col md={4} />
      </Row>
    );
  }

}
