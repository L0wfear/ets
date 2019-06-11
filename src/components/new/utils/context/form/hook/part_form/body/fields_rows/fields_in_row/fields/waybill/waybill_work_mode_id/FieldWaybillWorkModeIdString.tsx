import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';

type FieldWaybillWorkModeIdStringProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillWorkModeIdString: React.FC<FieldWaybillWorkModeIdStringProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);

    const { work_mode_name } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          <EtsBootstrap.Col md={props.md || 12}>
            <ExtField
              id={`${path}_work_mode_id`}
              type="string"
              readOnly
              label="Режим работы"
              value={work_mode_name}
            />
          </EtsBootstrap.Col>
        );
      },
      [
        props.md,
        work_mode_name,
        path,
      ],
    );
  },
);

export default FieldWaybillWorkModeIdString;
