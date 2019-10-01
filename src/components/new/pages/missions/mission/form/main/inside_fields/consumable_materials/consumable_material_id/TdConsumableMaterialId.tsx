import * as React from 'react';
import { get, keyBy } from 'lodash';
import memoizeOne from 'memoize-one';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';
import { useMissionFormDataIsNoCompleted } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';

type Props = PropsToTdReactComponent;

export const getConsumableMaterialIdOptions = memoizeOne(
  (consumable_materials: Mission['consumable_materials'], consumableMateriaForMission: ConsumableMaterialCountMission[]) => {
    const consumable_materials_index = keyBy(consumable_materials, 'consumable_material_id');
    const options = consumableMateriaForMission.map(
      (rowData) => {
        delete consumable_materials_index[rowData.consumable_material_id];

        return ({
          value: rowData.consumable_material_id,
          label: rowData.consumable_material_name,
          rowData,
          isNotVisible: consumable_materials_index[rowData.consumable_material_id],
        });
      },
    );

    return [
      ...options,
      ...Object.values(consumable_materials_index).map(
        (rowData) => ({
          value: rowData.consumable_material_id,
          label: rowData.consumable_material_name,
          rowData,
          isNotVisible: false,
        }),
      ),
    ];
  },
);

const TdConsumableMaterialId: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const IS_NOT_COMPLETED = useMissionFormDataIsNoCompleted(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);

    const handleChangeWrap = React.useCallback(
      (valueNew, option) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                ...get(option, 'rowData', {}),
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
        return get(consumable_materials[props.indexRow], 'consumable_material_id');
      },
      [consumable_materials, props.indexRow],
    );
    const value_string = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumable_material_name');
      },
      [consumable_materials, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'consumable_material_id');
      },
      [errors, props.indexRow],
    );

    const options = React.useMemo(
      () => {
        return getConsumableMaterialIdOptions(consumable_materials, consumableMateriaForMission);
      },
      [consumable_materials, consumableMateriaForMission],
    );

    const disabled = !isPermitted || !IS_NOT_COMPLETED;

    return (
      <ExtField
        type="select"
        id={metaConsumableMaterialId.key}
        clearable={false}
        label={false}
        value={value}
        error={error}
        options={options}
        onChange={handleChangeWrap}
        disabled={disabled}

        value_string={value_string}
      />
    );
  },
);

export const metaConsumableMaterialId: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'consumable_material_id',
  title: 'Расходный материал',
  format: 'select',
  width: 150,
  options: [],
  uniqValueInCol: true,

  ReactComponentType: TdConsumableMaterialId,
};

export default TdConsumableMaterialId;
