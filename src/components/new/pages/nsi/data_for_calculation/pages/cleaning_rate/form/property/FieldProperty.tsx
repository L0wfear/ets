import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetAndSetInStoreCleaningRatePropertie, actionResetCleaningRatePropertie } from 'redux-main/reducers/modules/some_uniq/properties/actions';

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

    const cleaningRatePropertyList = etsUseSelector((state) => getSomeUniqState(state).cleaningRatePropertieList);
    const dispatch = etsUseDispatch();
    React.useEffect(
      () => {
        dispatch(actionGetAndSetInStoreCleaningRatePropertie(type, meta));
        return () => dispatch(actionResetCleaningRatePropertie());
      },
      [],
    );

    const options = React.useMemo(
      () => {
        return (
          cleaningRatePropertyList.filter((el) => el.type === type)
            .map((el) => ({value: el.property, label: el.property_text}))
        );
      },
      [type, cleaningRatePropertyList],
    );
    
    return (
      <ExtField
        id={`${meta.path}_property`}
        type="select"
        label="Площадная характеристика"
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
