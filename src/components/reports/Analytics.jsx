import React, { Component } from 'react';
import Div from 'components/ui/Div.jsx';
import { Button, Row, Col } from 'react-bootstrap';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday9am, getTomorrow9am, makeDate } from 'utils/dates';
import { saveData } from 'utils/functions';
import { connectToStores, FluxContext } from 'utils/decorators';

@connectToStores(['reports', 'objects'])
@FluxContext
export default class Analytics extends Component {

  constructor(props) {
    super(props);

    const [date_from, date_to] = [getToday9am(), getTomorrow9am()];

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
      date_to,
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getOrganizations();
  }

  handleSubmit() {
    const { flux } = this.context;

    const reportName = this.state.report_ids.length === 1 ? this.reports[this.state.report_ids[0]] : 'Отчет';

    const dateName = makeDate(this.state.date_from) + '-' + makeDate(this.state.date_to);
    flux.getActions('reports').getAnalytics(this.state)
      .then(({ blob, fileName }) => {
        saveData(blob, fileName);
      });
  }

  handleChange(field, value) {
    if (field === 'report_ids') {
      const { report_ids } = this.state;
      const id = parseFloat(value);
      const index = report_ids.indexOf(id);
      index === -1 ? report_ids.push(id) : report_ids.splice(index, 1);

      this.setState({ report_ids });
    } else if (field === 'company_ids') {
      let { company_ids, transcript } = this.state;
      company_ids = value ? ('' + value).split(',') : [];
      company_ids = company_ids.map(e => parseFloat(e));
      if (company_ids.length > 1) transcript = false;
      this.setState({ company_ids, transcript });
    } else {
      this.setState({ [field]: value });
    }
  }

  handleCheckbox(e) {
    let value;
    if (e.target.checked) {
      const { organizations } = this.props;
      value = organizations.map(e => e.id).join(',');
    } else {
      value = '';
    }
    this.handleChange('company_ids', value);
  }

  render() {
    const { organizations } = this.props;

    const reportsList = this.reports.map((e, i) => {
      return (<div key={e + i}><input
        style={{ marginRight: '10px' }}
        type="checkbox"
        checked={this.state.report_ids.indexOf(i) + 1}
        onChange={this.handleChange.bind(this, 'report_ids', i)}
      />{e}<br /></div>);
    });

    const COMPANY = organizations && organizations.map(({ company_id, company_name }) => ({ value: company_id, label: company_name }));

    return (
      <div className="ets-page-wrap">
        <Div>
          <Col md={1} />
          <Col md={4}>
            <Row>
              <Div><label>Период формирования:</label></Div>
              <Div className="inline-block reports-date">
                <Datepicker date={this.state.date_from} onChange={this.handleChange.bind(this, 'date_from')} />
              </Div>
              <Div className="inline-block reports-date">
                <Datepicker date={this.state.date_to} onChange={this.handleChange.bind(this, 'date_to')} />
              </Div>
            </Row>
            <br />
            <Row>
              <Div><label>Выбрать отчет:</label></Div>
              {reportsList}
            </Row>
            <br />
            <Row>
              <Button disabled={!!!this.state.report_ids.length} onClick={this.handleSubmit.bind(this)}>Выгрузить</Button>
              <input
                style={{ marginRight: '5px', marginLeft: '10px' }}
                type="checkbox"
                disabled={this.state.company_ids.length > 1}
                checked={this.state.transcript}
                onChange={this.handleChange.bind(this, 'transcript', !this.state.transcript)}
              />
              <span style={{ color: this.state.company_ids.length > 1 ? 'grey' : 'black' }}>c расшифровкой</span>
            </Row>
          </Col>
          <Col md={5}>
            <Div>
              <Field type="select" label="Учреждение"
                multi
                options={COMPANY}
                value={this.state.company_ids.join(',')}
                onChange={this.handleChange.bind(this, 'company_ids')}
              />
                <Div style={{ marginLeft: '-9px', marginTop: '8px' }}>
                <input
                  style={{ marginRight: '5px', marginLeft: '10px' }}
                  type="checkbox"
                  onChange={this.handleCheckbox.bind(this)}
                />
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
