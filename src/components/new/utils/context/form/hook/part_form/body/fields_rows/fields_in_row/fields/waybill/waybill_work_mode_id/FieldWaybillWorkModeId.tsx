import * as React from 'react';
import { Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillWorkModeId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';

type FieldWaybillWorkModeIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillWorkModeId;
};

const FieldWaybillWorkModeId: React.FC<FieldWaybillWorkModeIdProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <Col md={props.fieldData.md || 12}>
            <ExtField
              type="select"
              label={`${props.fieldData.title}` || 'Режим работы'}
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

export default FieldWaybillWorkModeId;
