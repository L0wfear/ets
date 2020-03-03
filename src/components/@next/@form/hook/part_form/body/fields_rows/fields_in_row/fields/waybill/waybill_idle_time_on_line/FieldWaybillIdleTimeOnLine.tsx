import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import FieldOnLineString from './field_on_line_string/FieldOnLineString';

type FieldWaybillIdleTimeOnLineProps = {
  formDataKey: any;
  md?: number;
};

const fieldDataDowntimeHoursWork: any = {
  key: 'downtime_hours_work',
  title: 'Работа',
  md: 6,
};
const fieldDataDowntimeHoursDuty: any = {
  key: 'downtime_hours_duty',
  title: 'Дежурство',
  md: 6,
};
const fieldDataDowntimeHoursDinner: any = {
  key: 'downtime_hours_dinner',
  title: 'Обед',
  md: 6,
};
const fieldDataDowntimeHoursRepair: any = {
  key: 'downtime_hours_repair',
  title: 'Ремонт',
  md: 6,
};

const FieldWaybillIdleTimeOnLine: React.FC<FieldWaybillIdleTimeOnLineProps> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={8}>
            <h4>Простои на линии, ч.</h4>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldOnLineString
            formDataKey={props.formDataKey}
            fieldData={fieldDataDowntimeHoursWork}
          />
          <FieldOnLineString
            formDataKey={props.formDataKey}
            fieldData={fieldDataDowntimeHoursDuty}
          />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldOnLineString
            formDataKey={props.formDataKey}
            fieldData={fieldDataDowntimeHoursDinner}
          />
          <FieldOnLineString
            formDataKey={props.formDataKey}
            fieldData={fieldDataDowntimeHoursRepair}
          />
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillIdleTimeOnLine;
