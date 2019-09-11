import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import useStructureOptions from 'components/new/utils/hooks/services/useOptions/useStructureOptions';
import { FieldDataWaybillStuctureId } from 'components/@next/@form/@types/fields/waybill/valueOfArray';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import { getStructureAfterChageCar } from 'components/@next/@form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_structure_and_accompanying_person/structure/getStructureAfterChageCar';

type FieldWaybillStructureIdProps = {
  fieldData: FieldDataWaybillStuctureId;
  formDataKey: string;
};

const FieldWaybillStructureId: React.FC<FieldWaybillStructureIdProps> = React.memo(
  (props) => {
    const {
      fieldData: { title, clearable, key },
    } = props;

    const { path } = useForm.useFormDataMeta<Waybill>(props.formDataKey);
    const structure_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['structure_id']>(props.formDataKey, 'structure_id');
    const structure_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['structure_name']>(props.formDataKey, 'structure_name');
    const formErrors = useForm.useFormDataFormErrors<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);
    const selectedCarData = useWaybillFormData.useFormDataGetSelectedCar(props.formDataKey);

    const userData = etsUseSelector(
      (state) => getSessionState(state).userData,
    );
    const selectedCarDataPrev = usePrevious(selectedCarData);

    React.useEffect(
      () => {
        const newStructureData = getStructureAfterChageCar(selectedCarData, selectedCarDataPrev, userData);
        if (newStructureData) {
          handleChange(newStructureData);
        }
      },
      [selectedCarData, selectedCarDataPrev, userData, handleChange],
    );

    const {
      isLoading,
      options,
    } = useForm.useFormDataLoadOptions<WaybillFormStoreType, 'structure_id'>(
      props.formDataKey,
      'structure_id',
      useStructureOptions(),
    );

    const structurePickData = useWaybillFormData.useFormDataPickStructureData(
      options,
    );

    const handleChangeWrap = React.useCallback(
      (value, option) => {
        handleChange({
          structure_id: value,
          structure_name: get(option, 'rowData.name', null),
        });
      },
      [key, handleChange],
    );

    const isDisabled = (
      !isPermitted
      || IS_CLOSE_OR_IS_ACTIVE
      || structurePickData.STRUCTURE_FIELD_READONLY
    );

    return (
      structurePickData.STRUCTURE_FIELD_VIEW
        && (
          <EtsBootstrap.Col md={props.fieldData.md || 12}>
            {
              !isDisabled
                ? (
                  <ExtField
                    id={`${path}_${key}`}
                    type="select"
                    label={title}
                    value={structure_id}
                    error={formErrors[key]}
                    options={options}
                    onChange={handleChangeWrap}
                    clearable={clearable || structurePickData.STRUCTURE_FIELD_DELETABLE}

                    etsIsLoading={isLoading}
                  />
                )
                : (
                  <ExtField
                    id={`${path}_${key}`}
                    type="string"
                    label={title}
                    value={structure_name ? structure_name : 'Не выбрано'}
                    disabled
                  />
                )
            }
          </EtsBootstrap.Col>
        )
    );
  },
);

export default FieldWaybillStructureId;
