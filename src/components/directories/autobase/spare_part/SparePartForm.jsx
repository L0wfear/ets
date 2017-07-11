import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { connectToStores } from 'utils/decorators';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';

@connectToStores(['autobase'])
export default class SparePartForm extends Form {
  async componentDidMount() {
    const { flux } = this.context;

    const AllGroup = await flux.getActions('autobase').getSparePartGroup().data.results.rows;
    //const AllUnits = await this.getGroup(flux);
    console.log(AllGroup)
    this.setState({ AllGroup });
  }

 
  getUnits(flux) {
    return flux.getActions('autobase').getSparePartMeasureUnit();
  }

  render() {
    const state = this.props.formState;
    const errors = this.props.formErrors;
    console.log(this.state)
    const GROUP_OPTIONS = [];

    const IS_CREATING = !!!state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Создание записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <Div style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Группа"
                error={errors.spare_part_group_id}
                options={GROUP_OPTIONS}
                value={state.spare_part_group_id}
                onChange={this.handleChange.bind(this, 'spare_part_group_id')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Номер"
                value={state.number}
                error={errors.number}
                onChange={this.handleChange.bind(this, 'number')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Наименование"
                value={state.name}
                error={errors.name}
                onChange={this.handleChange.bind(this, 'name')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label="Единица измерения"
                error={errors.measure_unit_id}
                options={GROUP_OPTIONS}
                value={state.measure_unit_id}
                onChange={this.handleChange.bind(this, 'measure_unit_id')}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Field
                type="string"
                label="Цена, руб."
                value={state.price}
                error={errors.price}
                onChange={this.handleChange.bind(this, 'price')}
              />
            </Col>
          </Row>
        </Div>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={true} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
