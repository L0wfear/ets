import * as React from 'react';
import { get, keyBy } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill, mergeConsumableMaterials } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { FlexContainer } from 'global-styled/global-styled';

type Props = PropsToTdReactComponent;

const TdConsumption: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_ACTIVE_WAYBILL = useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill(props.formDataKey);
    const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                consumption: get(event, 'target.value', event),
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
    const is_consumption_locked = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_consumption_locked');
      },
      [consumable_materials, props.indexRow],
    );

    const handleChangeLock = React.useCallback(
      async () => {
        let changed_consumable_materials = consumable_materials.find((_, index) => index === props.indexRow);
        changed_consumable_materials.is_consumption_locked = !is_consumption_locked;

        if (!changed_consumable_materials.is_consumption_locked) {
          try {
            await global.confirmDialog({
              title: 'Внимание!',
              body: 'Поле "Расход (итого)" станет доступным для редактирования и не будет автоматически пересчитываться.\nПродолжить?',
            });
          } catch {
            return;
          }
        } else {
          try {
            await global.confirmDialog({
              title: 'Внимание!',
              body: 'Поле "Расход (итого)" станет недоступным для редактирования и будет пересчитываться автоматически.\n Продолжить?',
            });
          } catch {
            return;
          }

          changed_consumable_materials = mergeConsumableMaterials(
            [changed_consumable_materials],
            consumableMateriaForMissionIndex,
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
      [handleChange, consumable_materials, props.indexRow, consumableMateriaForMissionIndex, is_consumption_locked],
    );

    const value = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumption');
      },
      [consumable_materials, props.indexRow],
    );
    const consumable_material_measure_unit_name = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumable_material_measure_unit_name');
      },
      [consumable_materials, props.indexRow],
    );
    const consumable_material_id = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumable_material_id');
      },
      [consumable_materials, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'consumption');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted || !IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_ACTIVE_WAYBILL || !consumable_material_id;
    const can_edit = get(consumableMateriaForMissionIndex[consumable_material_id], 'is_consumption_locked');

    return (
      <FlexContainer alignItems="end">
        <ExtField
          type="number"
          id={metaConsumption.key}
          label={false}
          value={value}
          error={error}
          onChange={handleChangeWrap}
          disabled={disabled || is_consumption_locked}
          addonRight={consumable_material_measure_unit_name}
          value_string={value}
        />
        {
          !disabled && can_edit && (
            <EtsBootstrap.Button onClick={handleChangeLock}>
              <EtsBootstrap.Glyphicon glyph={!is_consumption_locked ? "user" : "lock"} />
            </EtsBootstrap.Button>
          )
        }
      </FlexContainer>
    );
  },
);

export const metaConsumption: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'consumption',
  title: 'Расход (итого)',
  format: 'string',
  width: 100,

  ReactComponentType: TdConsumption,
};

export default TdConsumption;
