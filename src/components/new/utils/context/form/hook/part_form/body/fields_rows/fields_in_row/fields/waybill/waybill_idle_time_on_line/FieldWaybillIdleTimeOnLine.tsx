import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FieldDataDowntimeHoursWork, FieldDataDowntimeHoursDuty, FieldDataDowntimeHoursRepair, FieldDataDowntimeHoursDinner } from 'components/new/utils/context/form/@types/fields/string';
import FieldOnLineString from './field_on_line_string/FieldOnLineString';

type FieldWaybillIdleTimeOnLineProps = {
  formDataKey: string;
  md?: number;
};

const fieldDataDowntimeHoursWork: FieldDataDowntimeHoursWork = {
  key: 'downtime_hours_work',
  title: 'Работа',
  md: 6,
};
const fieldDataDowntimeHoursDuty: FieldDataDowntimeHoursDuty = {
  key: 'downtime_hours_duty',
  title: 'Дежурство',
  md: 6,
};
const fieldDataDowntimeHoursDinner: FieldDataDowntimeHoursDinner = {
  key: 'downtime_hours_dinner',
  title: 'Обед',
  md: 6,
};
const fieldDataDowntimeHoursRepair: FieldDataDowntimeHoursRepair = {
  key: 'downtime_hours_repair',
  title: 'Ремонт',
  md: 6,
};

const FieldWaybillIdleTimeOnLine: React.FC<FieldWaybillIdleTimeOnLineProps> = React.memo(
  (props) => {
    return React.useMemo(
      () => {
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
      [props],
    );
  },
);

export default FieldWaybillIdleTimeOnLine;
