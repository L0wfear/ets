import React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import ModalBody from 'components/ui/Modal';
import { loadingOverlay } from 'components/ui/LoadingOverlay';
import { FileField } from 'components/ui/input/fields';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import Form from 'components/compositions/Form.jsx';

import { connectToStores } from 'utils/decorators';

@loadingOverlay
@connectToStores(['autobase', 'employees', 'objects'])
export default class BaseRoadAccidentFrom extends Form {
  componentWillMount() {
    const { car_id = -1 } = this.props;

    if (car_id >= 0) {
      this.handleChange('car_id', car_id);
    }
  }

  render() {
    const {
      isPermitted = false,
      cols = [],
      roadAccidentCauseList = [],
      driversList = [],
    } = this.props;

    const [
      state = {},
      errors = {},
    ] = [this.props.formState, this.props.formErrors];

    const fields = cols.reduce((obj, val) => Object.assign(obj, { [val.key]: val }), {});

    const ROAD_ACCIDENT_CAUSE_OPTION = roadAccidentCauseList.map(defaultSelectListMapper);
    const DRIVER_LIST_OPTION = driversList.map(el => ({ value: el.id, label: `${el.last_name} ${el.first_name[0]}.${el.middle_name ? el.middle_name[0] : ''}. | ${el.drivers_emplds}` }));

    const IS_CREATING = !state.id;

    let title = 'Изменение записи';
    if (IS_CREATING) title = 'Добавление записи';

    return (
      <Modal {...this.props} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{ title }</Modal.Title>
        </Modal.Header>
        <ExtDiv style={{ padding: 15 }}>
          <Row>
            <Col md={12}>
              <ExtField
                type={'date'}
                label={fields.accident_date.title}
                date={state.accident_date}
                time={false}
                error={errors.accident_date}
                onChange={this.handleChange}
                boundKeys={['accident_date']}
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label={fields.driver_id.title}
                value={state.driver_id}
                error={errors.driver_id}
                options={DRIVER_LIST_OPTION}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['driver_id']}
                disabled={!isPermitted}
              />
              <ExtField
                type="select"
                label={fields.cause_name.title}
                value={state.cause_id}
                error={errors.cause_id}
                options={ROAD_ACCIDENT_CAUSE_OPTION}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['cause_id']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'string'}
                label={fields.accident_place.title}
                value={state.accident_place}
                error={errors.accident_place}
                onChange={this.handleChange}
                boundKeys={['accident_place']}
                disabled={!isPermitted}
              />
              <ExtField
                type={'boolean'}
                label={fields.is_guilty.title}
                value={state.is_guilty}
                error={errors.is_guilty}
                onChange={this.handleChange}
                boundKeys={['is_guilty', !state.is_guilty]}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.damage_price.type}
                label={fields.damage_price.title}
                value={state.damage_price}
                error={errors.damage_price}
                onChange={this.handleChange}
                boundKeys={['damage_price']}
                disabled={!isPermitted}
              />
              <ExtField
                type={fields.comment.type}
                label={fields.comment.title}
                value={state.comment}
                error={errors.comment}
                onChange={this.handleChange}
                boundKeys={['comment']}
                disabled={!isPermitted}
              />
              <FileField
                label="Файл"
                multiple
                value={state.files}
                error={errors.files}
                onChange={this.handleChange}
                boundKeys={['files']}
                isLoading={this.props.onOverlayLoading}
                disabled={!isPermitted}
              />
            </Col>
          </Row>
        </ExtDiv>
        <ModalBody />
        <Modal.Footer>
          <Button disabled={!this.props.canSave} onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
