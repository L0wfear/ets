import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

type Props = PropsToTdReactComponent;

const TdMissionProgressFactValue: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const municipal_facility_id = useForm.useFormDataFormStatePickValue<Mission, Mission['municipal_facility_id']>(props.formDataKey, 'municipal_facility_id');
    const municipalFacilityMeasureUnitList = etsUseSelector((state) => getSomeUniqState(state).municipalFacilityMeasureUnitList);
    const municipal_facility_measure_unit_name = get(municipalFacilityMeasureUnitList.find((rowData) => rowData.municipal_facility_id === municipal_facility_id), 'measure_unit_name');

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                mission_progress_fact_value: get(event, 'target.value', event),
              };
            }

            return rowData;
          }),
        });
      },
      [handleChange, consumable_materials, props.indexRow],
    );

    const value = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'mission_progress_fact_value');
      },
      [consumable_materials, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'mission_progress_fact_value');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted;

    return (
      <ExtField
        type="number"
        id={metaMissionProgressFactValue.key}
        label={false}
        value={value}
        error={error}
        onChange={handleChangeWrap}
        disabled={disabled || true}
        addonRight={municipal_facility_measure_unit_name}
      />
    );
  },
);

export const metaMissionProgressFactValue: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'mission_progress_fact_value',
  title: 'Объем работы (ГЛОНАСС)',
  titlePopup: 'После закрытия задания данное поле не будет обновляться',
  format: 'string',
  width: 100,

  ReactComponentType: TdMissionProgressFactValue,
};

export default TdMissionProgressFactValue;
