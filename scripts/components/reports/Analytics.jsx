import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Div from '../ui/Div.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Datepicker from '../ui/DatePicker.jsx';
import { getToday9am, getTomorrow9am } from 'utils/dates';
import { saveData } from 'utils/functions';

class Analytics extends Component {

  constructor(props) {
		super(props);

    let [date_from, date_to] = [getToday9am(), getTomorrow9am()];

		this.state = {
      report_ids: [],
      date_from,
      date_to
		};
	}

  componentDidMount() {
    const { flux } = this.context;
    // flux.getActions('company-structure').getCompanyList();
  }

  handleSubmit() {
    const { flux } = this.context;
		flux.getActions('reports').getAnalytics(this.state).then(blob => {saveData(blob, `Отчет.xls`)});
  }

  handleChange(field, value) {
    (!isNaN(parseFloat(field))) ? this.setState({report_ids: [field]}) : this.setState({[field]: value});
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div className="ets-page-wrap">
        <Div>
          <Row>
            <Col md={1} />
            <Col md={11}>
              <Div><label>Период формирования:</label></Div>
    				  <Div className="inline-block reports-date">
    					  <Datepicker date={this.state.date_from} onChange={this.handleChange.bind(this, 'date_from')}/>
    				  </Div>
    				  <Div className="inline-block reports-date">
    					  <Datepicker date={this.state.date_to} onChange={this.handleChange.bind(this, 'date_to')}/>
    				  </Div>
              {/*<Field type="select" label="Учреждение"
                  multi={true}
                  options={COMPANY}
                  value={institutionsList.map(o => o.object_id).join(',')}
                  onChange={this.handleChange.bind(null, 'odh')}/>*/}
            </Col>
          </Row>
          <br/>
          <Row>
            <Col md={1} />
            <Col md={11}>
              <Div><label>Выбрать отчет:</label></Div>
              <input style={{marginRight:"10px"}} type="radio" checked={this.state.report_ids.indexOf(0)+1} onChange={this.handleChange.bind(this, 0)} />Отчет по маршрутам<br/>
              <input style={{marginRight:"10px"}} type="radio" checked={this.state.report_ids.indexOf(1)+1} onChange={this.handleChange.bind(this, 1)} />Отчет по заданиям<br/>
              <input style={{marginRight:"10px"}} type="radio" checked={this.state.report_ids.indexOf(2)+1} onChange={this.handleChange.bind(this, 2)} />Отчет по путевым листам<br/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col md={1} />
            <Col md={11}>
            <Button disabled={!this.state.report_ids} onClick={this.handleSubmit.bind(this)}>Выгрузить</Button>
            </Col>
          </Row>
        </Div>
      </div>
    );
  }
}

Analytics.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(Analytics, ['reports']);
