
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

type PropsComponentButton = {
  type: string;
  registryKey: string;
};

const getButtomNameComponent = (type: string) => {
  switch (type) {
    case buttonsTypes.export: return ButtonExport;
    case buttonsTypes.export_filtred_data: return ButtonExportFiltredData;
    case buttonsTypes.filter: return ButtonToggleFilter;
    case buttonsTypes.create: return ButtonCreate;
    case buttonsTypes.read: return ButtonRead;
    case buttonsTypes.remove: return ButtonRemove;
    case buttonsTypes.duty_missions_by_templates: return ButtonCreateDutyMission;
    case buttonsTypes.edc_request_create_mission: return ButtonCreateMissionByEdcRequest;
    case buttonsTypes.edc_request_create_duty_mission: return ButtonCreateDutyMissionByEdcRequest;
    case buttonsTypes.edc_request_reject: return ButtonRejectEdcRequest;
    case buttonsTypes.edc_request_cancel: return ButtonCancelEdcRequest;
    case buttonsTypes.edc_request_close: return ButtonCloseEdcRequest;
    case buttonsTypes.read_cars_contisions_car: return ButtonReadCarsConditionsCar;
    case buttonsTypes.read_employee_on_car: return ButtonReadEmployeeOnCar;
    case buttonsTypes.change_driver_technical_operation_relations : return ButtonChangeDriverTechnicalOperationRelations;
    case buttonsTypes.change_route_technical_operation_relations : return ButtonChangeRouteTechnicalOperationRelations;
    case buttonsTypes.duty_missions_remove : return ButtonRemoveDutyMission;
    case buttonsTypes.duty_missions_export : return ButtonExportDutyMission;
    case buttonsTypes.duty_missions_fail : return ButtonFailDutyMission;
    case buttonsTypes.duty_missions_complete : return ButtonCompleteDutyMission;
    case buttonsTypes.duty_missions_to_archvie : return ButtonToArchiveDutyMission;
    case buttonsTypes.duty_missions_from_archvie: return ButtonFromArchiveDutyMission;
    case buttonsTypes.missions_by_templates: return ButtonCreateMissionTemplate;
    case buttonsTypes.copy_template: return ButtonCopyMissionTemplate;
    case buttonsTypes.mission_create: return ButtonCreateMission;
    case buttonsTypes.mission_create_by_order: return ButtonCreateMissionByOrder;
    case buttonsTypes.missions_remove: return ButtonRemoveMission;
    case buttonsTypes.missions_export: return ButtonExportMission;
    case buttonsTypes.missions_complete: return ButtonCompleteMission;
    case buttonsTypes.missions_fail: return ButtonFailMission;
    case buttonsTypes.missions_to_archvie: return ButtonToArchiveMission;
    case buttonsTypes.missions_from_archvie: return ButtonFromArchiveMission;
    case buttonsTypes.company_structure_create: return ButtonCreateCompanyStructure;
    case buttonsTypes.columns_control: return ButtonColumnsControl;
    case buttonsTypes.waybill_print: return ButtonWaybillExport;

    default: return null;
  }
};

const ComponentButton: React.FC<PropsComponentButton> = (props) => {
  const { type } = props;

  const ButtonNameComponent = React.useMemo(
    () => getButtomNameComponent(type),
    [type],
  );

  if (ButtonNameComponent) {
    return (
      <ButtonNameComponent registryKey={props.registryKey} />
    );
  }

  return <div>Не определён тип для {type}</div>;
};

export default React.memo(ComponentButton);
