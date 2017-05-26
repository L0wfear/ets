import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import Div from 'components/ui/Div.jsx';
import FieldComponent from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getToday859am, getYesterday9am , createValidDateTime } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';

const DatePicker: any = bindable(Datepicker);
const Field: any = bindable(FieldComponent);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_start: Date;
  date_end: Date;
  object_type: string;
}

// TODO поправить на получение типов из специального сервиса
const OBJECTS = [{ value: 'odh', label: 'Объект дорожного хозяйства' }, { value: 'dt', label: 'Дворовая территория' }];

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  getState() {
    const {
      date_start = getYesterday9am(),
      date_end = getToday859am(),
      object_type = 'dt',
    } = this.props;

    return {
      date_start,
      date_end,
      object_type,
    };
  }
  handleSubmit = () => {
    const {
      date_start,
      date_end,
      object_type,
    } = this.getState();


    this.props.onClick({
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
      object_type,
    });
  }
  render() {
    const { readOnly } = this.props;
    const {
      date_start,
      date_end,
      object_type,
    } = this.getState();

    return (
      <Div>
        <Row>
          <Col md={4}>
            <Field
              type="select"
              label="Объекты"
              options={OBJECTS}
              value={object_type}
              bindOnChange={'object_type'}
              onChange={this.props.handleChange}
              clearable={false}
              disabled={readOnly}
            />
          </Col>
          <Col md={4}>
            <Div><label htmlFor=" ">Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date_start}
                onChange={this.props.handleChange}
                bindOnChange={'date_start'}
                disabled={readOnly}
              />
            </Div>
            <Div className="inline-block reports-date">
              <DatePicker
                date={date_end}
                onChange={this.props.handleChange}
                bindOnChange={'date_end'}
                disabled={readOnly}
              />
            </Div>
          </Col>
          <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
            <Button
              bsSize="small"
              onClick={this.handleSubmit}
              disabled={readOnly}
            >Сформировать отчет</Button>
          </Col>
        </Row>
      </Div>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
