import * as React from 'react';
import * as PropTypes from 'prop-types';

import Div from 'components/ui/Div';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  oldReportGetAnalytics,
} from 'components/coverage_reports/redux-main/modules/old-report/actions-old_report';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import Field from 'components/ui/Field';
import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am } from 'utils/dates';
import { saveData } from 'utils/functions';
import { connectToStores, FluxContext } from 'utils/decorators';

import {
  EtsPageWrap,
} from 'global-styled/global-styled';

const page = 'analytics';

@connectToStores(['objects'])
@FluxContext
class Analytics extends React.Component {
  static propTypes = {
    organizations: PropTypes.array.isRequired,
    oldReportGetAnalytics: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.reports = [
      'Маршруты',
      'Задания',
      'Путевые листы',
      'Транспортные средства',
      'Работники',
      'Расход топлива',
      'Наряд - задания',
    ];

    this.state = {
      report_ids: [],
      companies_ids: [],
      transcript: false,
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
    };
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getOrganizations();
  }

  handleSubmit() {
    const state = {
      ...this.state,
      companies_ids: this.state.companies_ids.length === 0 ? null : this.state.companies_ids,
    };

    this.props.oldReportGetAnalytics(state)
      .then(({ blob, fileName }) => {
        if (blob && fileName) {
          saveData(blob, fileName);
        }
      });
  }

  handleChange(field, value) {
    if (field === 'report_ids') {
      const { report_ids } = this.state;
      const id = parseFloat(value);
      const index = report_ids.indexOf(id);
      if (index === -1) {
        report_ids.push(id);
      } else {
        report_ids.splice(index, 1);
      }

      this.setState({ report_ids });
    } else if (field === 'companies_ids') {
      let { companies_ids, transcript } = this.state;
      companies_ids = value ? (`${value}`).split(',') : [];
      companies_ids = companies_ids.map(e => parseFloat(e));
      if (companies_ids.length > 1) transcript = false;
      this.setState({ companies_ids, transcript });
    } else {
      this.setState({ [field]: value });
    }
  }

  handleCheckbox(e) {
    let value;
    if (e.target.checked) {
      const { organizations } = this.props;
      value = organizations.map(el => el.id).join(',');
    } else {
      value = '';
    }
    this.handleChange('companies_ids', value);
  }

  render() {
    const { organizations } = this.props;

    const reportsList = this.reports.map((e, i) => (
      <div key={e + i}>
        <input
          style={{ marginRight: '10px' }}
          type="checkbox"
          checked={this.state.report_ids.indexOf(i) + 1}
          onChange={this.handleChange.bind(this, 'report_ids', i)}
        />
        {e}
        <br />
      </div>
    ));

    const COMPANY = organizations && organizations.map(({ company_id, company_name }) => ({ value: company_id, label: company_name }));

    return (
      <EtsPageWrap>
        <Div>
          <Col mdOffset={1} md={4}>
            <Row>
              <Div><label>Период формирования:</label></Div>
              <Div className="inline-block reports-date">
                <DatePicker date={this.state.date_from} onChange={this.handleChange.bind(this, 'date_from')} />
              </Div>
              <Div className="inline-block reports-date">
                <DatePicker date={this.state.date_to} onChange={this.handleChange.bind(this, 'date_to')} />
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
                disabled={this.state.companies_ids.length > 1}
                checked={this.state.transcript}
                onChange={this.handleChange.bind(this, 'transcript', !this.state.transcript)}
              />
              <span style={{ color: this.state.companies_ids.length > 1 ? 'grey' : 'black' }}>c расшифровкой</span>
            </Row>
          </Col>
          <Col md={5}>
            <Div>
              <Field
                type="select"
                label="Учреждение"
                multi
                options={COMPANY}
                value={this.state.companies_ids.join(',')}
                onChange={this.handleChange.bind(this, 'companies_ids')}
              />
            </Div>
          </Col>
          <Col md={2} />
        </Div>
      </EtsPageWrap>
    );
  }
}


export default compose(
  withPreloader({
    page,
    typePreloader: 'mainpage',
  }),
  connect(
    null,
    dispatch => ({
      oldReportGetAnalytics: data => (
        dispatch(oldReportGetAnalytics(data, { page }))
      ),
    }),
  ),
)(Analytics);
