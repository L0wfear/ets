
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

type PropsComponentButton = {
  type: string;
  registryKey: string;
};

class ComponentButton extends React.PureComponent<PropsComponentButton, {}> {
  render() {
    const { type } = this.props;

    if (type === buttonsTypes.export) {
      return (
        <ButtonExport registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.filter) {
      return (
        <ButtonToggleFilter registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.create) {
      return (
        <ButtonCreate registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.read) {
      return (
        <ButtonRead registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.remove) {
      return (
        <ButtonRemove registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.duty_missions_by_templates) {
      return (
        <ButtonCreateDutyMission registryKey={this.props.registryKey} />
      );
    }
    if (type === buttonsTypes.edc_request_create_mission) {
      return (
        <ButtonCreateMissionByEdcRequest registryKey={this.props.registryKey} />
      );
    }
    if (type === buttonsTypes.edc_request_create_duty_mission) {
      return (
        <ButtonCreateDutyMissionByEdcRequest registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.edc_request_reject) {
      return (
        <ButtonRejectEdcRequest registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.edc_request_cancel) {
      return (
        <ButtonCancelEdcRequest registryKey={this.props.registryKey} />
      );
    }

    if (type === buttonsTypes.edc_request_close) {
      return (
        <ButtonCloseEdcRequest registryKey={this.props.registryKey} />
      );
    }

    return <div>Не определён тип для {type}</div>;

  }
}

export default ComponentButton;
