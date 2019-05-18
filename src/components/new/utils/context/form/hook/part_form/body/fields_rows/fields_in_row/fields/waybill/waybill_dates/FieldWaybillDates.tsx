import * as React from 'react';
import { FieldDataName } from 'components/new/utils/context/form/@types/fields/string';
import FieldWaybillPlanDates from './plan_dates/FieldWaybillPlanDates';
import FieldWaybillFactDates from './fact_dates/FieldWaybillFactDates';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillDates = {
  fieldData: FieldDataName;
  formDataKey: string;
};

const FieldWaybillDates: React.FC<FieldWaybillDates> = React.memo(
  (props) => {
    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.fieldData.md}>
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
      [props],
    );
  },
);

export default FieldWaybillDates;
