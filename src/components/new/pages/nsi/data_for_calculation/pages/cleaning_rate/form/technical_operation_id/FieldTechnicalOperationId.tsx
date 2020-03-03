import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetAndSetInStoreTechnicalOperationRegistry, actionResetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';

type Props = {
  formDataKey: 'cleaning_rate';
};

const FieldTechnicalOperationId: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningRate>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningRate, CleaningRate['technical_operation_id']>(props.formDataKey, 'technical_operation_id');
    const technical_operation_name = useForm.useFormDataFormStatePickValue<CleaningRate, CleaningRate['technical_operation_name']>(props.formDataKey, 'technical_operation_name');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningRate, string>(props.formDataKey, 'technical_operation_id');
    const handleChange = useForm.useFormDataHandleChange<CleaningRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningRate>(props.formDataKey);

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

    const dispatch = etsUseDispatch();
    const technicalOperationRegistryList = etsUseSelector((state) => getSomeUniqState(state).technicalOperationRegistryList);
    React.useEffect(
      () => {
        dispatch(actionGetAndSetInStoreTechnicalOperationRegistry({}, meta));
        return () => dispatch(actionResetTechnicalOperationRegistry());
      },
      [],
    );

    const options = React.useMemo(
      () => {
        return technicalOperationRegistryList.map(defaultSelectListMapper);
      },
      [technicalOperationRegistryList],
    );

    return (
      <ExtField
        id={`${meta.path}_technical_operation_id`}
        type="select"
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
