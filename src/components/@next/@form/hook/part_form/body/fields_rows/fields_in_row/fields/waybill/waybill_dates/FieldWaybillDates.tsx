import * as React from 'react';
import FieldWaybillPlanDates from './plan_dates/FieldWaybillPlanDates';
import FieldWaybillFactDates from './fact_dates/FieldWaybillFactDates';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillDates = {
  md?: number;
  formDataKey: string;
};

const FieldWaybillDates: React.FC<FieldWaybillDates> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <FieldWaybillPlanDates formDataKey={props.formDataKey} />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <FieldWaybillFactDates formDataKey={props.formDataKey} />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillDates;
