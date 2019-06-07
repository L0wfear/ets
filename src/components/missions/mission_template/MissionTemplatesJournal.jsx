import * as React from 'react';
import * as PropTypes from 'prop-types';
import _, { cloneDeep, find } from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import permissions from 'components/missions/mission_template/config-data/permissions';
import permissions_mission from 'components/missions/mission/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

import MissionTemplateFormWrap from 'components/missions/mission_template/MissionTemplateFormWrap';
import MissionTemplatesTable from 'components/missions/mission_template/MissionTemplatesTable';
import { compose } from 'recompose';
import { getWarningNotification } from 'utils/notifications';
import { validateMissionsByCheckedElements } from './utils';

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

@connectToStores(['missions', 'objects', 'employees'])
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
    const { checkedElements } = this.state;
    const allCheckedMissionInArr = Object.values(checkedElements);
    const hasMissionForColumn = allCheckedMissionInArr.some(mission => mission.for_column);

    if (hasMissionForColumn && allCheckedMissionInArr.length > 1) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Для создания задания на колонну необходимо выбрать только 1 шаблон!',
        ),
      );
      return;
    }
    if (allCheckedMissionInArr.some(({ front_invalid_interval }) => front_invalid_interval)) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Выбраны шаблоны, которые создадут одинаковые задания, с пересекающимся периодом. Необходимо исключить пересекающиеся шаблоны (выделены красным)',
        ),
      );
      return;
    }

    this.setState({
      showForm: true,
      formType: 'MissionsCreationForm',
    });
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

  onFormHide = (clearCheckedElements) => {
    this.setState(({ checkedElements }) => ({
      showForm: false,
      selectedElement: null,
      formType: 'ViewForm',
      checkedElements: clearCheckedElements ? {} : checkedElements,
    }));
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
        <Glyphicon glyph="copy" />
        Копировать
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

  /**
   * @override
   */
  checkAll = (rows, state) => {
    let checkedElements = cloneDeep(this.state.checkedElements);
    checkedElements = state ? rows : {};

    this.setState({ checkedElements: validateMissionsByCheckedElements(checkedElements, true) }, this.stateChangeCallback.bind(this));
  }

  /**
   * @override
   */
  checkElement = (id, state) => {
    const elements = cloneDeep(this.state.checkedElements);
    if (state) {
      const checkedElement = find(this.state.elementsList, e => e[this.selectField] === parseInt(id, 10));
      if (checkedElement) {
        elements[parseInt(id, 10)] = checkedElement;
      }
    } else {
      delete elements[id];
    }
    this.setState({ checkedElements: validateMissionsByCheckedElements(elements, true) }, this.stateChangeCallback.bind(this));
  }
}

export default compose()(MissionTemplatesJournal);
