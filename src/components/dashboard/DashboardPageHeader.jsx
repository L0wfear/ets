import React from 'react';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';

import { FluxContext } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';

@FluxContext
export default class DashboardPageHeader extends React.Component {

  state = {
    time: null,
    date: null,
  }

  componentDidMount() {
    moment.locale('ru');
    this.context.flux.getActions('dashboard').getMoscowTime().then(({ date }) => {
      this.timeInterval = setInterval(this.updateClock.bind(this), 1000);

      this.setState({
        time: moment(date).format('HH:mm:ss'),
        date: moment(date).format('DD MMMM YYYY'),
        prevDate: date,
        backDate: date,
      });
    }).catch(() => {
      this.timeInterval = setInterval(this.updateClock.bind(this), 1000);

      const date = new Date();

      this.setState({
        time: moment(date).format('HH:mm:ss'),
        date: moment(date).format('DD MMMM YYYY'),
        prevDate: date,
        backDate: null,
      });
    });
    this.timeInterval = setInterval(this.updateClock.bind(this), 1000);
    this.dateInterval = setInterval(this.updateDate.bind(this), 1000 * 60);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearInterval(this.dateInterval);
  }

  updateClock() {
    const prevDate = moment(this.state.prevDate).add(1, 'seconds');
    const time = prevDate.format('HH:mm:ss');
    const date = prevDate.format('DD MMMM YYYY');

    this.setState({ prevDate, time, date });
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
