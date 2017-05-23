import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Button, Glyphicon } from 'react-bootstrap';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import MissionTemplateFormWrap from './MissionTemplateFormWrap.jsx';
import MissionTemplatesTable from './MissionTemplatesTable.jsx';

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

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@staticProps({
  entity: 'mission_template',
  listName: 'missionTemplatesList',
  tableComponent: MissionTemplatesTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
})
@autobind
export default class MissionTemplatesJournal extends CheckableElementsList {

  static get propTypes() {
    return {
      renderOnly: React.PropTypes.bool,
      payload: React.PropTypes.object,
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

    this.removeElementAction = context.flux.getActions('missions').removeMissionTemplate;
    this.state = Object.assign(this.state, {
      formType: 'ViewForm',
    });
  }

  componentDidMount() {
    super.componentDidMount();

    const { flux } = this.context;
    const { payload = {} } = this.props;
    flux.getActions('missions').getMissionTemplates(payload);
    // flux.getActions('objects').getWorkKinds();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('routes').getRoutes();
    flux.getActions('objects').getCars();
    // flux.getActions('missions').getMissionSources();
  }

  /**
   * @override
   */
  showForm() {
    this.setState({ showForm: true, formType: 'ViewForm' });
  }

  createMissions() {
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

  copyElement() {
    const copiedElement = _.cloneDeep(this.state.selectedElement);
    delete copiedElement.id;
    delete copiedElement.name;
    this.setState({
      showForm: true,
      formType: 'ViewForm',
      selectedElement: _.cloneDeep(copiedElement),
    });
  }

  getForms() {
    const missions = getMissionList(this.state.checkedElements, this.state.selectedElement);

    return [
      <MissionTemplateFormWrap
        key={'form'}
        onFormHide={this.onFormHide}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        formType={this.state.formType}
        missions={missions}
      />,
    ];
  }

  getButtons() {
    const buttons = super.getButtons();
    const canCreateMission = (
      _.keys(this.state.checkedElements).length > 0 ||
      this.state.selectedElement !== null
    );
    // TODO отображение Сформировать задание в зависимости от прав 
    const additionalButtons = [
      <Button
        key={buttons.length + 1}
        bsSize="small"
        onClick={this.createMissions}
        disabled={!canCreateMission}
      >Сформировать задание</Button>,
      <Button
        key={buttons.length + 2}
        bsSize="small"
        onClick={this.copyElement}
        disabled={this.state.selectedElement === null}
      >
        <Glyphicon glyph="copy" /> Копировать
      </Button>,
    ];
    buttons.push(...additionalButtons);

    return buttons;
  }

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const technicalOperationIdsList = this.props.technicalOperationsList.map(item => item.id);

    const missionTemplatesList = this.props.missionTemplatesList
      .filter(mission => technicalOperationIdsList.includes(mission.technical_operation_id));


    return {
      structures,
      noHeader: this.props.renderOnly,
      noDataMessage: this.props.payload.faxogramm_id ? 'Для выбранной факсограммы нет подходящих шаблонов заданий' : null,
      data: missionTemplatesList,
    };
  }
}
