import * as React from 'react';
import { Button, Row, Col } from 'react-bootstrap';

import { IStateEmployeeEfficiencyReport } from './@types/EmployeeEfficiencyReport.h';

import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { bindable } from 'utils/decorators';

const DatePicker: any = bindable(Datepicker);

interface IPropsEmployeeEfficiencyReportHeader {
  date_start: string | Date;
  date_end: string | Date;
  readOnly: boolean;
  onChange(field: string, value: any);
  onClick(e: any): void;
}

const EmployeeEfficiencyReportHeader: React.StatelessComponent<IPropsEmployeeEfficiencyReportHeader> = (
  { date_end, date_start, onChange, onClick, readOnly },
) => (
  <Div>
    <Row>
      <Col md={4} />
      <Col md={4}>
        <Div><label>Период формирования</label></Div>
        <Div className="inline-block reports-date">
          <DatePicker
            date={date_start}
            onChange={onChange}
            bindOnChange={'date_start'}
            disabled={readOnly}
          />
        </Div>
        <Div className="inline-block reports-date">
          <DatePicker
            date={date_end}
            onChange={onChange}
            bindOnChange={'date_end'}
            disabled={readOnly}
          />
        </Div>
      </Col>
      <Col md={4} style={{ marginTop: 28, textAlign: 'right' }}>
        {!readOnly && <Button bsSize="small" onClick={onClick}>Сформировать отчет</Button>}
      </Col>
    </Row>
  </Div>
);

export { EmployeeEfficiencyReportHeader };
