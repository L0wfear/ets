import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';
import { getMunicipaFacilityOptions } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/municipal_facility_id/TdMunicipalFacilityId';

type Props = {
  formDataKey: 'cleaning_area_rate';
};

const FieldMunicipalFacilityId: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningAreaRate>(props.formDataKey);
    const technical_operation_id = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['technical_operation_id']>(props.formDataKey, 'technical_operation_id');
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['municipal_facility_id']>(props.formDataKey, 'municipal_facility_id');
    const municipal_facility_name = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['municipal_facility_name']>(props.formDataKey, 'municipal_facility_name');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningAreaRate, string>(props.formDataKey, 'municipal_facility_id');
    const handleChange = useForm.useFormDataHandleChange<CleaningAreaRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningAreaRate>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event, option?) => {
        const value = get(event, 'target.value', event);
        handleChange({
          municipal_facility_id: value || null,
          municipal_facility_name: get(option, 'label', ''),
        });
      },
      [handleChange],
    );

    const normList = etsUseSelector((state) => getSomeUniqState(state).normList);
    const options = React.useMemo(
      () => {
        return getMunicipaFacilityOptions(normList, technical_operation_id);
      },
      [normList, technical_operation_id],
    );

    React.useEffect(
      () => {
        if (options.length === 1) {
          const data = options[0];
          if (data.value !== formStateValue) {
            handleChangeWrap(data.value, data);
          }
        } else if (formStateValue && options[0]) {
          if (!options.some(({ value }) => value === formStateValue)) {
            handleChangeWrap(null);
          }
        }
      },
      [handleChangeWrap, options, formStateValue],
    );

    return (
      <ExtField
        id={`${meta.path}_municipal_facility_id`}
        type="select"
        clearable={false}
        label="Элемент"
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted || !technical_operation_id || !options[0]}
        value_string={municipal_facility_name}
      />
    );
  },
);

export default FieldMunicipalFacilityId;
