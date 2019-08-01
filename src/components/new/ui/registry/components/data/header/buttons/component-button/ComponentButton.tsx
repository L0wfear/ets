
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
import ButtonReadCarsConditionsCar from './button-by-type/cars_conditions_car/ButtonReadCarsConditionsCar';
import ButtonReadEmployeeOnCar from './button-by-type/employee_on_car/ButtonReadEmployeeOnCar';
import ButtonChangeDriverTechnicalOperationRelations from './button-by-type/technical_operation_relations/ButtonChangeDriverTechnicalOperationRelations';
import ButtonChangeRouteTechnicalOperationRelations from './button-by-type/technical_operation_relations/ButtonChangeRouteTechnicalOperationRelations';
import ButtonRemoveDutyMission from './button-by-type/duty_mission/ButtonRemoveDutyMission';
import ButtonExportDutyMission from './button-by-type/duty_mission/ButtonExportDutyMission';
import ButtonCompleteDutyMission from './button-by-type/duty_mission/ButtonCompleteDutyMission';
import ButtonToArchiveDutyMission from './button-by-type/duty_mission/ButtonToArchiveDutyMission';
import ButtonFailDutyMission from './button-by-type/duty_mission/ButtonFailDutyMission';
import ButtonFromArchiveDutyMission from './button-by-type/duty_mission/ButtonFromArchiveDutyMission';
import ButtonCopyMissionTemplate from './button-by-type/mission_template/ButtonCopyMissionTemplate';
import ButtonCreateMissionTemplate from './button-by-type/mission_template/ButtonCreateMissionTemplate';
import ButtonCreateMission from './button-by-type/mission/ButtonCreateMission';
import ButtonCreateMissionByOrder from './button-by-type/mission/ButtonCreateMissionByOrder';
import ButtonRemoveMission from './button-by-type/mission/ButtonRemoveMission';
import ButtonExportMission from './button-by-type/mission/ButtonExportMission';
import ButtonCompleteMission from './button-by-type/mission/ButtonCompleteMission';
import ButtonToArchiveMission from './button-by-type/mission/ButtonToArchiveMission';
import ButtonFromArchiveMission from './button-by-type/mission/ButtonFromArchiveMission';
import ButtonFailMission from './button-by-type/mission/ButtonFailMission';
import ButtonCreateCompanyStructure from './button-by-type/company_structure/ButtonCreateCompanyStructure';
import ButtonColumnsControl from './button-by-type/columns_control/ButtonColumnsControl';
import ButtonWaybillExport from './button-by-type/waybill/ButtonWaybillExport';
import ButtonExportFiltredData from './button-by-type/ButtonExportFiltredData';
import ButtonInspectShowActs from './button-by-type/inspect/ButtonInspectShowActs';
import ButtonCarActualAddBattery from './button-by-type/car_actual/ButtonCarActualAddBattery';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ButtonCarActualAddTire from './button-by-type/car_actual/ButtonCarActualAddTire';

type PropsComponentButton = {
  data: ValuesOf<OneRegistryData['header']['buttons']>;
  registryKey: string;
};

const buttonComponents = {
  [buttonsTypes.export]: ButtonExport,
  [buttonsTypes.export_filtred_data]: ButtonExportFiltredData,
  [buttonsTypes.filter]: ButtonToggleFilter,
  [buttonsTypes.create]: ButtonCreate,
  [buttonsTypes.read]: ButtonRead,
  [buttonsTypes.remove]: ButtonRemove,
  [buttonsTypes.duty_missions_by_templates]: ButtonCreateDutyMission,
  [buttonsTypes.edc_request_create_mission]: ButtonCreateMissionByEdcRequest,
  [buttonsTypes.edc_request_create_duty_mission]: ButtonCreateDutyMissionByEdcRequest,
  [buttonsTypes.edc_request_reject]: ButtonRejectEdcRequest,
  [buttonsTypes.edc_request_cancel]: ButtonCancelEdcRequest,
  [buttonsTypes.edc_request_close]: ButtonCloseEdcRequest,
  [buttonsTypes.read_cars_contisions_car]: ButtonReadCarsConditionsCar,
  [buttonsTypes.read_employee_on_car]: ButtonReadEmployeeOnCar,
  [buttonsTypes.change_driver_technical_operation_relations ]: ButtonChangeDriverTechnicalOperationRelations,
  [buttonsTypes.change_route_technical_operation_relations ]: ButtonChangeRouteTechnicalOperationRelations,
  [buttonsTypes.duty_missions_remove ]: ButtonRemoveDutyMission,
  [buttonsTypes.duty_missions_export ]: ButtonExportDutyMission,
  [buttonsTypes.duty_missions_fail ]: ButtonFailDutyMission,
  [buttonsTypes.duty_missions_complete ]: ButtonCompleteDutyMission,
  [buttonsTypes.duty_missions_to_archvie ]: ButtonToArchiveDutyMission,
  [buttonsTypes.duty_missions_from_archvie]: ButtonFromArchiveDutyMission,
  [buttonsTypes.missions_by_templates]: ButtonCreateMissionTemplate,
  [buttonsTypes.copy_template]: ButtonCopyMissionTemplate,
  [buttonsTypes.mission_create]: ButtonCreateMission,
  [buttonsTypes.mission_create_by_order]: ButtonCreateMissionByOrder,
  [buttonsTypes.missions_remove]: ButtonRemoveMission,
  [buttonsTypes.missions_export]: ButtonExportMission,
  [buttonsTypes.missions_complete]: ButtonCompleteMission,
  [buttonsTypes.missions_fail]: ButtonFailMission,
  [buttonsTypes.missions_to_archvie]: ButtonToArchiveMission,
  [buttonsTypes.missions_from_archvie]: ButtonFromArchiveMission,
  [buttonsTypes.company_structure_create]: ButtonCreateCompanyStructure,
  [buttonsTypes.columns_control]: ButtonColumnsControl,
  [buttonsTypes.waybill_print]: ButtonWaybillExport,
  [buttonsTypes.inspect_show_acts]: ButtonInspectShowActs,
  [buttonsTypes.car_actual_add_battery]: ButtonCarActualAddBattery,
  [buttonsTypes.car_actual_add_tire]: ButtonCarActualAddTire,
};

const ComponentButton: React.FC<PropsComponentButton> = (props) => {
  const { data } = props;

  const ButtonNameComponent = React.useMemo(
    () => buttonComponents[data.type],
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
