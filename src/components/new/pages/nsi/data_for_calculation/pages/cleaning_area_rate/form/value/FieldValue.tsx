import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';

type Props = {
  formDataKey: 'cleaning_area_rate';
};

const FieldValue: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningAreaRate>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['value']>(props.formDataKey, 'value');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningAreaRate, string>(props.formDataKey, 'value');
    const handleChange = useForm.useFormDataHandleChange<CleaningAreaRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningAreaRate>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event, option?) => {
        const value = get(event, 'target.value', event);
        handleChange({
          value: value || null,
        });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${meta.path}_value`}
        type="string"
        label="Коэффициент площади уборки"
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldValue;
