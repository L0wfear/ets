import * as React from 'react';
import { uniqBy, get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

type Props = PropsToTdReactComponent;

export const getTechnicalOperaionOptions = (normList: Array<Norm>) => (
  uniqBy(
    normList.map((rowData) => ({
      value: rowData.technical_operation_id,
      label: rowData.name,
      rowData,
    })),
    'value',
  )
);

const TdTechnicalOperationId: React.FC<Props> = React.memo(
  (props) => {
    const normList = etsUseSelector((state) => getSomeUniqState(state).normList);

    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

    const disabled = !isPermitted;

    const handleChangeWrap = React.useCallback(
      (valueNew, option) => {
        handleChange({
          norms: norms.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                technical_operation_id: valueNew,
                technical_operation_name: get(option, 'label'),
                municipal_facility_id: null,
                municipal_facility_name: '',
                season_id: null,
                season_name: '',
              };
            }

            return rowData;
          }),
        });
      },
      [handleChange, norms, props.indexRow],
    );

    const value = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'technical_operation_id');
      },
      [norms, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, Array<any>>(props.formDataKey, 'norms');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'technical_operation_id');
      },
      [errors, props.indexRow],
    );

    const options = React.useMemo(
      () => {
        return getTechnicalOperaionOptions(normList);
      },
      [normList],
    );

    React.useEffect(
      () => {
        if (options.length === 1) {
          const data = options[0];
          if (data.value !== value) {
            handleChangeWrap(data.value, data);
          }
        }
      },
      [handleChangeWrap, options, value],
    );

    return (
      <ExtField
        type="select"
        id={metaTechnicalOperationId.key}
        clearable={false}
        label={false}
        value={value}
        error={error}
        options={options}
        onChange={handleChangeWrap}
        disabled={disabled}
      />
    );
  },
);

export const metaTechnicalOperationId: TableMeta<ValuesOf<ConsumableMaterial['norms']>> = {
  key: 'technical_operation_id',
  title: 'Технологическая операция',
  format: 'select',
  width: 150,
  options: [],
  uniqValueInCol: true,

  ReactComponentType: TdTechnicalOperationId,
};

export default TdTechnicalOperationId;
