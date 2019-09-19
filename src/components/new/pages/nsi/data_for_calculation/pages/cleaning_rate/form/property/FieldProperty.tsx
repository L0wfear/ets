import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import { getCleaningRateProperties } from 'redux-main/reducers/modules/form_data_record/form_data/cleaning_rate/constants';

type Props = {
  formDataKey: 'cleaning_rate';
};

const FieldProperty: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningRate>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningRate, CleaningRate['property']>(props.formDataKey, 'property');
    const property_text = useForm.useFormDataFormStatePickValue<CleaningRate, CleaningRate['property_text']>(props.formDataKey, 'property_text');
    const type = useForm.useFormDataFormStatePickValue<CleaningRate, CleaningRate['type']>(props.formDataKey, 'type');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningRate, string>(props.formDataKey, 'property');
    const handleChange = useForm.useFormDataHandleChange<CleaningRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningRate>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event, option) => {
        const value = get(event, 'target.value', event);
        handleChange({
          property: value || null,
          property_text: get(option, 'label'),
        });
      },
      [handleChange],
    );

    const options = React.useMemo(
      () => {
        return getCleaningRateProperties(type);
      },
      [type],
    );

    return (
      <ExtField
        id={`${meta.path}_property`}
        type="select"
        label="Технологическая операция"
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted || !options[0]}
        value_string={property_text}
      />
    );
  },
);

export default FieldProperty;
