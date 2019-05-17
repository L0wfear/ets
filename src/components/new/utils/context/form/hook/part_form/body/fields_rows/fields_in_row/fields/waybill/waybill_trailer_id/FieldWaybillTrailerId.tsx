import * as React from 'react';
import { Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillTrailerId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';

type FieldWaybillTrailerIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillTrailerId;
};

const FieldWaybillTrailerId: React.FC<FieldWaybillTrailerIdProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <Col md={props.fieldData.md || 12}>
            <ExtField
              type="select"
              label={`${props.fieldData.title} (поиск по рег. номер  ТС)`}
              value={null}
              options={[]}
            />
          </Col>
        );
      },
      [props],
    );
  },
);

export default FieldWaybillTrailerId;
