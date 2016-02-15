import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import RouteInfo from '../route/RouteInfo.jsx';
import ODHList from '../route/ODHList.jsx';
import { isEmpty } from '../../utils/functions.js';
import Datepicker from '../ui/DatePicker.jsx';
import { getDateWithoutTZ } from '../../utils/dates.js';

class MissionsCreationForm extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleChange(field, e) {
    this.props.handleFormChange(field, e);
  }

  handleSubmit() {
    console.log('submitting mission template form', this.props.formState);
    this.props.onSubmit(this.props.formState);
  }

  render() {
    let state = this.props.formState;
    let errors = this.props.formErrors;

    const { workKindsList = [], techOperationsList = [], missionSourcesList = [], routesList = [], carsList = [] } = this.props;

    const WORK_KINDS = workKindsList.map(({id, name}) => ({value: id, label: name}));
    const TECH_OPERATIONS = techOperationsList.map(({id, name}) => ({value: id, label: name}));
    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));
    const ROUTES = routesList.map(({id, name}) => ({value: id, label: name}));
    const CARS = carsList.map( c => ({value: c.asuods_id, label: c.gov_number + ' [' + c.model + ']'}));

    console.log('form state is ', state);

    let IS_CREATING = true;

    let title = `Задание`;

    if (IS_CREATING) {
      title = "Формирование заданий из шаблонов"
    }

    return (
      <Modal {...this.props} bsSize="large">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6}>
              <label>Время выполнения</label>
              <Div>c <Datepicker date={ getDateWithoutTZ(state.date_start) } onChange={this.handleChange.bind(this, 'date_start')}/></Div>
            </Col>
            <Col md={6}>
              <label style={{minHeight: 15}}></label>
              <Div>по <Datepicker date={ getDateWithoutTZ(state.date_end) } onChange={this.handleChange.bind(this, 'date_end')} /></Div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field type="select" label="Источник получения задания" error={errors['mission_source_id']}
                     options={MISSION_SOURCES}
                     value={state.mission_source_id}
                     onChange={this.handleChange.bind(this, 'mission_source_id')}/>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field type="number" label="Количество проходов" error={errors['passes_count']}
                     value={state.passes_count} onChange={this.handleChange.bind(this, 'passes_count')}
                     min={0} />
            </Col>
          </Row>

        </Modal.Body>

        <Modal.Footer>
          <Div hidden={state.status === 'closed'}>
            <Button onClick={this.handleSubmit.bind(this)}>{'Сформировать'}</Button>
          </Div>
        </Modal.Footer>

      </Modal>
    )
  }
}

MissionsCreationForm.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(MissionsCreationForm, ['objects', 'employees', 'missions', 'routes']);
