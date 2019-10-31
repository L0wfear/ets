import * as React from 'react';
import { get, keyBy } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FlexContainer } from 'global-styled/global-styled';
import { useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill, mergeConsumableMaterials, useMissionFormDataIsCompleted } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { isNumber } from 'util';

type Props = PropsToTdReactComponent;

const TdFactValue: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const isMissionFormDataIsNotCompleted = useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill(props.formDataKey);
    const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);
    const municipal_facility_id = useForm.useFormDataFormStatePickValue<Mission, Mission['municipal_facility_id']>(props.formDataKey, 'municipal_facility_id');
    const municipalFacilityMeasureUnitList = etsUseSelector((state) => getSomeUniqState(state).municipalFacilityMeasureUnitList);
    const municipal_facility_measure_unit_name = get(municipalFacilityMeasureUnitList.find((rowData) => rowData.municipal_facility_id === municipal_facility_id), 'measure_unit_name');
    const IS_COMPLETED = useMissionFormDataIsCompleted(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              const fact_value = get(event, 'target.value', event);
              const fact_value_like_number = Number(fact_value);
              let consumption = null;
              if (rowData.is_consumption_locked && isNumber(rowData.norm_value) && !isNaN(fact_value_like_number)) {
                consumption = Number((fact_value * rowData.norm_value).toFixed(3));
              }

              return {
                ...rowData,
                fact_value,
                consumption,
              };
            }

            return rowData;
          }),
        });
      },
      [handleChange, consumable_materials, props.indexRow],
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

    const is_fact_value_locked = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_fact_value_locked');
      },
      [consumable_materials, props.indexRow],
    );

    const handleChangeLock = React.useCallback(
      async () => {
        let changed_consumable_materials = consumable_materials.find((_, index) => index === props.indexRow);
        changed_consumable_materials.is_fact_value_locked = !is_fact_value_locked;

        if (!changed_consumable_materials.is_fact_value_locked) {
          try {
            if (props.formDataKey !== 'duty_mission') {
              await global.confirmDialog({
                title: 'Внимание!',
                body: 'Объем работы (факт) не будет заполняться автоматически данными по ГЛОНАСС. Продолжить?',
              });
            } else {
              await global.confirmDialog({
                title: 'Внимание!',
                body: 'Объем работ (факт) не будет заполняться автоматически данными из поля Объем работы (план). Продолжить?',
              });
            }
          } catch {
            return;
          }
        } else {
          if (props.formDataKey !== 'duty_mission') {
            if (changed_consumable_materials.mission_progress_fact_value !== changed_consumable_materials.fact_value) {
              try {
                await global.confirmDialog({
                  title: 'Внимание!',
                  body: 'Объем работы (факт) будет заполняться автоматически данными по ГЛОНАСС». Ранее введенные данные в "Объем работы(факт)" будут очищены. Продолжить?',
                });
              } catch {
                return;
              }
            }
          } else {
            if (changed_consumable_materials.plan_value !== changed_consumable_materials.fact_value) {
              try {
                await global.confirmDialog({
                  title: 'Внимание!',
                  body: 'Объем работ (факт) будет заполняться автоматически данными из поля Объем работы (план). Ранее введенные данные в поле Объем работ (факт) будут очищены. Продолжить?',
                });
              } catch {
                return;
              }
            }
          }
          const { consumable_material_id: consumable_material_id_index } = changed_consumable_materials;
          if (consumable_material_id_index in consumableMateriaForMissionIndex) {
            consumableMateriaForMissionIndex[consumable_material_id_index] = {
              ...changed_consumable_materials,
              fact_value: consumableMateriaForMissionIndex[consumable_material_id_index].fact_value,
            };
          }
          // compare glonass/ fa
          changed_consumable_materials = mergeConsumableMaterials(
            [changed_consumable_materials],
            consumableMateriaForMissionIndex,
            props.formDataKey,
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
      [handleChange, is_fact_value_locked, consumable_materials, props.indexRow, consumableMateriaForMissionIndex],
    );

    const value = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'fact_value');
      },
      [consumable_materials, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'fact_value');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted || is_fact_value_locked || !consumable_material_id || IS_COMPLETED;
    const can_edit = get(consumableMateriaForMissionIndex[consumable_material_id], 'is_fact_value_locked') || true;

    return (
      <FlexContainer alignItems="end">
        <ExtField
          type="number"
          id={metaFactValue.key}
          label={false}
          value={value}
          error={error}
          onChange={handleChangeWrap}
          disabled={disabled}
          addonRight={municipal_facility_measure_unit_name}
          value_string={value}
        />
        {
          isMissionFormDataIsNotCompleted && can_edit && (
            <EtsBootstrap.Button disabled={!isPermitted} onClick={handleChangeLock}>
              <EtsBootstrap.Glyphicon glyph={!is_fact_value_locked ? "user" : "lock"} />
            </EtsBootstrap.Button>
          )
        }
      </FlexContainer>
    );
  },
);

export const metaFactValue: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'fact_value',
  title: 'Объем работы (факт)',
  format: 'string',
  width: 100,

  ReactComponentType: TdFactValue,
};

export default TdFactValue;
