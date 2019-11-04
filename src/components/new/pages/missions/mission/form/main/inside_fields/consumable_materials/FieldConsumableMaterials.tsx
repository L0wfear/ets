import * as React from 'react';

import TableInput, { TableMeta } from 'components/new/ui/table_input/TableInput';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import FieldConsumableMaterialsHeader from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/table_header/FieldConsumableMaterialsHeader';

import { metaConsumableMaterialId } from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/consumable_material_id/TdConsumableMaterialId';
import { metaNormValue } from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/norm_value/TdNormValue';
import { metaPlanValue } from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/plan_value/TdPlanValue';
import { metaFactValue } from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/fact_value/TdFactValue';
import { metaMissionProgressFactValue } from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/mission_progress_fact_value/TdMissionProgressFactValue';
import { metaConsumption } from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/consumption/TdConsumption';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import { useMissionFormDataIsNotAssignOrIsAssignWithNotActiveWaybill, useMissionFormDataIsNotAssign, useMissionDataLoadConsumableMateriaForMission } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';
import { actionGetAndSetInStoreMunicipalFacilityMeasureUnit } from 'redux-main/reducers/modules/some_uniq/municipal_facility/actions';

/**
 * 6
 * 6.1
 * 6.2
 * 6.3
 * 6.4
 * 6.5
 * 6.6
 * 6.7
 * 6.8
 * 6.9 (комплит)
 * 6.10 (комплит)
 * 6.11 (комплит)
 * 6.11.1 (комплит)
 * 6.11.2 (комплит)
 * 6.11.3 (комплит)
 * 6.11.4 (комплит)
 * 6.Таблица 2
 */

type Props = {
  formDataKey: FormKeys & ('mission' | 'duty_mission');
};

const metaConsumableMaterialsRaw: Array<TableMeta<ValuesOf<Mission['consumable_materials']>>> = [
  metaConsumableMaterialId,
  metaNormValue,
  metaPlanValue,
  metaMissionProgressFactValue,
  metaFactValue,
  metaConsumption,
];

const isPermittedChangeByStatus = (status: Mission['status'] | DutyMission['status'], formDataKey: FormKeys & ('mission' | 'duty_mission')) => {
  let triggerOnIsPermitted = (
    DUTY_MISSION_STATUS.not_assigned === status
    || DUTY_MISSION_STATUS.assigned === status
  );
  if (formDataKey === 'mission') {
    triggerOnIsPermitted = (
      triggerOnIsPermitted
      || MISSION_STATUS.expired === status
      || MISSION_STATUS.in_progress === status
    );
  }

  return triggerOnIsPermitted;
};

const FieldConsumableMaterials: React.FC<Props> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);
    const meta = useForm.useFormDataMeta<Mission>(props.formDataKey);

    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const status = useForm.useFormDataFormStatePickValue<Mission, Mission['status']>(props.formDataKey, 'status');
    const hasConsumableMateriaForMission = etsUseSelector((state) => Boolean(getSomeUniqState(state).consumableMaterialCountMissionList[0]));
    const is_mission_progress_countable = useForm.useFormDataFormStatePickValue<Mission, Mission['is_mission_progress_countable']>(props.formDataKey, 'is_mission_progress_countable');
    const IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_NOT_ACTIVE_WAYBILL = useMissionFormDataIsNotAssignOrIsAssignWithNotActiveWaybill(props.formDataKey);
    const IS_NOT_ASSIGN = useMissionFormDataIsNotAssign(props.formDataKey);
    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);

    const dispatch = etsUseDispatch();
    dispatch(actionGetAndSetInStoreMunicipalFacilityMeasureUnit(null, meta));
    useMissionDataLoadConsumableMateriaForMission(props.formDataKey);

    const disabled = (
      !isPermitted
      || !isPermittedChangeByStatus(status, props.formDataKey)
    );

    const handleChangeWrap = React.useCallback(
      (value) => {
        handleChange({ consumable_materials: value });
      },
      [handleChange],
    );

    const metaConsumableMaterials = React.useMemo(
      () => {
        return metaConsumableMaterialsRaw.filter((d) => {
          if (IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_NOT_ACTIVE_WAYBILL) {
            if (d.key === 'fact_value' || d.key === 'consumption' || d.key === 'mission_progress_fact_value') {
              return false;
            }
          }
          if (!is_mission_progress_countable || props.formDataKey === 'duty_mission') {
            if (d.key === 'mission_progress_fact_value') {
              return false;
            }
          }

          return true;
        });
      },
      [is_mission_progress_countable, IS_NOT_ASSIGN, props.formDataKey, IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_NOT_ACTIVE_WAYBILL],
    );

    // const dispatch = etsUseDispatch();
    React.useEffect(() => {
      // dispatch(actionGetAndSetInStoreNormsByParams(null, meta));
      // dispatch(actionGetAndSetInStoreMunicipalFacilityMeasureUnit(null, meta));
    }, [],
    );

    return (
      <React.Fragment>
        <TableInput
          array={consumable_materials}
          errors={errors}
          meta={metaConsumableMaterials}
          onChange={handleChangeWrap}

          header={
            <FieldConsumableMaterialsHeader
              selectedRowIndex={selectedRowIndex}
              meta={metaConsumableMaterials}

              buttonWidth={160}
              formDataKey={props.formDataKey}
              disabled={disabled}
            />
          }
          selectedRowIndex={selectedRowIndex}
          setSelectedRowIndex={setSelectedRowIndex}

          disabled={disabled}

          formDataKey={props.formDataKey}
        />
        {
          !hasConsumableMateriaForMission && !consumable_materials[0] && (
            <ErrorsBlock error="Для технологической операции и элемента не указаны расходные материалы" />
          )
        }
      </React.Fragment>
    );
  },
);

export default FieldConsumableMaterials;
