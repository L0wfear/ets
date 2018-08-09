import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/Field.jsx';
import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getToday9am, getTomorrow9am, createValidDateTime, diffDates, addSecond } from 'utils/dates';
import { bindable, FluxContext } from 'utils/decorators';
import { connectToStores } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePickerBindable: any = bindable(DatePicker);

interface IPropsMissionProgressReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: string;
  date_end: string;
  company_id: null | number;
  organizations: any;
}

@connectToStores(['objects'])
@FluxContext
class MissionProgressReportHeader extends React.Component<IPropsMissionProgressReportHeader, any> {
  componentDidMount() {
    this.context.flux.getActions('objects').getOrganizations().then(({ result: [company] }) => {
      if (company) {
        this.props.handleChange('company_id', company.company_id)
      }
    });
  }
  getState() {
    const {
      date_start = getToday9am(),
      date_end = getTomorrow9am(59),
      company_id = null,
    } = this.props;

    return {
      date_start,
      date_end,
      company_id,
    };
  }
  handleChangeDateEnd = (field, value) => (
    this.props.handleChange(field, value ? createValidDateTime(addSecond(value, 59)) : value)
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
    const { readOnly, organizations } = this.props;

    const {
      date_start,
      date_end,
      company_id,
    } = this.getState();

    let errorMes = '';
    const diffDate = diffDates(date_end, date_start, 'days');
    if (diffDate > 1) {
      errorMes = 'Период отчёта должен составлять менее суток'
    }
    if (diffDate <= 0) {
      errorMes = 'Дата окончания периода должна быть позже даты начала';
    }

    const ORGANIZATIONS_OPTION = organizations.map(({ company_id, short_name }) => ({ value: company_id, label: short_name }));

    return (
      <div>
        <Row className="report-page__header">
          <Col md={12}>
            <Col md={6}>
              <label>Период формирования</label>
            </Col>
            <Col md={6}>
              <label>Организация</label>
            </Col>
          </Col>
          <Col md={12}>
            <Row>
              <Col md={3}>
                <DatePickerBindable
                  date={date_start}
                  onChange={this.props.handleChange}
                  bindOnChange={'date_start'}
                  disabled={readOnly}
                />
              </Col>
              <Col md={3}>
                <DatePickerBindable
                  date={date_end}
                  onChange={this.handleChangeDateEnd}
                  bindOnChange={'date_end'}
                  disabled={readOnly}
                />
              </Col>
              <Col md={3}>
                <ExtField
                  type="select"
                  clearable={false}
                  label={false}
                  value={company_id}
                  options={ORGANIZATIONS_OPTION}
                  disabled={readOnly}
                  onChange={this.props.handleChange}
                  boundKeys={['company_id']}
                />
              </Col>
              <Col md={3}>
                <Button
                  block
                  disabled={this.props.readOnly || !!errorMes || !company_id}
                  onClick={this.handleSubmit}
                >Сформировать отчёт</Button>
              </Col>

            </Row>
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
