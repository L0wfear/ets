import React from 'react';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';

import { FluxContext } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';

@FluxContext
export default class DashboardPageHeader extends React.Component {

  state = {
    time: moment().format('HH:mm:ss'),
    date: moment().format('DD MMMM YYYY'),
  }

  componentDidMount() {
    moment.locale('ru');
    this.context.flux.getActions('dashboard').getMoscowTime().then(({ date }) => {
      this.timeInterval = setInterval(this.updateClock.bind(this), 1000);
      this.dateInterval = setInterval(this.updateDate.bind(this), 1000 * 60);

      this.setState({
        time: moment(date).format('HH:mm:ss'),
        date: moment(date).format('DD MMMM YYYY'),
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearInterval(this.dateInterval);
  }

  updateClock() {
    const time = moment().format('HH:mm:ss');
    this.setState({ time });
  }

  updateDate() {
    const date = moment().format('DD MMMM YYYY');
    this.setState({ date });
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
