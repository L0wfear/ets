import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type FieldWaybillWorkModeIdStringProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillWorkModeIdString: React.FC<FieldWaybillWorkModeIdStringProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<Waybill>(props.formDataKey);

    const work_mode_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['work_mode_name']>(props.formDataKey, 'work_mode_name');

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
);

export default FieldWaybillWorkModeIdString;
