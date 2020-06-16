import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Div from 'components/old/ui/Div';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { oldReportGetAnalytics } from 'components/old/coverage_reports/redux-main/modules/old-report/actions-old_report';
import companyActions from 'redux-main/reducers/modules/company/actions';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import Field from 'components/@next/@ui/renderFields/Field';
import {
  getToday9am,
  getTomorrow9am,
} from 'components/@next/@utils/dates/dates';
import { saveData } from 'utils/functions';

import { EtsPageWrap } from 'global-styled/global-styled';
import { getCompanyState } from 'redux-main/reducers/selectors';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { Company } from 'redux-main/reducers/modules/company/@types';
import { ReduxState } from 'redux-main/@types/state';

const page = 'analytics';

type OwnProps = {
};
type StateProps = {
  companyList: Array<Company>;
};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type Props = (
  OwnProps
  & StateProps
  & DispatchProps
);

class Analytics extends React.Component<Props, any> {
  reports = [
    'Маршруты (действующие)',
    'Задания',
    'Путевые листы',
    'Транспортные средства',
    'Работники',
    'Расход топлива',
    'Наряд - задания',
    'Топливные карты',
  ];

  constructor(props) {
    super(props);

    this.state = {
      report_ids: [],
      companies_ids: [],
      transcript: false,
      date_from: getToday9am(),
      date_to: getTomorrow9am(),
    };
  }

  componentDidMount() {
    this.props.dispatch(
      companyActions.actionGetAndSetInStoreCompany({}, { page }),
    );

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

  handleSubmit = () => {
    const state = {
      ...this.state,
      companies_ids:
        this.state.companies_ids.length === 0 ? null : this.state.companies_ids,
    };

    this.props.dispatch(
      oldReportGetAnalytics(state, { page }),
    ).then(({ blob, fileName }) => {
      if (blob && fileName) {
        saveData(blob, fileName);
      }
    });
  };

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

    const COMPANY = companyList.map(({ company_id, short_name }) => ({
      value: company_id,
      label: short_name,
    }));

    return (
      <EtsPageWrap>
        <Div>
          <EtsBootstrap.Col mdOffset={1} md={4}>
            <EtsBootstrap.Row>
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
            </EtsBootstrap.Row>
            <br />
            <EtsBootstrap.Row>
              <Div>
                <label>Выбрать отчет:</label>
              </Div>
              {reportsList}
            </EtsBootstrap.Row>
            <br />
            <EtsBootstrap.Row>
              <EtsBootstrap.Button
                disabled={!this.state.report_ids.length}
                onClick={this.handleSubmit}>
                Выгрузить
              </EtsBootstrap.Button>
              <input
                style={{ marginRight: '5px', marginLeft: '10px' }}
                type="checkbox"
                checked={this.state.transcript}
                onChange={this.handleChange.bind(
                  this,
                  'transcript',
                  !this.state.transcript,
                )}
              />
              <span>
                с расшифровкой
              </span>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={5}>
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
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={2} />
        </Div>
      </EtsPageWrap>
    );
  }
}

export default compose<Props, OwnProps>(
  withPreloader<OwnProps>({
    page,
    typePreloader: 'mainpage',
  }),
  connect<StateProps, DispatchProps, OwnProps, ReduxState>(
    (state) => ({
      companyList: getCompanyState(state).companyList,
    }),
  ),
)(Analytics);
