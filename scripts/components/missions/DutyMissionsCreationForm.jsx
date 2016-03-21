import React, {Component} from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, MenuItem, Glyphicon, Input } from 'react-bootstrap';
import Field from '../ui/Field.jsx';
import Div from '../ui/Div.jsx';
import RouteInfo from '../route/RouteInfo.jsx';
import ODHList from '../route/ODHList.jsx';
import { isEmpty } from 'utils/functions';
import Datepicker from '../ui/DatePicker.jsx';
import Form from '../compositions/Form.jsx';

class MissionsCreationForm extends Form {

  constructor(props) {
    super(props);
  }

  render() {
    let state = this.props.formState;
    let errors = this.props.formErrors;

    const { missionSourcesList = [] } = this.props;

    const MISSION_SOURCES = missionSourcesList.map(({id, name}) => ({value: id, label: name}));

    console.log('form state is ', state);

    let title = "Формирование заданий из шаблонов";

    return (
      <Modal {...this.props} bsSize="large">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6}>
              <label>Время выполнения</label>
              <Div>c <Datepicker date={state.date_start} onChange={this.handleChange.bind(this, 'date_start')}/></Div>
            </Col>
            <Col md={6}>
              <label style={{minHeight: 15}}></label>
              <Div>по <Datepicker date={state.date_end} onChange={this.handleChange.bind(this, 'date_end')} /></Div>
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

        </Modal.Body>

        <Modal.Footer>
          <Div className="inline-block" hidden={state.status === 'closed'}>
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

export default connectToStores(MissionsCreationForm, ['objects', 'missions']);
