import * as React from 'react';
import { isNullOrUndefined } from 'util';

import { EtsHeaderContainer, EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { TableMeta } from 'components/new/ui/table_input/TableInput';
import { getConsumableMaterialIdOptions } from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/consumable_material_id/TdConsumableMaterialId';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';
import ButtonUpdateGLONASS from 'components/new/pages/missions/mission/form/main/inside_fields/consumable_materials/table_header/ButtonUpdateGLONASS';
import { useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill, useMissionFormDataIsNoCompleted } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';

type Props = {
  selectedRowIndex: number;
  meta: TableMeta<ValuesOf<Mission['consumable_materials']>>[];
  buttonWidth: number;

  formDataKey: FormKeys & ('mission' | 'duty_mission');
  disabled: boolean;
};

const canAddConsumableMaterials = (consumable_materials: Mission['consumable_materials'], consumableMateriaForMission: ConsumableMaterialCountMission[]) => {
  const options = getConsumableMaterialIdOptions(consumable_materials, consumableMateriaForMission);
  return options.some(({ isNotVisible }) => !isNotVisible);
};

const FieldConsumableMaterialsHeader: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const for_column = useForm.useFormDataFormStatePickValue<Mission, Mission['for_column']>(props.formDataKey, 'for_column');
    const is_mission_progress_countable = useForm.useFormDataFormStatePickValue<Mission, Mission['is_mission_progress_countable']>(props.formDataKey, 'is_mission_progress_countable');
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);
    const IS_NOT_COMPLETED_WITH_ACTIVE_WAYBILL = useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill(props.formDataKey);
    const IS_NOT_COMPLETED = useMissionFormDataIsNoCompleted(props.formDataKey);

    const isPermitted = (
      useForm.useFormDataIsPermitted<Mission>(props.formDataKey)
      && !props.disabled
    );

    const can_add = canAddConsumableMaterials(consumable_materials, consumableMateriaForMission);

    const hasConsumableMateriaForMission = etsUseSelector((state) => Boolean(getSomeUniqState(state).consumableMaterialCountMissionList[0]));

    const handleAddRow = React.useCallback(
      () => {
        handleChange({
          consumable_materials: [
            ...consumable_materials,
            props.meta.reduce<any>((emptyRow, { key, ...other }) => {
              emptyRow[key] = 'default_value' in other ? other.default_value : null;

              return emptyRow;
            }, {}),
          ],
        });
      },
      [handleChange, consumable_materials],
    );

    const handleRemoveRow = React.useCallback(
      () => {
        handleChange({
          consumable_materials: consumable_materials.filter((_, index) => index !== props.selectedRowIndex),
        });
      },
      [props.selectedRowIndex, handleChange, consumable_materials],
    );

    return (
      <EtsBootstrap.Row>
        <EtsHeaderContainerWrap>
          <EtsHeaderContainer>
            <EtsHeaderTitle>
              {
                'Расходные материалы '
              }
              {
                for_column && (
                  <EtsBootstrap.OverlayTrigger
                    trigger={['hover', 'focus']}
                    overlay={(
                      <EtsBootstrap.Popover>
                        <span>
                          При создании задания на колонну расходные материалы будут добавлены в задание для каждого ТС
                        </span>
                      </EtsBootstrap.Popover>
                    )}
                    placement="top"
                  >
                    <EtsBootstrap.Glyphicon glyph="info-sign" />
                  </EtsBootstrap.OverlayTrigger>
                )
              }
            </EtsHeaderTitle>
            <EtsButtonsContainer>
              {
                (isPermitted && hasConsumableMateriaForMission)
                  && (
                    <React.Fragment>
                      {
                        IS_NOT_COMPLETED && (
                          <React.Fragment>
                            <ButtonTableInput block width={props.buttonWidth} onClick={handleAddRow} disabled={!can_add}>Добавить</ButtonTableInput>
                            <ButtonTableInput block width={props.buttonWidth} onClick={handleRemoveRow} disabled={isNullOrUndefined(props.selectedRowIndex)}>Удалить</ButtonTableInput>
                          </React.Fragment>
                        )
                      }
                      {
                        Boolean(is_mission_progress_countable && IS_NOT_COMPLETED_WITH_ACTIVE_WAYBILL) && (
                          <ButtonUpdateGLONASS buttonWidth={props.buttonWidth} formDataKey={props.formDataKey}/>
                        )
                      }
                    </React.Fragment>
                  )
              }
            </EtsButtonsContainer>
          </EtsHeaderContainer>
        </EtsHeaderContainerWrap>
      </EtsBootstrap.Row>
    );
  },
);

export default FieldConsumableMaterialsHeader;
