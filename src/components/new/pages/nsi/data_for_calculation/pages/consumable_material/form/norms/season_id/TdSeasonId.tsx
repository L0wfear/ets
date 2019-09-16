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

export const getSeasonOptions = (normList: Norm[], technical_operation_id: number, municipal_facility_id: number) => (
  uniqBy(
    normList.filter((rowDataNorm) => (
      rowDataNorm.technical_operation_id === technical_operation_id
      && rowDataNorm.elements.find(({ id }) => id === municipal_facility_id)
    )).map((rowDataNorm) => ({
      value: rowDataNorm.season_id,
      label: rowDataNorm.season_name,
    })),
    'value',
  )
);

const TdSeasonId: React.FC<Props> = React.memo(
  (props) => {
    const normList = etsUseSelector((state) => getSomeUniqState(state).normList);

    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const errors = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, Array<any>>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);
    const rowData = norms[props.indexRow];

    const disabled = (
      !isPermitted
      || !rowData.municipal_facility_id
    );

    const handleChangeWrap = React.useCallback(
      (valueNew, option) => {
        handleChange({
          norms: norms.map((rowDataNorm, index) => {
            if (index === props.indexRow) {
              return {
                ...rowDataNorm,
                season_id: valueNew,
                season_name: get(option, 'label'),
              };
            }

            return rowDataNorm;
          }),
        });
      },
      [handleChange, norms, props.indexRow],
    );

    const value = get(rowData, 'season_id');

    const technical_operation_id = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'technical_operation_id');
      },
      [norms, props.indexRow],
    );
    const municipal_facility_id = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'municipal_facility_id');
      },
      [norms, props.indexRow],
    );

    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'season_id');
      },
      [errors, props.indexRow],
    );

    const options = React.useMemo(
      () => {
        if (technical_operation_id && municipal_facility_id) {
          return getSeasonOptions(normList, technical_operation_id, municipal_facility_id);
        }
        return [];
      },
      [normList, technical_operation_id, municipal_facility_id],
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
        id={metaSeasonId.key}
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

export const metaSeasonId: TableMeta<ValuesOf<ConsumableMaterial['norms']>> = {
  key: 'season_id',
  title: 'Сезон',
  format: 'select',
  width: 100,
  options: [],
  ReactComponentType: TdSeasonId,
};

export default TdSeasonId;
