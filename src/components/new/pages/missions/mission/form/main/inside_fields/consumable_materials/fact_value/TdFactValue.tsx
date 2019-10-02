import * as React from 'react';
import { get, keyBy } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FlexContainer } from 'global-styled/global-styled';
import { useMissionFormDataIsNoCompleted, mergeConsumableMaterials } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { isNumber } from 'util';

type Props = PropsToTdReactComponent;

const TdFactValue: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const isMissionFormDataIsNotCompleted = useMissionFormDataIsNoCompleted(props.formDataKey);
    const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              const fact_value = get(event, 'target.value', event);
              const fact_value_like_number = Number(fact_value);
              let consumption = null;
              if (isNumber(rowData.norm_value) && !isNaN(fact_value_like_number)) {
                consumption = fact_value * rowData.norm_value;
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

    const is_fact_value_locked = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_fact_value_locked');
      },
      [consumable_materials, props.indexRow],
    );

    const handleChangeLock = React.useCallback(
      () => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              const is_fact_value_locked_new = !is_fact_value_locked;
              if (is_fact_value_locked_new) {
                return mergeConsumableMaterials(
                  [
                    {
                      ...rowData,
                      is_fact_value_locked: is_fact_value_locked_new,
                    },
                  ],
                  consumableMateriaForMissionIndex,
                )[0];
              }

              return {
                ...rowData,
                is_fact_value_locked: is_fact_value_locked_new,
              };
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

    const disabled = !isPermitted || is_fact_value_locked;

    return (
      <FlexContainer alignItems="end">
        <ExtField
          type="string"
          id={metaFactValue.key}
          label={false}
          value={value}
          error={error}
          onChange={handleChangeWrap}
          disabled={disabled}
        />
        {
          props.formDataKey !== 'duty_mission' && isMissionFormDataIsNotCompleted && (
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
  title: 'Объем работ (факт)',
  format: 'string',
  width: 100,

  ReactComponentType: TdFactValue,
};

export default TdFactValue;
