import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';
import { getTechnicalOperaionOptions } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/technical_operation_id/TdTechnicalOperationId';

type Props = {
  formDataKey: 'cleaning_area_rate';
};

const FieldTechnicalOperationId: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningAreaRate>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['technical_operation_id']>(props.formDataKey, 'technical_operation_id');
    const technical_operation_name = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['technical_operation_name']>(props.formDataKey, 'technical_operation_name');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningAreaRate, string>(props.formDataKey, 'technical_operation_id');
    const handleChange = useForm.useFormDataHandleChange<CleaningAreaRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningAreaRate>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event, option) => {
        const value = get(event, 'target.value', event);
        handleChange({
          technical_operation_id: value || null,
          technical_operation_name: get(option, 'label', ''),
        });
      },
      [handleChange],
    );

    const normList = etsUseSelector((state) => getSomeUniqState(state).normList);

    const options = React.useMemo(
      () => {
        return getTechnicalOperaionOptions(normList);
      },
      [normList],
    );

    return (
      <ExtField
        id={`${meta.path}_technical_operation_id`}
        type="select"
        clearable={false}
        label="Технологическая операция"
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted || !options[0]}
        value_string={technical_operation_name}
      />
    );
  },
);

export default FieldTechnicalOperationId;
