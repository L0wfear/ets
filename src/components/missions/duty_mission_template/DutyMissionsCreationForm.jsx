import React from 'react';
import connectToStores from 'flummox/connect';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import Form from 'components/compositions/Form.jsx';

class MissionsCreationForm extends Form {

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    const { missionSourcesList = [] } = this.props;

    const MISSION_SOURCES = missionSourcesList.map(({ id, name }) => ({ value: id, label: name }));

    console.log('form state is ', state);

    const title = 'Формирование заданий из шаблонов';

    return (
      <Modal {...this.props} bsSize="large" backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={6}>
              <label>Время выполнения</label>
              <Div>c <Datepicker date={state.date_start} onChange={this.handleChange.bind(this, 'date_start')} /></Div>
            </Col>
            <Col md={6}>
              <label style={{ minHeight: 15 }} />
              <Div>по <Datepicker date={state.date_end} onChange={this.handleChange.bind(this, 'date_end')} /></Div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                options={MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
            </Col>
          </Row>

        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block" hidden={state.status === 'closed'}>
            <Button onClick={this.handleSubmit.bind(this)}>{'Сформировать'}</Button>
          </Div>
        </Modal.Footer>

      </Modal>
    );
  }
}

MissionsCreationForm.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(MissionsCreationForm, ['objects', 'missions']);
