
import * as React from 'react';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';

import ButtonExport from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonExport';
import ButtonToggleFilter from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonToggleFilter';
import ButtonCreate from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonCreate';
import ButtonRead from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonRead';
import ButtonRemove from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonRemove';
import ButtonCreateMissionByEdcRequest from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/ButtonCreateMissionByEdcRequest';
import ButtonCreateDutyMissionByEdcRequest from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/edc_request/ButtonCreateDutyMissionByEdcRequest';
import ButtonCreateDutyMission from './button-by-type/duty_mission_template/ButtonCreateDutyMission';
import ButtonCloseEdcRequest from './button-by-type/edc_request/ButtonCloseEdcRequest';
import ButtonCancelEdcRequest from './button-by-type/edc_request/ButtonCancelEdcRequest';
import ButtonRejectEdcRequest from './button-by-type/edc_request/ButtonRejectEdcRequest';
import ButtonChangeDriverTechnicalOperationRelations from './button-by-type/technical_operation_relations/ButtonChangeDriverTechnicalOperationRelations';
import ButtonChangeRouteTechnicalOperationRelations from './button-by-type/technical_operation_relations/ButtonChangeRouteTechnicalOperationRelations';
import ButtonRemoveDutyMission from './button-by-type/duty_mission/ButtonRemoveDutyMission';
import ButtonExportDutyMission from './button-by-type/duty_mission/ButtonExportDutyMission';
import ButtonCompleteDutyMission from './button-by-type/duty_mission/ButtonCompleteDutyMission';
import ButtonToArchiveDutyMission from './button-by-type/duty_mission/ButtonToArchiveDutyMission';
import ButtonFailDutyMission from './button-by-type/duty_mission/ButtonFailDutyMission';
import ButtonFromArchiveDutyMission from './button-by-type/duty_mission/ButtonFromArchiveDutyMission';
import ButtonCreateMissionTemplate from './button-by-type/mission_template/ButtonCreateMissionTemplate';
import ButtonCreateMission from './button-by-type/mission/ButtonCreateMission';
import ButtonCreateMissionByOrder from './button-by-type/mission/ButtonCreateMissionByOrder';
import ButtonRemoveMission from './button-by-type/mission/ButtonRemoveMission';
import ButtonExportMission from './button-by-type/mission/ButtonExportMission';
import ButtonCompleteMission from './button-by-type/mission/ButtonCompleteMission';
import ButtonToArchiveMission from './button-by-type/mission/ButtonToArchiveMission';
import ButtonFromArchiveMission from './button-by-type/mission/ButtonFromArchiveMission';
import ButtonFailMission from './button-by-type/mission/ButtonFailMission';
import ButtonColumnsControl from './button-by-type/columns_control/ButtonColumnsControl';
import ButtonWaybillExport from './button-by-type/waybill/ButtonWaybillExport';
import ButtonExportFiltredData from './button-by-type/ButtonExportFiltredData';
import ButtonInspectShowActs from './button-by-type/inspect/ButtonInspectShowActs';
import ButtonInspectGetActs from './button-by-type/inspect/ButtonInspectGetActs';
import ButtonOrderCreateMission from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/ButtonOrderCreateMission';
import ButtonOrderCreateDutyMission from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/ButtonOrderCreateDutyMission';
import ButtonOrderExport from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/ButtonOrderExport';
import ButtonCarsConditionTableDefectsForm from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonCarsConditionTableDefectsForm';
import ButtonOrderToCreateMission from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/ButtonOrderToCreateMission';
import ButtonOrderToCreateDutyMission from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/ButtonOrderToCreateDutyMission';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import ButtonAddNewRowTable from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/ButtonAddNewRowTable';

type Props = CommonTypesForButton;

type AllButtons = Record<typeof buttonsTypes[keyof typeof buttonsTypes], React.ComponentType<CommonTypesForButton & Record<string, any>>>;

