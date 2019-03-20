import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';

import permissions from 'components/missions/duty_mission_template/config-data/permissions';
import permissions_duty_mission from 'components/missions/duty_mission/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import DutyMissionTemplatesTable from 'components/missions/duty_mission_template/DutyMissionTemplatesTable';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  getSessionState,
  getMissionsState,
} from 'redux-main/reducers/selectors';
import DutyMissionTemplateFormLazy from 'components/missions/duty_mission_template/form/template';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import DutyMissionTemplateCreatingFormLazy from './form/creating';

const loadingPageName = 'duty_mission_template';

const ButtonCreateDutyMissionByTemplate = withRequirePermissionsNew({
  permissions: permissions_duty_mission.create,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@staticProps({
  entity: 'duty_mission_template',
  permissions,
  listName: 'dutyMissionTemplateList',
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

  removeElementAction = (id) => {
    try {
      this.props.actionRemoveDutyMissionTemplate(
        { id },
        { page: loadingPageName },
      );
    } catch (error) {
      console.warn(error); // eslint-disable-line
      return;
    }
    this.updateTable();
  };

  async init() {
    const { flux } = this.context;

    await Promise.all([
      flux.getActions('technicalOperation').getTechnicalOperations(),
      flux.getActions('employees').getEmployees(),
    ]);

    this.updateTable();
  }

  componentWillUnmount() {
    this.props.actionResetDutyMissionTemplate();
  }

  updateTable = () => {
    this.props.actionGetAndSetInStoreDutyMissionTemplate(
      {},
      { page: loadingPageName },
    );
  };

  showForm = () => {
    this.setState({ showForm: true, formType: 'ViewForm' });
  };

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
  };

  onFormHide = (clearCheckedElements) => {
    this.setState(({ checkedElements }) => ({
      showForm: false,
      selectedElement: null,
      checkedElements: clearCheckedElements ? {} : checkedElements,
      formType: 'ViewForm',
    }));
  };

  onDutyMissionTemplateFormHide = (isSubmitted) => {
    if (isSubmitted) {
      this.updateTable();
    }

    this.setState({
      showForm: false,
      selectedElement: null,
      formType: 'ViewForm',
      checkedElements: {},
    });
  };

  onDutyMissionTemplateCreatingFormHide = () => {
    this.setState({
      showForm: false,
      formType: 'ViewForm',
      selectedElement: null,
      checkedElements: {},
    });
  };

  getForms = () => {
    return [
      <DutyMissionTemplateFormLazy
        key="form_create_duty_mission_template"
        element={this.state.selectedElement}
        showForm={this.state.showForm && this.state.formType === 'ViewForm'}
        onFormHide={this.onDutyMissionTemplateFormHide}
        page={loadingPageName}
      />,
      <DutyMissionTemplateCreatingFormLazy
        key="form_create_duty_mission"
        onFormHide={this.onDutyMissionTemplateCreatingFormHide}
        showForm={
          this.state.showForm && this.state.formType === 'MissionsCreationForm'
        }
        element={null}
        dutyMissionTemplates={this.state.checkedElements}
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

  /**
   * @override
   */
  getButtons = () => {
    const buttons = super.getButtons();
    // TODO отображение Сформировать наряд-задание в зависимости от прав
    buttons.push(
      <ButtonCreateDutyMissionByTemplate
        key="create-duty-mission-by-template"
        bsSize="small"
        onClick={this.createDutyMissions}
        disabled={!this.canCreateMission()}>
        Сформировать наряд-задание
      </ButtonCreateDutyMissionByTemplate>,
    );

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
      dutyMissionTemplateList: getMissionsState(state).dutyMissionTemplateList,
      userData: getSessionState(state).userData,
    }),
    (dispatch) => ({
      actionGetAndSetInStoreDutyMissionTemplate: (...arg) =>
        dispatch(
          missionsActions.actionGetAndSetInStoreDutyMissionTemplate(...arg),
        ),
      actionRemoveDutyMissionTemplate: (missionTemplate) =>
        dispatch(
          missionsActions.actionRemoveDutyMissionTemplate(missionTemplate, {
            page: loadingPageName,
          }),
        ),
      actionResetDutyMissionTemplate: () =>
        dispatch(missionsActions.actionResetDutyMissionTemplate()),
    }),
  ),
)(DutyMissionTemplatesJournal);
