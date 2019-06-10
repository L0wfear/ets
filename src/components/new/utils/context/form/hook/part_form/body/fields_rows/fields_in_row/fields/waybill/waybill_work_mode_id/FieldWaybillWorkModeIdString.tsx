import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { FieldDataWaybillWorkModeId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';

type FieldWaybillWorkModeIdStringProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillWorkModeId;
};

const FieldWaybillWorkModeIdString: React.FC<FieldWaybillWorkModeIdStringProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, key, md },
    } = props;

    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);

    const { work_mode_name } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={md || 12}>
            <ExtField
              id={`${path}_${key}`}
              type="string"
              readOnly
              label={`${title}` || 'Режим работы'}
              value={work_mode_name}
            />
          </EtsBootstrap.Col>
        );
      },
      [
        md,
        title,
        work_mode_name,
        key,
        path,
      ],
    );
  },
);

export default FieldWaybillWorkModeIdString;