const buttonComponents: AllButtons = {
  [buttonsTypes.export]: ButtonExport,
  [buttonsTypes.export_filtred_data]: ButtonExportFiltredData,
  [buttonsTypes.show_сars_condition_table_defects]: ButtonCarsConditionTableDefectsForm,
  [buttonsTypes.ButtonAddNewRowTable]: ButtonAddNewRowTable,
  [buttonsTypes.filter]: ButtonToggleFilter,
  [buttonsTypes.create]: ButtonCreate,
  [buttonsTypes.read]: ButtonRead,
  [buttonsTypes.remove]: ButtonRemove,
  [buttonsTypes.change_driver_technical_operation_relations ]: ButtonChangeDriverTechnicalOperationRelations,
  [buttonsTypes.change_route_technical_operation_relations ]: ButtonChangeRouteTechnicalOperationRelations,
  [buttonsTypes.duty_missions_remove ]: ButtonRemoveDutyMission,
  [buttonsTypes.duty_missions_export ]: ButtonExportDutyMission,
  [buttonsTypes.duty_missions_fail ]: ButtonFailDutyMission,
  [buttonsTypes.duty_missions_complete ]: ButtonCompleteDutyMission,
  [buttonsTypes.duty_missions_to_archvie ]: ButtonToArchiveDutyMission,
  [buttonsTypes.duty_missions_from_archvie]: ButtonFromArchiveDutyMission,
  [buttonsTypes.missions_by_templates]: ButtonCreateMissionTemplate,
  [buttonsTypes.inspect_show_acts]: ButtonInspectShowActs,
  [buttonsTypes.inspect_get_acts]: ButtonInspectGetActs,
  [buttonsTypes.waybill_print]: ButtonWaybillExport,
  [buttonsTypes.edc_request_create_mission]: ButtonCreateMissionByEdcRequest,
  [buttonsTypes.edc_request_create_duty_mission]: ButtonCreateDutyMissionByEdcRequest,
  [buttonsTypes.edc_request_reject]: ButtonRejectEdcRequest,
  [buttonsTypes.edc_request_cancel]: ButtonCancelEdcRequest,
  [buttonsTypes.edc_request_close]: ButtonCloseEdcRequest,
  [buttonsTypes.duty_missions_by_templates]: ButtonCreateDutyMission,
  [buttonsTypes.mission_create]: ButtonCreateMission,
  [buttonsTypes.mission_create_by_order]: ButtonCreateMissionByOrder,
  [buttonsTypes.missions_remove]: ButtonRemoveMission,
  [buttonsTypes.missions_export]: ButtonExportMission,
  [buttonsTypes.missions_complete]: ButtonCompleteMission,
  [buttonsTypes.missions_fail]: ButtonFailMission,
  [buttonsTypes.missions_to_archvie]: ButtonToArchiveMission,
  [buttonsTypes.missions_from_archvie]: ButtonFromArchiveMission,
  [buttonsTypes.columns_control]: ButtonColumnsControl,
  [buttonsTypes.order_create_mission_by_templates]: ButtonOrderCreateMission,
  [buttonsTypes.order_create_duty_mission_by_templates]: ButtonOrderCreateDutyMission,
  [buttonsTypes.order_export]: ButtonOrderExport,
  [buttonsTypes.order_to_create_mission]: ButtonOrderToCreateMission,
  [buttonsTypes.order_to_create_duty_mission]: ButtonOrderToCreateDutyMission,
};

const ComponentButton: React.FC<Props> = (props) => {
  const { data } = props;

  const ButtonNameComponent = React.useMemo(
    () => data && buttonComponents[data.type],
    [data],
  );

  if (ButtonNameComponent) {
    return (
      <ButtonNameComponent registryKey={props.registryKey} data={data} />
    );
  }

  return <div>Не определён тип для {data.type}</div>;
};

export default React.memo(ComponentButton);
