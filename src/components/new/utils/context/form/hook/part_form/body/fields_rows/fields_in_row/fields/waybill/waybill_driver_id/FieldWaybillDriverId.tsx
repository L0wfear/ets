import * as React from 'react';
import { Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillDriverId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';

type FieldWaybillDriverIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillDriverId;
};

const FieldWaybillDriverId: React.FC<FieldWaybillDriverIdProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <Col md={props.fieldData.md || 12}>
            <ExtField
              type="select"
              label={`${props.fieldData.title || 'Водитель'} (возможен поиск по табельному номеру)` || ''}
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

export default FieldWaybillDriverId;
