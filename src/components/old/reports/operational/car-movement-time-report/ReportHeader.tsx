import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getToday0am, getDateWithMoscowTz, createValidDateTime, diffDates } from 'components/@next/@utils/dates/dates';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import { ReduxState } from 'redux-main/@types/state';
import { getCompanyState } from 'redux-main/reducers/selectors/index';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import companyActions from 'redux-main/reducers/modules/company/actions';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types/index';
import DatePickerRange from 'components/new/ui/date_picker/DatePickerRange';

const page = 'car-movement-time-report';

interface IPropsMissionProgressReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: any;
  company_id: null | number;
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof companyActions.actionGetAndSetInStoreCompany>;
  companyList: IStateCompany['companyList'];
}

class MissionProgressReportHeader extends React.Component<IPropsMissionProgressReportHeader, any> {
  async componentDidMount() {
    const { data: [company] } = await this.props.actionGetAndSetInStoreCompany(
      {},
      { page },
    );

    if (company) {
      const { company_id } = this.getState();
      if (!company_id) {
        this.props.handleChange('company_id', company.company_id);
      }
    }
  }
  getState() {
    const date_end_temp: Date = getDateWithMoscowTz();
    date_end_temp.setSeconds(0);

    const {
      date_start = getToday0am(),
      date_end = date_end_temp,
      company_id = null,
    } = this.props;

    return {
      date_start,
      date_end,
      company_id,
    };
  }
  handleChangeDateEnd = (field, value) => (
    this.props.handleChange(field, value ? createValidDateTime(value) : value)
  )

  handleSubmit = () => {
    const {
      date_start,
      date_end,
      company_id,
    } = this.getState();

    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      company_id,
    });
  }
  render() {
    const {
      readOnly,
      companyList,
    } = this.props;

    const {
      date_start,
      date_end,
      company_id,
    } = this.getState();

    let errorMes = '';
    const diffDate = diffDates(date_end, date_start, 'days');
    if (diffDate > 1) {
      errorMes = 'Период отчёта должен составлять менее суток';
    }
    if (diffDate <= 0) {
      errorMes = 'Дата окончания периода должна быть позже даты начала';
    }

    const companyOptions = companyList.map(({ company_id: value, short_name }) => ({ value, label: short_name }));

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={6}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <label htmlFor=" ">Период формирования</label>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <DatePickerRange
            date_start_id="date_start"
            date_start_value={date_start}
            date_start_error={errorMes}
            date_end_id="date_end"
            date_end_value={date_end}

            disabled={readOnly}
            onChange={this.props.handleChange}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <label>Организация</label>
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                clearable={false}
                label={false}
                value={company_id}
                options={companyOptions}
                disabled={readOnly}
                onChange={this.props.handleChange}
                boundKeys="company_id"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <EtsBootstrap.Button
                block
                disabled={this.props.readOnly || !!errorMes || !company_id}
                onClick={this.handleSubmit}
              >
                Сформировать отчёт
              </EtsBootstrap.Button>
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default compose<any, any>(
  withPreloader({
    page,
    typePreloader: 'mainpage',
  }),
  connect<any, { actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof companyActions.actionGetAndSetInStoreCompany> }, any, ReduxState>(
    (state) => ({
      companyList: getCompanyState(state).companyList,
    }),
    (dispatch: any) => ({
      actionGetAndSetInStoreCompany: (...arg) => (
        dispatch(
          companyActions.actionGetAndSetInStoreCompany(...arg),
        )
      ),
    }),
  ),
  ReportHeaderWrapper,
)(MissionProgressReportHeader);
