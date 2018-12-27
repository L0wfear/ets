import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday0am, getDateWithMoscowTz, createValidDateTime, diffDates } from 'utils/dates';
import { bindable, FluxContext } from 'utils/decorators';
import { connectToStores } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePickerBindable: any = bindable(DatePicker);

interface IPropsMissionProgressReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: any;
  company_id: null | number;
  companies: any;
}

@connectToStores(['objects'])
@FluxContext
class MissionProgressReportHeader extends React.Component<IPropsMissionProgressReportHeader, any> {
  context!: ETSCore.LegacyContext;

  componentDidMount() {
    this.context.flux.getActions('objects').getCompanies().then(({ result: [company] }) => {
      if (company) {
        const { company_id } = this.getState();
        if (!company_id) {
          this.props.handleChange('company_id', company.company_id);
        }
      }
    });
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
    const { readOnly, companies } = this.props;

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

    const companyOptions = companies.map(({ company_id: value, short_name }) => ({ value, label: short_name }));

    return (
      <div>
        <Row className="report-page__header car-movement-time-report">
          <Col md={6}>
            <Col md={12}>
              <label>Период формирования</label>
            </Col>
            <Col md={6}>
              <DatePickerBindable
                date={date_start}
                onChange={this.props.handleChange}
                bindOnChange={'date_start'}
                disabled={readOnly}
              />
            </Col>
            <Col md={6}>
              <DatePickerBindable
                date={date_end}
                onChange={this.handleChangeDateEnd}
                bindOnChange={'date_end'}
                disabled={readOnly}
              />
            </Col>
          </Col>
          <Col md={6}>
            <Col md={12}>
              <label>Организация</label>
            </Col>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
              <Button
                block
                disabled={this.props.readOnly || !!errorMes || !company_id}
                onClick={this.handleSubmit}
              >Сформировать отчёт</Button>
            </Col>
          </Col>
        </Row>
        <Row className="error">
          <Col md={12}>
            {errorMes}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReportHeaderWrapper(MissionProgressReportHeader);
