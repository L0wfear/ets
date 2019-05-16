import * as React from 'react';
import { FieldDataName } from 'components/new/utils/context/form/@types/fields/string';
import { Col } from 'react-bootstrap';

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
            FieldWaybillDates
          </Col>
        );
      },
      [],
    );
  },
);

export default FieldWaybillDates;
