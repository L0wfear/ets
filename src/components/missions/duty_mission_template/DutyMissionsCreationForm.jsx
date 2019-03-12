import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Col from 'react-bootstrap/lib/Col';
import * as Row from 'react-bootstrap/lib/Row';

import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field';
import Div from 'components/ui/Div';
import Datepicker from 'components/ui/input/date-picker/DatePicker';
import Form from 'components/compositions/Form';
import { connect } from 'react-redux';
import { selectorGetMissionSourceOptionsWithoutOrder } from 'redux-main/reducers/modules/some_uniq/mission_source/selectors';

class MissionsCreationForm extends Form {
  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;

    console.log('form state is ', state); // eslint-disable-line

    const title = 'Формирование заданий из шаблонов';

    return (
      <Modal
        id="modal-duty-missions-creation"
        show={this.props.show}
        onHide={this.props.onHide}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={6}>
              <label>Время выполнения</label>
              <Div>
                c
                <Datepicker
                  date={state.date_start}
                  onChange={this.handleChange.bind(this, 'date_start')}
                />
              </Div>
            </Col>
            <Col md={6}>
              <label style={{ minHeight: 15 }} />
              <Div>
                по
                <Datepicker
                  date={state.date_end}
                  onChange={this.handleChange.bind(this, 'date_end')}
                />
              </Div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Источник получения задания"
                error={errors.mission_source_id}
                options={this.props.MISSION_SOURCES}
                value={state.mission_source_id}
                onChange={this.handleChange.bind(this, 'mission_source_id')}
              />
              <span className="help-block-mission-source">
                Задания на основе централизованных заданий необходимо создавать
                во вкладке {'"'}НСИ{'"'}-{'"'}Реестр централизованных заданий
                {'"'}.
              </span>
            </Col>
          </Row>
        </ModalBody>

        <Modal.Footer>
          <Div className="inline-block" hidden={state.status === 'closed'}>
            <Button onClick={this.handleSubmit}>Сформировать</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect((state) => ({
  MISSION_SOURCES: selectorGetMissionSourceOptionsWithoutOrder(state),
}))(MissionsCreationForm);
