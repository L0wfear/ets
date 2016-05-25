import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Div from '../ui/Div.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Datepicker from '../ui/DatePicker.jsx';
import { getToday9am, getTomorrow9am, makeDate } from 'utils/dates';
import { saveData } from 'utils/functions';

class Analytics extends Component {

  constructor(props) {
		super(props);

    let [date_from, date_to] = [getToday9am(), getTomorrow9am()];

    this.reports = [
      'Маршруты',
      'Задания',
      'Путевые листы',
      'Транспортные средства',
      'Работники',
      'Расход топлива',
    ];

		this.state = {
      report_ids: [],
      company_ids: [],
      transcript: false,
      date_from,
      date_to
		};
	}

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('company-structure').getCompanyList();
  }

  handleSubmit() {
    const { flux } = this.context;

    let reportName = this.state.report_ids.length === 1 ? this.reports[this.state.report_ids[0]] : 'Отчет';

    let dateName = makeDate(this.state.date_from)+'-'+makeDate(this.state.date_to);
		flux.getActions('reports').getAnalytics(this.state).then(blob => {saveData(blob, `${reportName} ${dateName}.xls`)});
  }

  handleChange(field, value) {
    if (field === 'report_ids') {
      let { report_ids } = this.state;
      let id = parseFloat(value);
      let index = report_ids.indexOf(id);
      index === -1 ? report_ids.push(id) : report_ids.splice(index, 1);

      this.setState({report_ids});
    } else if (field === 'company_ids') {
      let { company_ids, transcript } = this.state;
      company_ids = value ? (''+value).split(',') : [];
      company_ids = company_ids.map((e) => parseFloat(e));
      if (company_ids.length > 1) transcript = false;
      this.setState({company_ids, transcript});
    } else {
      this.setState({[field]: value});
    }
  }

  handleCheckbox(e) {
    let value;
    if (e.target.checked) {
      let { companyList } = this.props;
      value = companyList.map((e) => e.id).join(',');
    } else {
      value = '';
    }
    this.handleChange('company_ids', value);
  }

  render() {

    let { companyList } = this.props;

    let reportsList = this.reports.map((e, i) => {
      return <div key={e+i}><input
          style={{marginRight:"10px"}}
          type="checkbox"
          checked={this.state.report_ids.indexOf(i)+1}
          onChange={this.handleChange.bind(this, 'report_ids', i)} />{e}<br/></div>
      });

    let COMPANY = companyList && companyList.map(({id, name}) => ({value: id, label: name}))

    return (
      <div className="ets-page-wrap">
        <Div>
          <Col md={1} />
          <Col md={4}>
            <Row>
              <Div><label>Период формирования:</label></Div>
              <Div className="inline-block reports-date">
                <Datepicker date={this.state.date_from} onChange={this.handleChange.bind(this, 'date_from')}/>
              </Div>
              <Div className="inline-block reports-date">
                <Datepicker date={this.state.date_to} onChange={this.handleChange.bind(this, 'date_to')}/>
              </Div>
            </Row>
            <br/>
            <Row>
              <Div><label>Выбрать отчет:</label></Div>
              {reportsList}
            </Row>
            <br/>
            <Row>
              <Button disabled={!!!this.state.report_ids.length} onClick={this.handleSubmit.bind(this)}>Выгрузить</Button>
              <input
                  style={{marginRight:"5px", marginLeft:"10px"}}
                  type="checkbox"
                  disabled={this.state.company_ids.length > 1}
                  checked={this.state.transcript}
                  onChange={this.handleChange.bind(this, 'transcript', !this.state.transcript)} />
              <span style={{color: this.state.company_ids.length > 1 ? "grey" : "black"}}>c расшифровкой</span>
            </Row>
          </Col>
          <Col md={5}>
            <Div>
              <Field type="select" label="Учреждение"
                  multi={true}
                  options={COMPANY}
                  value={this.state.company_ids.join(',')}
                  onChange={this.handleChange.bind(this, 'company_ids')}/>
                <Div style={{marginLeft: "-9px", marginTop: "8px"}}>
                <input
                    style={{marginRight:"5px", marginLeft:"10px"}}
                    type="checkbox"
                    onChange={this.handleCheckbox.bind(this)} />
                <span>Выбрать все</span>
              </Div>
            </Div>
          </Col>
          <Col md={2} />
        </Div>
      </div>
    );
  }
}

Analytics.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(Analytics, ['reports', 'objects']);
