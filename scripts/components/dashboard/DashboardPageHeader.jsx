import React from 'react';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import Div from '../ui/Div.jsx';

export default class DashboardPageHeader extends React.Component {

  state = {
    time: moment().format('HH:mm:ss'),
  }

  componentDidMount() {
    this.updateClock();
    this.timeInterval = setInterval(this.updateClock.bind(this), 1000);
  }

  updateClock() {
    let time = moment().format('HH:mm:ss');
    this.setState({time});
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
  }

  render() {
    return (
      <Row>
        <Col md={4}>
        </Col>
        <Col md={4}>
          <Div className="dashboard-time" id="dashboard-time">
            {this.state.time}
          </Div>
        </Col>
        <Col md={4}>
        </Col>
      </Row>
    );
  }

}
