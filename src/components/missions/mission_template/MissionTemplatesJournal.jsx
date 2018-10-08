import * as React from 'react';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Glyphicon } from 'react-bootstrap';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import permissions from 'components/missions/mission_template/config-data/permissions';
import permissions_mission from 'components/missions/mission/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

import MissionTemplateFormWrap from './MissionTemplateFormWrap';
import MissionTemplatesTable from './MissionTemplatesTable';

const getMissionList = (checkedItems, selectedItem) => {
  if (Object.keys(checkedItems).length > 0) {
    return checkedItems;
  }

  if (selectedItem === null) {
    return checkedItems;
  }

  if (checkedItems[selectedItem.id]) {
    return checkedItems;
  }

  return {
    [selectedItem.id]: selectedItem,
  };
};

const ButtonCreateMissionsByTemplates = enhanceWithPermissions({
  permission: permissions_mission.create,
})(Button);
const ButtonCopyTemplateMission = enhanceWithPermissions({
  permission: permissions.create,
})(Button);

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@staticProps({
  entity: 'mission_template',
  listName: 'missionTemplatesList',
  permissions,
  tableComponent: MissionTemplatesTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
})
export default class MissionTemplatesJournal extends CheckableElementsList {

  static get propTypes() {
    return {
      renderOnly: PropTypes.bool,
      payload: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {
      renderOnly: false,
      payload: {},
    };
  }

  constructor(props, context) {
    super(props);

    this.state = Object.assign(this.state, {
      formType: 'ViewForm',
    });
  }

  removeElementAction = (...arg) => this.context.flux.getActions('missions').removeMissionTemplate(...arg);

  init() {
    const { flux } = this.context;
    const { payload = {} } = this.props;
    flux.getActions('missions').getMissionTemplates(payload);
    // flux.getActions('objects').getWorkKinds();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('routes').getRoutes();
    flux.getActions('objects').getCars();
  }

  /**
   * @override
   */
  showForm = () => {
    this.setState({ showForm: true, formType: 'ViewForm' });
  }

  createMissions = () => {
    this.setState({ showForm: true, formType: 'MissionsCreationForm' });
  }

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

  copyElement = () => {
    const copiedElement = _.cloneDeep(this.state.selectedElement);
    delete copiedElement.id;
    delete copiedElement.name;
    this.setState({
      showForm: true,
      formType: 'ViewForm',
      selectedElement: _.cloneDeep(copiedElement),
    });
  }

  getForms = () => {
    const missions = getMissionList(this.state.checkedElements, this.state.selectedElement);
    const { carsIndex = {} } = this.props;

    return [
      <MissionTemplateFormWrap
        key={'form'}
        onFormHide={this.onFormHide}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        formType={this.state.formType}
        missions={missions}
        _carsIndex={carsIndex}
      />,
    ];
  }

  canCreateMission = () => {
    const { checkedElements = {} } = this.state;
    const missions = Object.values(checkedElements);

    return missions.length && !missions.some(({ kind_task_ids = [] }) => !kind_task_ids.includes(3));
  }

  getButtons = () => {
    const buttons = super.getButtons();
    // TODO отображение Сформировать задание в зависимости от прав 
    const additionalButtons = [
      <ButtonCreateMissionsByTemplates
        key={'create-missions-by-template'}
        bsSize="small"
        onClick={this.createMissions}
        disabled={!this.canCreateMission()}
      >
        Сформировать децентрализованное задание
      </ButtonCreateMissionsByTemplates>,
      <ButtonCopyTemplateMission
        key={'copy-template'}
        bsSize="small"
        onClick={this.copyElement}
        disabled={this.state.selectedElement === null}
      >
        <Glyphicon glyph="copy" /> Копировать
      </ButtonCopyTemplateMission>,
    ];
    buttons.push(...additionalButtons);

    return buttons;
  }

  getAdditionalProps = () => {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const technicalOperationIdsList = this.props.technicalOperationsList.map(item => item.id);

    const missionTemplatesList = this.props.missionTemplatesList
      .filter(mission => technicalOperationIdsList.includes(mission.technical_operation_id));


    return {
      structures,
      noHeader: this.props.renderOnly,
      noDataMessage: this.props.payload.faxogramm_id ? 'Для выбранной централизованного задания нет подходящих шаблонов заданий' : null,
      data: missionTemplatesList,
    };
  }
}
