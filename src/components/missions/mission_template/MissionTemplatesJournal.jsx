import * as React from 'react';
import * as PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import permissions from 'components/missions/mission_template/config-data/permissions';
import permissions_mission from 'components/missions/mission/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import MissionsCreationFormLazy from 'components/missions/mission_template/form/creating';
import MissionTemplateFormLazy from 'components/missions/mission_template/form/template';
import MissionTemplatesTable from 'components/missions/mission_template/MissionTemplatesTable';
import { compose } from 'recompose';
import { getWarningNotification } from 'utils/notifications';
import { connect } from 'react-redux';
import {
  getSessionState,
  getMissionsState,
} from 'redux-main/reducers/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

const loadingPageName = 'mission_template';

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

const ButtonCreateMissionsByTemplates = withRequirePermissionsNew({
  permissions: permissions_mission.create,
})(Button);
const ButtonCopyTemplateMission = withRequirePermissionsNew({
  permissions: permissions.create,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@staticProps({
  entity: 'mission_template',
  listName: 'missionTemplateList',
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
        await this.props.actionRemoveMissionTemplates(checkedMissions);
      } catch (e) {
        console.warn(e); // eslint-disable-line
      }

      this.loadMissionTemplateData();
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    }
  };

  loadMissionTemplateData() {
    this.props.actionGetAndSetInStoreMissionTemplate();
    this.context.flux.getActions('missions').getMissionTemplatesCars();
  }

  componentWillUnmount() {
    this.props.actionResetMissionTemplate();
  }

  init() {
    const { flux } = this.context;
    this.loadMissionTemplateData();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  /**
   * @override
   */
  showForm = () => {
    this.setState({ showForm: true, formType: 'ViewForm' });
  };

  createMissions = () => {
    const { checkedElements } = this.state;
    const allCheckedMissionInArr = Object.values(checkedElements);
    const hasMissionForColumn = allCheckedMissionInArr.some(
      (mission) => mission.for_column,
    );

    if (hasMissionForColumn && allCheckedMissionInArr.length > 1) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Для создания задания на колонну необходимо выбрать только 1 шаблон!',
        ),
      );
    } else {
      this.setState({
        showForm: true,
        formType: 'MissionsCreationForm',
      });
    }
  };

  /**
   * @override
   */
  createElement = () => {
    this.setState({
      showForm: true,
      selectedElement: null,
      formType: 'ViewForm',
    });
  };

  copyElement = () => {
    this.setState(({ selectedElement }) => {
      const copiedElement = cloneDeep(selectedElement);
      delete copiedElement.id;
      delete copiedElement.name;
      return {
        showForm: true,
        formType: 'ViewForm',
        selectedElement: copiedElement,
      };
    });
  };

  onFormHide = (clearCheckedElements) => {
    this.setState(({ checkedElements }) => ({
      showForm: false,
      selectedElement: null,
      formType: 'ViewForm',
      checkedElements: clearCheckedElements ? {} : checkedElements,
    }));
  };

  onFormHideCreateTemplate = (isSubmitted, result) => {
    if (isSubmitted) {
      console.info(result); //DITETS-4857 добавил в CAR_OPTIONS, CAR_TYP_OPTIONS для фильтрац по ТС
      this.loadMissionTemplateData();
    }

    this.setState({
      showForm: false,
      selectedElement: null,
      formType: 'ViewForm',
      checkedElements: {},
    });
  };

  onFormHideCreating = (isSubmitted) => {
    const changeObj = {
      showForm: false,
      formType: 'ViewForm',
    };

    if (isSubmitted) {
      changeObj.selectedElement = null;
      changeObj.checkedElements = {};
    }
    this.setState(changeObj);
  };

  getForms = () => {
    const missions = getMissionList(
      this.state.checkedElements,
      this.state.selectedElement,
    );

    return [
      <MissionTemplateFormLazy
        key="template_form"
        onFormHide={this.onFormHideCreateTemplate}
        showForm={
          this.state.showForm && this.state.formType !== 'MissionsCreationForm'
        }
        element={this.state.selectedElement}
        page={loadingPageName}
      />,
      <MissionsCreationFormLazy
        key="form"
        onFormHide={this.onFormHide}
        showForm={
          this.state.showForm && this.state.formType === 'MissionsCreationForm'
        }
        missionTemplates={missions}
      />,
    ];
  };

  canCreateMission = () => {
    const { checkedElements = {} } = this.state;
    const missions = Object.values(checkedElements);

    return (
      missions.length
      && !missions.some(({ kind_task_ids = [] }) => !kind_task_ids.includes(3))
    );
  };

  getButtons = () => {
    const buttons = super.getButtons();
    // TODO отображение Сформировать задание в зависимости от прав
    const additionalButtons = [
      <ButtonCreateMissionsByTemplates
        key="create-missions-by-template"
        id="create-missions-by-template"
        bsSize="small"
        onClick={this.createMissions}
        disabled={!this.canCreateMission()}>
        Сформировать децентрализованное задание
      </ButtonCreateMissionsByTemplates>,
      <ButtonCopyTemplateMission
        key="copy-template"
        id="copy-template"
        bsSize="small"
        onClick={this.copyElement}
        disabled={this.state.selectedElement === null}>
        <Glyphicon glyph="copy" />
        Копировать
      </ButtonCopyTemplateMission>,
    ];
    buttons.push(...additionalButtons);

    return buttons;
  };

  getAdditionalFormProps() {
    return {
      page: loadingPageName,
    };
  }

  getAdditionalProps = () => {
    const { listName } = this.constructor;
    const listData = this.props[listName];

    const {
      technicalOperationsMap,
      userData: { structures },
    } = this.props;

    return {
      structures,
      data: listData.filter(({ technical_operation_id }) =>
        technicalOperationsMap.has(technical_operation_id),
      ),
    };
  };
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    (state) => ({
      missionTemplateList: getMissionsState(state).missionTemplateList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      actionGetAndSetInStoreMissionTemplate: () =>
        dispatch(
          missionsActions.actionGetAndSetInStoreMissionTemplate(
            {},
            { page: loadingPageName },
          ),
        ),
      actionRemoveMissionTemplates: (missionTemplateArr) =>
        dispatch(
          missionsActions.actionRemoveMissionTemplates(missionTemplateArr, {
            page: loadingPageName,
          }),
        ),
      actionResetMissionTemplate: () =>
        dispatch(missionsActions.actionResetMissionTemplate()),
    }),
  ),
)(MissionTemplatesJournal);
