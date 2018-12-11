import * as React from 'react';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
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
class MissionTemplatesJournal extends CheckableElementsList {
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

  constructor(props) {
    super(props);

    this.state = Object.assign(this.state, {
      formType: 'ViewForm',
    });
  }

    /**
   * Дополнительная проверка на наличие выбранных элементов
   * @override
   */
  checkDisabledDelete() {
    return super.checkDisabledDelete() && !this.hasCheckedElements();
  }

  /**
   * Удаляет выбранные элементы
   * метод вызывает {@link ElementsList#removeElement} в случае отсутствия выбранных элементов
   */
  removeCheckedElements = async () => {
    const checkedMissions = Object.values(this.state.checkedElements);

    if (!checkedMissions.length) {
      checkedMissions.push(this.state.selectedElement);
    }

    if (checkedMissions.length) {
      try {
        await confirmDialog({
          title: 'Внимание!',
          body: 'Вы уверены, что хотите удалить выбранные элементы?',
        });
      } catch (er) {
        return;
      }

      try {
        await Promise.all(
          checkedMissions.map(mission => (
            this.context.flux.getActions('missions').removeMissionTemplate(mission.id)
          )),
        );
      } catch (e) {
        //
      }

      this.loadMissionTemplate();
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    }
  }

  loadMissionTemplate(payload) {
    this.context.flux.getActions('missions').getMissionTemplates(payload);
  }

  init() {
    const { flux } = this.context;
    const { payload = {} } = this.props;
    this.loadMissionTemplate(payload);
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('routes').getRoutes();
    flux.getActions('objects').getCars();
    flux.getActions('missions').getMissionTemplatesCars();
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
        key="form"
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
        key="create-missions-by-template"
        id="create-missions-by-template"
        bsSize="small"
        onClick={this.createMissions}
        disabled={!this.canCreateMission()}
      >
        Сформировать децентрализованное задание
      </ButtonCreateMissionsByTemplates>,
      <ButtonCopyTemplateMission
        key="copy-template"
        id="copy-template"
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

export default MissionTemplatesJournal;
