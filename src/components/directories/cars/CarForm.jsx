import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import connectToStores from 'flummox/connect';
import config from '../../../config.js';

class CarForm extends Form {

  constructor(props) {
    super(props);

    this.state = {
      type_image_name: null,
      companyStructureList: [],
    };
  }

  async componentWillMount() {
    const { flux } = this.context;
    const companyStructureList = await flux.getActions('companyStructure').getLinearCompanyStructureForUser();
    this.setState({ companyStructureList });
  }

  render() {
    const state = this.props.formState;
    const { ownersIndex = {}, typesIndex = {}, isPermitted = false } = this.props;
    const owner = ownersIndex[state.owner_id] || {};
    const type = typesIndex[state.type_id] || {};
    const { companyStructureList = [] } = this.state;
    const COMPANY_ELEMENTS = companyStructureList.map(el => ({ value: el.id, label: el.name }));

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Карточка транспортного средства</Modal.Title>
        </Modal.Header>

        <ModalBody>

          <Row>

            <Col md={6}>
              <Div hidden={!state.type_image_name}>
                <img role="presentation" src={config.images + state.type_image_name} className="car-form-image" />
              </Div>
            </Col>

            <Col md={6}>
              <Field
                type="select"
                label="Подразделение"
                options={COMPANY_ELEMENTS}
                value={state.company_structure_id}
                clearable={false}
                onChange={this.handleChange.bind(this, 'company_structure_id')}
                disabled={!isPermitted}
              />

              <Field
                type="string"
                label="Гаражный номер"
                value={state.garage_number}
                onChange={this.handleChange.bind(this, 'garage_number')}
                disabled={!isPermitted}
              />

              <Field
                type="number"
                label="Поправочный коэффициент"
                value={state.fuel_correction_rate}
                onChange={this.handleChange.bind(this, 'fuel_correction_rate')}
                disabled={!isPermitted}
              />
              <Field
                type="boolean"
                label="Общее"
                value={state.is_common}
                onChange={this.handleChange.bind(this, 'is_common', !state.is_common)}
              />
            </Col>

          </Row>

          <Row>

            <Col md={6}>
              <Field type="string" label="Владелец" readOnly value={owner.title || 'Не указано'} />

              <Field type="string" label="Рег. номер ТС" readOnly value={state.gov_number || 'Не указано'} />

              <Field type="string" label="Марка шасси" readOnly value={state.model_name || 'Не указано'} />

              <Field type="string" label="Тип" readOnly value={type.short_name || 'Не указано'} />
            </Col>

          </Row>

        </ModalBody>

        <Modal.Footer>
          <Button disabled={!isPermitted} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

export default connectToStores(CarForm, ['objects']);
