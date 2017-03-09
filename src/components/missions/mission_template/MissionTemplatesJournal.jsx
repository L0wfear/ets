import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Button, Glyphicon } from 'react-bootstrap';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import MissionTemplateFormWrap from './MissionTemplateFormWrap.jsx';
import MissionTemplatesTable from './MissionTemplatesTable.jsx';

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@staticProps({
  entity: 'mission_template',
  listName: 'missionTemplatesList',
  tableComponent: MissionTemplatesTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
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
    return [
      <MissionTemplateFormWrap
        key={'form'}
        onFormHide={this.onFormHide}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        formType={this.state.formType}
        missions={this.state.checkedElements}
      />,
    ];
  }

  getButtons() {
    const buttons = super.getButtons();

    const additionalButtons = [
      <Button key={buttons.length + 1} bsSize="small" onClick={this.createMissions} disabled={_.keys(this.state.checkedElements).length === 0}>Сформировать задание</Button>,
      <Button key={buttons.length + 2} bsSize="small" onClick={this.copyElement} disabled={this.state.selectedElement === null}><Glyphicon glyph="copy" /> Копировать</Button>,
    ];
    buttons.push(...additionalButtons);

    return buttons;
  }

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    return {
      structures,
      noHeader: this.props.renderOnly,
      noDataMessage: this.props.payload.faxogramm_id ? 'Для выбранной факсограммы нет подходящих шаблонов заданий' : null,
    };
  }
}
