import * as React from 'react';
import * as PropTypes from 'prop-types';

import Div from 'components/ui/Div';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import { oldReportGetAnalytics } from 'components/coverage_reports/redux-main/modules/old-report/actions-old_report';
import companyActions from 'redux-main/reducers/modules/company/actions';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import { connect } from 'react-redux';
import { compose } from 'recompose';

import Field from 'components/ui/Field';
import { getToday9am, getTomorrow9am } from 'utils/dates';
import { saveData } from 'utils/functions';

import { EtsPageWrap } from 'global-styled/global-styled';
import { getCompanyState } from 'redux-main/reducers/selectors';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

const page = 'analytics';

class Analytics extends React.Component {
  static propTypes = {
    companyList: PropTypes.array.isRequired,
    oldReportGetAnalytics: PropTypes.func.isRequired,
    actionGetAndSetInStoreCompany: PropTypes.func.isRequired,
  };

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
    this.props.actionGetAndSetInStoreCompany({}, { page });

    const etsName = __DEVELOPMENT__
      ? `__ETS::${process.env.STAND.toUpperCase()}__`
      : 'ЕТС';
    if (document) {
      document.title = `${etsName} Аналитика`;
    }
  }

  componentWillUnmount() {
    const etsName = __DEVELOPMENT__
      ? `__ETS::${process.env.STAND.toUpperCase()}__`
      : 'ЕТС';

    if (document) {
      document.title = etsName;
    }
  }

  handleSubmit() {
    const state = {
      ...this.state,
      companies_ids:
        this.state.companies_ids.length === 0 ? null : this.state.companies_ids,
    };

    this.props.oldReportGetAnalytics(state).then(({ blob, fileName }) => {
      if (blob && fileName) {
        saveData(blob, fileName);
      }
    });
  }

  handleChange = (field, value) => {
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
      companies_ids = value;
      if (companies_ids.length > 1) transcript = false;
      this.setState({ companies_ids, transcript });
    } else {
      this.setState({ [field]: value });
    }
  };

  render() {
    const { companyList } = this.props;

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

    const COMPANY = companyList.map(({ company_id, company_name }) => ({
      value: company_id,
      label: company_name,
    }));

    return (
      <EtsPageWrap>
        <Div>
          <Col mdOffset={1} md={4}>
            <Row>
              <Div>
                <label>Период формирования:</label>
              </Div>
              <DatePickerRange
                date_start_id="date_from"
                date_start_value={this.state.date_from}
                date_end_id="date_to"
                date_end_value={this.state.date_to}
                onChange={this.handleChange}
              />
            </Row>
            <br />
            <Row>
              <Div>
                <label>Выбрать отчет:</label>
              </Div>
              {reportsList}
            </Row>
            <br />
            <Row>
              <Button
                disabled={!this.state.report_ids.length}
                onClick={this.handleSubmit.bind(this)}>
                Выгрузить
              </Button>
              <input
                style={{ marginRight: '5px', marginLeft: '10px' }}
                type="checkbox"
                disabled={this.state.companies_ids.length > 1}
                checked={this.state.transcript}
                onChange={this.handleChange.bind(
                  this,
                  'transcript',
                  !this.state.transcript,
                )}
              />
              <span
                style={{
                  color: this.state.companies_ids.length > 1 ? 'grey' : 'black',
                }}>
                c расшифровкой
              </span>
            </Row>
          </Col>
          <Col md={5}>
            <Div>
              <Field
                type="select"
                label="Учреждение"
                multi
                options={COMPANY}
                value={this.state.companies_ids}
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
    (state) => ({
      companyList: getCompanyState(state).companyList,
    }),
    (dispatch) => ({
      oldReportGetAnalytics: (data) =>
        dispatch(oldReportGetAnalytics(data, { page })),
      actionGetAndSetInStoreCompany: (...arg) =>
        dispatch(companyActions.actionGetAndSetInStoreCompany(...arg)),
    }),
  ),
)(Analytics);
