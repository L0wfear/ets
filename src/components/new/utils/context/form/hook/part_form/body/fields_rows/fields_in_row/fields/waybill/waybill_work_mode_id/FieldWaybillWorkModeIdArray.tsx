import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import useWorkModeOptions from 'components/new/utils/hooks/services/useOptions/useWorkModeOptionsOptions';

type FieldWaybillWorkModeIdArrayProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillWorkModeIdArray: React.FC<FieldWaybillWorkModeIdArrayProps> = React.memo(
  (props) => {
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);

    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);

    const { work_mode_name } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

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

    return React.useMemo(
      () => {
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
      [
        props.md,
        work_mode_name,
        path,
        IS_CLOSE_OR_IS_ACTIVE,
        isPermitted,
        optionsData,
        handleChangeWrap,
      ],
    );
  },
);

export default FieldWaybillWorkModeIdArray;
