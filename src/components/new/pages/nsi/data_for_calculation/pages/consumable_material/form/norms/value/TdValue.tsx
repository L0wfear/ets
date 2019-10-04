import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type Props = PropsToTdReactComponent;

export const getAddon = (measure_unit_name_element, measure_unit_name) => {
  if (measure_unit_name === measure_unit_name_element) {
    return measure_unit_name;
  }

  return `${measure_unit_name}/${measure_unit_name_element || '-'}`;
};

const TdValue: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const measure_unit_name = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['measure_unit_name']>(props.formDataKey, 'measure_unit_name');

    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (key, valueNew) => {
        handleChange({
          norms: norms.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                [key]: valueNew,
              };
            }

            return rowData;
          }),
        });
      },
      [handleChange, norms, props.indexRow],
    );

    const handleChangeValue = React.useCallback(
      (event) => {
        handleChangeWrap('value', get(event, 'target.value', event));
      },
      [handleChange, norms, props.indexRow],
    );

    const is_without_norm = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'is_without_norm');
      },
      [norms, props.indexRow],
    );
    const municipal_facility_measure_unit_name = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'municipal_facility_measure_unit_name');
      },
      [norms, props.indexRow],
    );
    const value = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'value');
      },
      [norms, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, Array<any>>(props.formDataKey, 'norms');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'value');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted || is_without_norm;

    return (
      <ExtField
        type="number"
        id={metaValue.key}
        label={false}
        value={value}
        error={error}
        onChange={handleChangeValue}
        disabled={disabled}
        addonRight={!is_without_norm ? getAddon(municipal_facility_measure_unit_name, measure_unit_name) : null}
      />
    );
  },
);

export const metaValue: TableMeta<ValuesOf<ConsumableMaterial['norms']>> = {
  key: 'value',
  title: 'Норма',
  format: 'number',
  width: 125,

  ReactComponentType: TdValue,
};

export default TdValue;
