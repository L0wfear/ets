import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type Props = PropsToTdReactComponent;

const TdDateStart: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          norms: norms.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                date_start: get(event, 'target.value', event),
              };
            }

            return rowData;
          }),
        });
      },
      [handleChange, norms, props.indexRow],
    );

    const is_without_norm = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'is_without_norm');
      },
      [norms, props.indexRow],
    );

    const value = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'date_start');
      },
      [norms, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, Array<any>>(props.formDataKey, 'norms');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'date_start');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted || is_without_norm;

    return (
      <ExtField
        type="date"
        id={metaDateStart.key}
        time={false}
        label={false}
        value={value}
        error={error}
        onChange={handleChangeWrap}
        disabled={disabled}
        makeGoodFormat
      />
    );
  },
);

export const metaDateStart: TableMeta<ValuesOf<ConsumableMaterial['norms']>> = {
  key: 'date_start',
  title: 'Дата с.',
  format: 'date',
  width: 100,

  ReactComponentType: TdDateStart,
};

export default TdDateStart;
