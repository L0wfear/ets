import * as React from 'react';
import { get } from 'lodash';
import { Col } from 'react-bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import useEmployeeFullNameOptions from 'components/new/utils/hooks/services/useOptions/useEmployeeFullNameOptions';
import { FieldDataWaybillAccompanyingPersonId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';

type FieldWaybillAccompanyingPersonIdOwnProps = {
  fieldData: FieldDataWaybillAccompanyingPersonId;
  formDataKey: string;
};

const FieldWaybillAccompanyingPersonId: React.FC<FieldWaybillAccompanyingPersonIdOwnProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, clearable, key },
    } = props;

    const path = useForm.useFormDataSchemaPath<Waybill>(props.formDataKey);
    const formState = useForm.useFormDataFormState<Waybill>(props.formDataKey);
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

    return React.useMemo(
      () => {
        const isDisabled = (
          !isPermitted
          || IS_CLOSE_OR_IS_ACTIVE
        );

        return (
          <Col md={props.fieldData.md || 12}>
            {
              !isDisabled
                ? (
                  <ExtField
                    id={`${path}_${key}`}
                    type="select"
                    label={title}
                    value={formState[key]}
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
                    value={formState.accompanying_person_name ? formState.accompanying_person_name : 'Не выбран'}
                    disabled
                  />
                )
            }
          </Col>
        );
      },
      [
        props,
        path,
        key,
        clearable,
        title,
        formState[key],
        IS_CLOSE_OR_IS_ACTIVE,
        formErrors[key],
        options,
        handleChangeWrap,
        isPermitted,
      ],
    );
  },
);

export default FieldWaybillAccompanyingPersonId;
