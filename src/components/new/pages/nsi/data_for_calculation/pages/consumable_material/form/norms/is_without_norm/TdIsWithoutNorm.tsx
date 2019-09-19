import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';

type Props = PropsToTdReactComponent;

const TdIsWithoutNorm: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

    const disabled = (
      !isPermitted
    );

    const handleChangeWrap = React.useCallback(
      async (valueNew) => {
        const is_without_norm = valueNew;
        const rowDataCallback = norms[props.indexRow];

        const triggerOnAsk = (
          is_without_norm
          && (
            (
              rowDataCallback.value
              || rowDataCallback.value === 0
            )
            || rowDataCallback.date_start
            || rowDataCallback.date_end
          )
        );

        if (triggerOnAsk) {
          try {
            await global.confirmDialog(({
              title: 'Внимание!',
              body: 'Очистить данные по норме?',
            }));
          } catch {
            return;
          }
        }

        handleChange({
          norms: norms.map((currentRowData, index) => {
            if (index === props.indexRow) {
              return {
                ...currentRowData,
                value: is_without_norm ? null : currentRowData.value,
                date_start: is_without_norm ? null : currentRowData.date_start,
                date_end: is_without_norm ? null : currentRowData.date_end,
                is_without_norm,
              };
            }

            return currentRowData;
          }),
        });
      },
      [handleChange, norms, props.indexRow],
    );

    const value = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'is_without_norm');
      },
      [norms, props.indexRow],
    );

    return (
      <ExtField
        type="select"
        id={metaIsWithoutNorm.key}
        label={false}
        clearable={false}
        value={value}
        options={YES_NO_SELECT_OPTIONS_BOOL}
        onChange={handleChangeWrap}
        disabled={disabled}
      />
    );
  },
);

export const metaIsWithoutNorm: TableMeta<ValuesOf<ConsumableMaterial['norms']>> = {
  key: 'is_without_norm',
  title: 'Нет нормы',
  format: 'select',
  width: 100,
  options: [],
  default_value: false,

  ReactComponentType: TdIsWithoutNorm,
};

export default TdIsWithoutNorm;
