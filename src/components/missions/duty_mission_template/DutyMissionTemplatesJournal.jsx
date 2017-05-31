import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { Button } from 'react-bootstrap';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import DutyMissionTemplateFormWrap from './DutyMissionTemplateFormWrap.jsx';
import DutyMissionTemplatesTable from './DutyMissionTemplatesTable.jsx';

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@staticProps({
  entity: 'duty_mission_template',
  listName: 'dutyMissionTemplatesList',
  tableComponent: DutyMissionTemplatesTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
@autobind
export default class DutyMissionTemplatesJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('missions').removeDutyMissionTemplate;
    this.state = Object.assign(this.state, {
      formType: 'ViewForm',
    });
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { payload = {} } = this.props;
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getDutyMissionTemplates(payload);
    flux.getActions('missions').getMissionSources();
  }

  showForm() {
    this.setState({ showForm: true, formType: 'ViewForm' });
  }

  createDutyMissions() {
    this.setState({ showForm: true, formType: 'MissionsCreationForm' });
  }

  /**
   * @override
   */
  createElement() {
    this.setState({
      showForm: true,
      selectedElement: null,
      formType: 'ViewForm',
    });
  }

  getForms() {
    return [
      <DutyMissionTemplateFormWrap
        key={'form'}
        onFormHide={this.onFormHide.bind(this)}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        formType={this.state.formType}
        missions={this.state.checkedElements}
      />,
    ];
  }

  /**
   * @override
   */
  getButtons() {
    const buttons = super.getButtons();
    // TODO отображение Сформировать наряд-задание в зависимости от прав 
    buttons.push(
      <Button
        key={buttons.length + 1}
        bsSize="small"
        onClick={this.createDutyMissions.bind(this)}
        disabled={!this.hasCheckedElements()}
      >
        Сформировать наряд-задание
      </Button>
    );

    return buttons;
  }

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const technicalOperationIdsList = this.props.technicalOperationsList.map(item => item.id);

    const dutyMissionTemplatesList = this.props.dutyMissionTemplatesList
      .filter(mission => technicalOperationIdsList.includes(mission.technical_operation_id));

    return {
      structures,
      data: dutyMissionTemplatesList,
    };
  }
}
