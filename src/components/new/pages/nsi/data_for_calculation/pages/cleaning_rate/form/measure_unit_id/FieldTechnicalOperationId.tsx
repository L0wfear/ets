import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';

type Props = {
  formDataKey: 'cleaning_rate';
};

const FieldMeasureUnitId: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningRate>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningRate, CleaningRate['measure_unit_id']>(props.formDataKey, 'measure_unit_id');
    const measure_unit_name = useForm.useFormDataFormStatePickValue<CleaningRate, CleaningRate['measure_unit_name']>(props.formDataKey, 'measure_unit_name');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningRate, string>(props.formDataKey, 'measure_unit_id');
    const handleChange = useForm.useFormDataHandleChange<CleaningRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningRate>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event, option) => {
        const value = get(event, 'target.value', event);
        handleChange({
          measure_unit_id: value || null,
          measure_unit_name: get(option, 'label', ''),
        });
      },
      [handleChange],
    );

    const measureUnitOptionsDataPayload = React.useMemo(() => ({
      type: 'cleaning_rate'
    }), []);

    const { options, isLoading } = useMeasureUnitOptions(measureUnitOptionsDataPayload, meta);

    return (
      <ExtField
        id={`${meta.path}_measure_unit_id`}
        type="select"
        label="Единица измерения"
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted || !options[0]}
        value_string={measure_unit_name}

        etsIsLoading={isLoading}
      />
    );
  },
);

export default FieldMeasureUnitId;
