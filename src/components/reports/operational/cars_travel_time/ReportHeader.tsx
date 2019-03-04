import * as React from 'react';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';
import * as Button from 'react-bootstrap/lib/Button';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';

import DatePicker from 'components/ui/input/date-picker/DatePicker';
import { getYesterdayYesterday0am, createValidDate, diffDates, getToday0am, getYesterday2359 } from 'utils/dates';
import { bindable } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import Div from 'components/ui/Div';
import { ErrorDiv } from './styled';

const DatePickerBindable: any = bindable(DatePicker);

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  date_from: string;
  date_to: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  state = {
    error: '',
  };

  static getDerivedStateFromProps(nextProps) {
    const {
      date_from = getYesterdayYesterday0am(),
      date_to = getYesterday2359(),
    } = nextProps;

    const diffDate = diffDates(date_to, date_from, 'days');
    const diffDateEnd = diffDates(date_to, getToday0am(), 'days');
    const diffDateStart = diffDates(date_from, getToday0am(), 'days');

    if (diffDate < 0) {
      return {
        error: 'Дата окончания не может быть меньше даты начала',
      };
    }

    if (diffDateEnd >= 0 || diffDateStart >= 0) {
      return {
        error: 'При выборе даты периода отчета нельзя выбирать текущие и будущие дни',
      };
    }

    return {
      error: '',
    };
  }
  handleSubmit = () => {
    const {
      date_from = getYesterdayYesterday0am(),
      date_to = getYesterday2359(),
    } = this.props;

    this.props.onClick({
      date_from: createValidDate(date_from),
      date_to: createValidDate(date_to),
    });
  }
  render() {
    const {
      readOnly,
      date_from = getYesterdayYesterday0am(),
      date_to = getYesterday2359(),
    } = this.props;

    const { error } = this.state;

    return (
      <Row className="report-page__header">
        <Col mdOffset={4} md={4}>
          <Div><label htmlFor=" ">Период формирования</label></Div>
          <Div className="inline-block reports-date">
            <DatePickerBindable
              date={date_from}
              time={false}
              onChange={this.props.handleChange}
              bindOnChange={'date_from'}
              disabled={readOnly}
            />
          </Div>
          <Div className="inline-block reports-date">
            <DatePickerBindable
              date={date_to}
              time={false}
              onChange={this.props.handleChange}
              bindOnChange={'date_to'}
              disabled={readOnly}
            />
          </Div>
          <ErrorDiv className="error">{error}</ErrorDiv>
        </Col>
        <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
          <Button
            disabled={this.props.readOnly || Boolean(error)}
            onClick={this.handleSubmit}
          >Сформировать отчёт</Button>
        </Col>
      </Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
