import * as React from 'react';
import { get, keyBy } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getAddon } from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form/norms/value/TdValue';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { mergeConsumableMaterials, useMissionFormDataIsNoCompleted } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';
import { FlexContainer } from 'global-styled/global-styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { calculateCunsumption } from '../consumption/utils';

type Props = PropsToTdReactComponent;

const TdNormValue: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const municipal_facility_id = useForm.useFormDataFormStatePickValue<Mission, Mission['municipal_facility_id']>(props.formDataKey, 'municipal_facility_id');
    const municipalFacilityMeasureUnitList = etsUseSelector((state) => getSomeUniqState(state).municipalFacilityMeasureUnitList);
    const municipal_facility_measure_unit_name = get(municipalFacilityMeasureUnitList.find((rowData) => rowData.municipal_facility_id === municipal_facility_id), 'measure_unit_name');
    const IS_NOT_COMPLETED = useMissionFormDataIsNoCompleted(props.formDataKey);
    const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);
    const is_mission_progress_countable = useForm.useFormDataFormStatePickValue<Mission, Mission['is_mission_progress_countable']>(props.formDataKey, 'is_mission_progress_countable');

    const [origin_consumable_material_norm_id, set_origin_consumable_material_norm_id] = React.useState(null);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              const norm_value = get(event, 'target.value', event);
              let consumption = calculateCunsumption({ rowData, fact_value: rowData.fact_value, consumption: null, norm_value, });
              return {
                ...rowData,
                norm_value: norm_value
                  ? Number(norm_value)
                  : norm_value,
                consumption,
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
        return get(consumable_materials[props.indexRow], 'norm_value');
      },
      [consumable_materials, props.indexRow],
    );
    const is_without_norm = React.useMemo(
      () => {
        return !Boolean(get(consumable_materials[props.indexRow], 'norm_value'));
      },
      [consumable_materials, props.indexRow],
    );

    const consumable_material_measure_unit_name = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumable_material_measure_unit_name');
      },
      [consumable_materials, props.indexRow],
    );

    const consumableMateriaForMissionIndex = React.useMemo(
      () => {
        return keyBy(consumableMateriaForMission, 'consumable_material_id');
      },
      [consumableMateriaForMission],
    );

    const consumable_material_id = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumable_material_id');
      },
      [consumable_materials, props.indexRow],
    );

    const is_norm_value_locked = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_norm_value_locked');
      },
      [consumable_materials, props.indexRow],
    );
    const is_order_operation_norm = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_order_operation_norm');
      },
      [consumable_materials, props.indexRow],
    );

    const handleChangeLock = React.useCallback(
      async () => {
        let changed_consumable_materials = consumable_materials.find((_, index) => index === props.indexRow);
        changed_consumable_materials.is_norm_value_locked = !is_norm_value_locked;
        
        if(!changed_consumable_materials.is_norm_value_locked) {
          if(changed_consumable_materials.consumable_material_norm_id){
            set_origin_consumable_material_norm_id(changed_consumable_materials.consumable_material_norm_id);
          }
          changed_consumable_materials.consumable_material_norm_id = null;
        } else {
          changed_consumable_materials.consumable_material_norm_id = origin_consumable_material_norm_id;
        }

        if (changed_consumable_materials.is_norm_value_locked) {
          const { consumable_material_id: consumable_material_id_index } = changed_consumable_materials;
          if (consumable_material_id_index in consumableMateriaForMissionIndex) {
            consumableMateriaForMissionIndex[consumable_material_id_index] = {
              ...changed_consumable_materials,
              norm_value: consumableMateriaForMissionIndex[consumable_material_id_index].norm_value,
            };
          }
          // compare glonass/ fa
          changed_consumable_materials = mergeConsumableMaterials(
            [changed_consumable_materials],
            consumableMateriaForMissionIndex,
            is_mission_progress_countable,
          )[0];
        }

        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              return changed_consumable_materials;
            }

            return rowData;
          }).filter((d) => d),
        });
      },
      [handleChange, is_norm_value_locked, consumable_materials, props.indexRow, consumableMateriaForMissionIndex, origin_consumable_material_norm_id],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'norm_value');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted;

    const showEditBtn = !is_order_operation_norm;
    const disableEditBtn =  !Boolean(get(consumableMateriaForMissionIndex[consumable_material_id], 'is_norm_value_locked') || true) || !IS_NOT_COMPLETED;

    return (
      <FlexContainer alignItems="end">
        <ExtField
          type="number"
          id={metaNormValue.key}
          label={false}
          value={value}
          error={error}
          onChange={handleChangeWrap}
          disabled={disabled || is_norm_value_locked}
          addonRight={!is_without_norm ? getAddon(municipal_facility_measure_unit_name, consumable_material_measure_unit_name) : null}
          value_string={value}
        />
        {
          showEditBtn && (
            <EtsBootstrap.Button disabled={disableEditBtn} onClick={handleChangeLock} title={!is_norm_value_locked ? 'открыт ручной ввод' : 'закрыт ручной ввод'}>
              <EtsBootstrap.Glyphicon glyph={!is_norm_value_locked ? 'pencil' : 'lock'} />
            </EtsBootstrap.Button>
          )
        }
      </FlexContainer>
    );
  },
);

export const metaNormValue: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'norm_value',
  title: 'Норма расхода',
  format: 'string',
  width: 100,

  ReactComponentType: TdNormValue,
};

export default TdNormValue;
