import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { validateField } from 'utils/validate/validateField.js';
import { getDefaultMission } from 'stores/MissionsStore.js';
import { saveData, printData, resizeBase64 } from 'utils/functions';
import { missionSchema } from 'models/MissionModel.js';
import MissionForm from './MissionFormNew';

export default class MissionFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = missionSchema;
  }
  createAction = formState => this.context.flux.getActions('missions').createMission(formState, true).then(() => this.props.refreshTableList());
  updateAction = formState => this.context.flux.getActions('missions').updateMission(formState, true).then(() => this.props.refreshTableList());

  onSubmit = () => this.handleFormSubmit()
  handleFormChange = (field, value) => this.handleFormStateChange(field, value)
  componentWillReceiveProps(props) {
    if (props.showForm && (props.showForm !== this.props.showForm)) {
      const mission = props.element === null ? getDefaultMission() : _.clone(props.element);
      if (mission.structure_id == null) {
        mission.structure_id = this.context.flux.getStore('session').getCurrentUser().structure_id;
      }
      const formErrors = this.validate(mission, {});
      this.setState({
        formState: mission,
        canSave: !Object.values(formErrors).some(d => !d),
        formErrors,
      });
    }
  }

  handlePrint = (ev, print_form_type = 1) => {
    const {
      formState: {
        id: mission_id,
        number,
      } = {},
     } = this.state.formState;
    const data = { mission_id };

    global.map.reset();
    global.map.once('postcompose', async (event) => {
      const routeImageBase64Data = await resizeBase64(event.context.canvas.toDataURL('image/png'));
      data.image = routeImageBase64Data;

      this.context.flux.getActions('missions').printMission(data).then(({ blob }) => {
        if (print_form_type === 1) {
          saveData(blob, `Задание №${number}.pdf`);
          return;
        }
        printData(blob);
      });
    });
    global.map.render();
  }
  getAdditionalPropsForFrom() {
    return {
      show: this.props.showForm,
      onHide: this.props.onFormHide,
    };
  }
  getMissionForm() {
    return MissionForm;
  }

  render() {
    const props = this.getAdditionalPropsForFrom();
    const CurrMissionFrom = this.getMissionForm();
    return (
      <Div hidden={!this.props.showForm}>
        <CurrMissionFrom
          formState={this.state.formState}
          onSubmit={this.onSubmit}
          handleFormChange={this.handleFormChange}
          handlePrint={this.handlePrint}
          {...props}
          {...this.state}
        />
      </Div>
    );
  }

}
