
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

type PropsComponentButton = {
  type: string;
  registryKey: string;
};

const getButtomNameComponent = (type: string) => {
  switch (type) {
    case buttonsTypes.export: return ButtonExport;
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
    default: return null;
  }
};

const ComponentButton: React.FC<PropsComponentButton> = (props) => {
  const { type } = props;

  const ButtonNameComponent = getButtomNameComponent(type);

  if (ButtonNameComponent) {
    return (
      <ButtonNameComponent registryKey={props.registryKey} />
    );
  }

  return <div>Не определён тип для {type}</div>;
};

export default React.memo(ComponentButton);
