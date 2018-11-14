import * as React from 'react';
import { autobind } from 'core-decorators';
import { Button } from 'react-bootstrap';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

import permissions from 'components/missions/duty_mission_template/config-data/permissions';
import permissions_duty_mission from 'components/missions/duty_mission/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew.tsx';

import DutyMissionTemplateFormWrap from './DutyMissionTemplateFormWrap.jsx';
import DutyMissionTemplatesTable from './DutyMissionTemplatesTable.jsx';

const ButtonCreateDutyMissionByTemplate = enhanceWithPermissions({
  permission: permissions_duty_mission.create,
})(Button);

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@staticProps({
  entity: 'duty_mission_template',
  permissions,
  listName: 'dutyMissionTemplatesList',
  tableComponent: DutyMissionTemplatesTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
@autobind
export default class DutyMissionTemplatesJournal extends CheckableElementsList {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      formType: 'ViewForm',
      listData: [],
    });
  }
  removeElementAction = id => this.context.flux.getActions('missions').removeDutyMissionTemplate(id).then(this.updateTable);

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getMissionSources();
    flux.getActions('employees').getEmployees().then(this.updateTable);
  }

  updateTable = () => {
    const { flux } = this.context;

    return flux.getActions('missions').getDutyMissionTemplates();
  }

  showForm() {
    this.setState({ showForm: true, formType: 'ViewForm' });
  }

  createDutyMissions = () =>
    this.setState({ showForm: true, formType: 'MissionsCreationForm' });

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
    const { employeesIndex = {} } = this.props;

    return [
      <DutyMissionTemplateFormWrap
        key={'form'}
        onFormHide={this.onFormHide.bind(this)}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        formType={this.state.formType}
        missions={this.state.checkedElements}
        updateTable={this.updateTable}
        _employeesIndex={employeesIndex}
      />,
    ];
  }

  canCreateMission = () => {
    const { checkedElements = {} } = this.state;
    const missions = Object.values(checkedElements);

    return missions.length && !missions.some(({ kind_task_ids = [] }) => !kind_task_ids.includes(3));
  }

  /**
   * @override
   */
  getButtons() {
    const buttons = super.getButtons();
    // TODO отображение Сформировать наряд-задание в зависимости от прав
    buttons.push(
      <ButtonCreateDutyMissionByTemplate
        key={'create-duty-mission-by-template'}
        bsSize="small"
        onClick={this.createDutyMissions}
        disabled={!this.canCreateMission()}
      >
        Сформировать наряд-задание
      </ButtonCreateDutyMissionByTemplate>
    );

    return buttons;
  }

  getAdditionalProps() {
    const listName = this.constructor.listName;
    const listData = this.props[listName];

    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const technicalOperationIdsList = this.props.technicalOperationsList.map(item => item.id);

    const dutyMissionTemplatesList = listData
      .filter(mission => technicalOperationIdsList.includes(mission.technical_operation_id));

    return {
      structures,
      data: dutyMissionTemplatesList,
    };
  }
}
