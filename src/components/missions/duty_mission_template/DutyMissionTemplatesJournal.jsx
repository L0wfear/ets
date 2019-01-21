import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';

import permissions from 'components/missions/duty_mission_template/config-data/permissions';
import permissions_duty_mission from 'components/missions/duty_mission/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import DutyMissionTemplateFormWrap from 'components/missions/duty_mission_template/DutyMissionTemplateFormWrap';
import DutyMissionTemplatesTable from 'components/missions/duty_mission_template/DutyMissionTemplatesTable';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

const ButtonCreateDutyMissionByTemplate = withRequirePermissionsNew({
  permissions: permissions_duty_mission.create,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@staticProps({
  entity: 'duty_mission_template',
  permissions,
  listName: 'dutyMissionTemplatesList',
  tableComponent: DutyMissionTemplatesTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class DutyMissionTemplatesJournal extends CheckableElementsList {

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      formType: 'ViewForm',
      listData: [],
    });
  }
  removeElementAction = id => this.context.flux.getActions('missions').removeDutyMissionTemplate(id).then(this.updateTable);

  init() {
    const { flux } = this.context;

    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getMissionSources();
    flux.getActions('employees').getEmployees().then(this.updateTable);
  }

  updateTable = () => {
    const { flux } = this.context;

    return flux.getActions('missions').getDutyMissionTemplates();
  }

  showForm = () => {
    this.setState({ showForm: true, formType: 'ViewForm' });
  }

  createDutyMissions = () =>
    this.setState({ showForm: true, formType: 'MissionsCreationForm' });

  /**
   * @override
   */
  createElement = () => {
    this.setState({
      showForm: true,
      selectedElement: null,
      formType: 'ViewForm',
    });
  }

  getForms = () => {
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
  getButtons = () => {
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

  getAdditionalProps = () => {
    const listName = this.constructor.listName;
    const listData = this.props[listName];

    const { structures } = this.props.userData;
    const technicalOperationIdsList = this.props.technicalOperationsList.map((item) => item.id);

    const dutyMissionTemplatesList = listData
      .filter(mission => technicalOperationIdsList.includes(mission.technical_operation_id));

    return {
      structures,
      data: dutyMissionTemplatesList,
    };
  }
}

export default compose(
  connect(
    state => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(DutyMissionTemplatesJournal);
