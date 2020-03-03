import * as React from 'react';
import { get } from 'lodash';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import useEmployeeFullNameOptions from 'components/new/utils/hooks/services/useOptions/useEmployeeFullNameOptions';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillAccompanyingPersonIdOwnProps = {
  fieldData: any;
  formDataKey: any;
};

const FieldWaybillAccompanyingPersonId: React.FC<FieldWaybillAccompanyingPersonIdOwnProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, clearable, key },
    } = props;

    const { path } = useForm.useFormDataMeta<Waybill>(props.formDataKey);
    const accompanying_person_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['accompanying_person_id']>(props.formDataKey, key);
    const accompanying_person_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['accompanying_person_name']>(props.formDataKey, 'accompanying_person_name');
    const formErrors = useForm.useFormDataFormErrors<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const {
      isLoading,
      options,
    } = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'employee'>(
      props.formDataKey,
      'employee',
      useEmployeeFullNameOptions(),
    );

    const handleChangeWrap = React.useCallback(
      (value, option) => {
        handleChange({
          accompanying_person_id: value,
          accompanying_person_name: get(option, 'rowData.full_name', null),
        });
      },
      [key, handleChange],
    );
    const isDisabled = (
      !isPermitted
      || IS_CLOSE_OR_IS_ACTIVE
    );
    return (
      <EtsBootstrap.Col md={props.fieldData.md || 12}>
        {
          !isDisabled
            ? (
              <ExtField
                id={`${path}_${key}`}
                type="select"
                label={title}
                value={accompanying_person_id}
                error={formErrors[key]}
                options={options}
                onChange={handleChangeWrap}
                clearable={clearable}

                etsIsLoading={isLoading}
              />
            )
            : (
              <ExtField
                id={`${path}_${key}`}
                type="string"
                label={title}
                value={accompanying_person_name ? accompanying_person_name : 'Не выбран'}
                disabled
              />
            )
        }
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillAccompanyingPersonId;
