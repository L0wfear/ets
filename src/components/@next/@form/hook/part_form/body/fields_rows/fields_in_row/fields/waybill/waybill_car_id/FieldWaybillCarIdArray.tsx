import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillCarActualOptions from './useWaybillCarActualOptions';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';

type FieldWaybillCarIdArrayProps = {
  formDataKey: any;
  md: number;
};

const FieldWaybillCarIdArray: React.FC<FieldWaybillCarIdArrayProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);

    const formErrors = useForm.useFormDataFormErrors<any>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<any>(props.formDataKey);

    const car_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_id']>(props.formDataKey, 'car_id');
    const structure_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['structure_id']>(props.formDataKey, 'structure_id');

    const carActualOptionData = useWaybillCarActualOptions(props.formDataKey, car_id, structure_id);
    const selectedCarData = useWaybillFormData.useFormDataGetSelectedCar(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (_, value, option?) => {
        handleChange({
          car_id: value,
          gov_number: get(option, 'rowData.gov_number', null),
        });
      },
      [handleChange],
    );

    const previosStructure = usePrevious(structure_id);

    React.useEffect(
      () => {
        const needTrigger = (
          (previosStructure !== structure_id)
          && selectedCarData
          && structure_id
          && !(
            selectedCarData.is_common
            || (
              selectedCarData.company_structure_id === structure_id
            )
          )
        );

        if (needTrigger) {
          handleChangeWrap('car_id', null);
        }
      },
      [previosStructure, structure_id, selectedCarData, handleChangeWrap],
    );

    return  (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_car_id`}
          type="select"
          label={`Транспортное средство (поиск по рег. номер  ТС)`}
          value={car_id}
          error={formErrors.car_id}
          options={carActualOptionData.options}
          onChange={handleChangeWrap}
          disabled={!isPermitted}

          etsIsLoading={carActualOptionData.isLoading}
          boundKeys="car_id"
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillCarIdArray;
