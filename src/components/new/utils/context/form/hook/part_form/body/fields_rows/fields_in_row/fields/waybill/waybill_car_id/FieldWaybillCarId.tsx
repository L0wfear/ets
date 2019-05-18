import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillCarIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillCarId;
};

const FieldWaybillCarId: React.FC<FieldWaybillCarIdProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.fieldData.md || 12}>
            <ExtField
              type="select"
              label={`${props.fieldData.title} (поиск по рег. номер  ТС)`}
              value={null}
              options={[]}
            />
          </EtsBootstrap.Col>
        );
      },
      [props],
    );
  },
);

export default FieldWaybillCarId;
