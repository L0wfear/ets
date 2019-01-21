import * as React from 'react';
import clone from 'lodash/clone';
import filter from 'lodash/filter';
import Div from 'components/ui/Div';

import { getDefaultDutyMissionTemplate, getDefaultDutyMissionsCreationTemplate } from 'stores/MissionsStore';
import { isEmpty } from 'utils/functions';
import dutyMissionTemplateSchema from 'models/DutyMissionTemplateModel';
import dutyMissionsCreationTemplateSchema from 'models/DutyMissionsCreationTemplateModel';
import FormWrap from 'components/compositions/FormWrap';
import { checkMissionsOnStructureIdBrigade } from 'components/missions/utils/customValidate';
import DutyMissionTemplateForm from 'components/missions/duty_mission_template/DutyMissionTemplateForm';
import DutyMissionsCreationForm from 'components/missions/duty_mission_template/DutyMissionsCreationForm';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

export const createDutyMissions = async (flux, element, payload) => flux.getActions('missions').createDutyMissions(element, payload);

class DutyMissionTemplateFormWrap extends FormWrap {
  constructor(props) {
    super(props);

    this.schema = dutyMissionTemplateSchema;
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      if (props.formType === 'ViewForm') {
        const mission = props.element === null ? getDefaultDutyMissionTemplate() : clone(props.element);

        if (!mission.structure_id) {
          mission.structure_id = this.props.userStructureId;
        }
        const formErrors = this.validate(mission, {});
        this.setState({
          formState: mission,
          canSave: !filter(formErrors).length, // false,
          formErrors,
        });
      } else {
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
  }

  handleFormSubmit = async () => {
    const { flux } = this.context;
    const { formState } = this.state;
    const { _employeesIndex = {} } = this.props;

    if (this.props.formType === 'ViewForm') {
      try {
        if (isEmpty(formState.id)) {
          await flux.getActions('missions').createDutyMissionTemplate(formState);
        } else {
          await flux.getActions('missions').updateDutyMissionTemplate(formState);
        }
      } catch (e) {
        return;
      }
      this.props.updateTable();

      this.props.onFormHide();
    } else if (!checkMissionsOnStructureIdBrigade(Object.values(this.props.missions), _employeesIndex)) {
      createDutyMissions(flux, this.props.missions, formState).then(() => {
        this.props.onFormHide(true);
      });
    }
  }

  render() {
    if (this.props.formType === 'ViewForm') {
      return (
        <Div hidden={!this.props.showForm}>
          <DutyMissionTemplateForm
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit}
            handleFormChange={this.handleFormStateChange.bind(this)}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
            template
            {...this.state}
          />
        </Div>
      );
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

export default compose(
  connect(
    state => ({
      userStructureId: getSessionState(state).userData.structure_id,
    }),
  ),
)(DutyMissionTemplateFormWrap);
