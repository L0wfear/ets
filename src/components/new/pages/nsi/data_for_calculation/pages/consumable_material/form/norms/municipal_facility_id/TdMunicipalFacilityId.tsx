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

export const getMunicipaFacilityOptions = (normList: Array<Norm>, technical_operation_id: number) => (
  uniqBy(
    normList.filter((rowDataNorm) => rowDataNorm.technical_operation_id === technical_operation_id).reduce(
      (elements, rowDataNorm) => {
        elements.push(...rowDataNorm.elements);

        return elements;
      },
      [],
    ).map((rowDataElement) => ({
      value: rowDataElement.id,
      label: rowDataElement.name,
      rowData: rowDataElement,
    })),
    'value',
  )
);

const TdMunicipalFacilityId: React.FC<Props> = React.memo(
  (props) => {
    const normList = etsUseSelector((state) => getSomeUniqState(state).normList);
    const municipalFacilityMeasureUnitList = etsUseSelector((state) => getSomeUniqState(state).municipalFacilityMeasureUnitList);

    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const norms = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['norms']>(props.formDataKey, 'norms');
    const errors = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, Array<any>>(props.formDataKey, 'norms');
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);
    const rowData = norms[props.indexRow];

    const disabled = (
      !isPermitted
      || !rowData.technical_operation_id
    );

    const handleChangeWrap = React.useCallback(
      (valueNew, option) => {
        const measureData = municipalFacilityMeasureUnitList.find(({ municipal_facility_id }) => municipal_facility_id === valueNew);

        handleChange({
          norms: norms.map((rowDataNorm, index) => {
            if (index === props.indexRow) {
              return {
                ...rowDataNorm,
                municipal_facility_id: valueNew,
                municipal_facility_name: get(option, 'label'),
                municipal_facility_measure_unit_id: get(measureData, 'measure_unit_id'),
                municipal_facility_measure_unit_name: get(measureData, 'measure_unit_name'),
              };
            }

            return rowDataNorm;
          }),
        });
      },
      [handleChange, norms, props.indexRow],
    );

    const value = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'municipal_facility_id');
      },
      [norms, props.indexRow],
    );

    const technical_operation_id = React.useMemo(
      () => {
        return get(norms[props.indexRow], 'technical_operation_id');
      },
      [norms, props.indexRow],
    );

    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'municipal_facility_id');
      },
      [errors, props.indexRow],
    );

    const options = React.useMemo(
      () => {
        if (technical_operation_id) {
          return getMunicipaFacilityOptions(normList, technical_operation_id);
        }
        return [];
      },
      [normList, technical_operation_id],
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
        id={metaMunicipalFacilityId.key}
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

export const metaMunicipalFacilityId: TableMeta<ValuesOf<ConsumableMaterial['norms']>> = {
  key: 'municipal_facility_id',
  title: 'Элемент',
  format: 'select',
  width: 150,
  options: [],
  ReactComponentType: TdMunicipalFacilityId,
};

export default TdMunicipalFacilityId;
