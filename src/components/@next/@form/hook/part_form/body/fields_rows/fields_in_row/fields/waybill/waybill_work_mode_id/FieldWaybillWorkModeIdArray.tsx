import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import useWorkModeOptions from 'components/new/utils/hooks/services/useOptions/useWorkModeOptionsOptions';

type FieldWaybillWorkModeIdArrayProps = {
  formDataKey: any;
  md?: number;
};

const FieldWaybillWorkModeIdArray: React.FC<FieldWaybillWorkModeIdArrayProps> = React.memo(
  (props) => {
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);

    const { path } = useForm.useFormDataMeta<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);

    const work_mode_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['work_mode_name']>(props.formDataKey, 'work_mode_name');

    const optionsData = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'workModeOptions'>(
      props.formDataKey,
      'workModeOptions',
      useWorkModeOptions(),
    );

    const handleChangeWrap = React.useCallback(
      (keyName: string, value: Waybill['work_mode_id'], option) => {
        handleChange({
          [keyName]: value,
        });
      },
      [],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_work_mode_id`}
          type="select"
          clearable
          label="Режим работы"
          disabled={IS_CLOSE_OR_IS_ACTIVE || !isPermitted}
          value={work_mode_name}
          options={optionsData.options}
          etsIsLoading={optionsData.isLoading}
          onChange={handleChangeWrap}
          boundKeys="work_mode_id"
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillWorkModeIdArray;
