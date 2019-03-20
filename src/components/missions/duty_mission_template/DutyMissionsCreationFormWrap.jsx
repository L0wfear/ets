import * as React from 'react';
import filter from 'lodash/filter';
import Div from 'components/ui/Div';

import { getDefaultDutyMissionsCreationTemplate } from 'stores/MissionsStore';
import dutyMissionsCreationTemplateSchema from 'models/DutyMissionsCreationTemplateModel';
import FormWrap from 'components/compositions/FormWrap';
import { checkMissionsOnStructureIdBrigade } from 'components/missions/utils/customValidate';
import DutyMissionsCreationForm from 'components/missions/duty_mission_template/DutyMissionsCreationForm';
import { DivNone } from 'global-styled/global-styled';

export const createDutyMissions = async (flux, element, payload) =>
  flux.getActions('missions').createDutyMissions(element, payload);

class DutyMissionsCreationFormWrap extends FormWrap {
  constructor(props) {
    super(props);

    this.schema = dutyMissionsCreationTemplateSchema;
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      const mission = getDefaultDutyMissionsCreationTemplate();
      this.schema = dutyMissionsCreationTemplateSchema;
      const formErrors = this.validate(mission, {});
      this.setState({
        formState: mission,
        canSave: !filter(formErrors).length, // false,
        formErrors,
      });
    }
  }

  handleFormSubmit = async () => {
    const { flux } = this.context;
    const { formState } = this.state;
    const { _employeesIndex = {} } = this.props;

    if (
      !checkMissionsOnStructureIdBrigade(
        Object.values(this.props.missions),
        _employeesIndex,
      )
    ) {
      createDutyMissions(flux, this.props.missions, formState).then(() => {
        this.props.onFormHide(true);
      });
    }
  };

  render() {
    if (this.props.formType === 'ViewForm') {
      return <DivNone />;
    }
    return (
      <Div hidden={!this.props.showForm}>
        <DutyMissionsCreationForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          missions={this.props.missions}
          {...this.state}
        />
      </Div>
    );
  }
}

export default DutyMissionsCreationFormWrap;
