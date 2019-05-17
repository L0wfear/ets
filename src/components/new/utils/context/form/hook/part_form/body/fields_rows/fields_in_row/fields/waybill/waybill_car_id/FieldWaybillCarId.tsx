import * as React from 'react';
import { Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';

type FieldWaybillCarIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillCarId;
};

const FieldWaybillCarId: React.FC<FieldWaybillCarIdProps> = React.memo(
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

export default FieldWaybillCarId;
