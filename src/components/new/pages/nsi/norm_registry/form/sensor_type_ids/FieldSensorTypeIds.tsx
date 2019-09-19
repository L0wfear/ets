import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { actionGetAndSetInStoreSensorType } from 'redux-main/reducers/modules/some_uniq/sensor_type/sensor_type_actions';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';

type Props = {
  formDataKey: 'norm';
};

const FieldSensorTypeIds: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<Norm>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<Norm, Norm['sensor_type_ids']>(props.formDataKey, 'sensor_type_ids');
    const error = useForm.useFormDataFormErrorsPickValue<Norm, string>(props.formDataKey, 'sensor_type_ids');
    const handleChange = useForm.useFormDataHandleChange<Norm>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Norm>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ sensor_type_ids: value || null });
      },
      [handleChange],
    );

    const dispatch = etsUseDispatch();
    const sensorTypeList = etsUseSelector((state) => getSomeUniqState(state).sensorTypeList);
    React.useEffect(
      () => {
        dispatch(actionGetAndSetInStoreSensorType({}, meta));
      },
      [],
    );

    const options = React.useMemo(
      () => {
        return sensorTypeList.map(defaultSelectListMapper);
      },
      [sensorTypeList],
    );

    return (
      <ExtField
        id={`${meta.path}_sensor_type_ids`}
        type="select"
        multi
        label="Типы навесного оборудования"
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldSensorTypeIds;
