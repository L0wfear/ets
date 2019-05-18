import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillWorkModeId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillWorkModeIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillWorkModeId;
};

const FieldWaybillWorkModeId: React.FC<FieldWaybillWorkModeIdProps> = React.memo(
  (props) => {

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.fieldData.md || 12}>
            <ExtField
              type="select"
              label={`${props.fieldData.title}` || 'Режим работы'}
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

export default FieldWaybillWorkModeId;
