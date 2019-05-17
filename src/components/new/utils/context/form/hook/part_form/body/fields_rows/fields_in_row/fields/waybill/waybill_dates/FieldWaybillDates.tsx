import * as React from 'react';
import { FieldDataName } from 'components/new/utils/context/form/@types/fields/string';
import { Col, Row } from 'react-bootstrap';
import FieldWaybillPlanDates from './plan_dates/FieldWaybillPlanDates';
import FieldWaybillFactDates from './fact_dates/FieldWaybillFactDates';

type FieldWaybillDates = {
  fieldData: FieldDataName;
  formDataKey: string;
};

const FieldWaybillDates: React.FC<FieldWaybillDates> = React.memo(
  (props) => {
    return React.useMemo(
      () => {
        return (
          <Col md={props.fieldData.md}>
            <Row>
              <Col md={12}>
                <FieldWaybillPlanDates formDataKey={props.formDataKey} />
              </Col>
              <Col md={12}>
                <FieldWaybillFactDates formDataKey={props.formDataKey} />
              </Col>
            </Row>
          </Col>
        );
      },
      [props],
    );
  },
);

export default FieldWaybillDates;
