import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import ModalBody from 'components/ui/Modal';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';

@connectToStores(['objects'])
export default class OdhForm extends Form {
  myHandleSubmit = () => this.handleSubmit();
  handleChange = (key, value) => {
    if (key === 'company_structure_id') {
      global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);
    }

    super.handleChange(key, value);
  }
  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];

    const { companyStructureLinearForUserList = [] } = this.props;
    const COMPANY_ELEMENTS = companyStructureLinearForUserList.map(defaultSelectListMapper);

    return (
      <Modal id="modal-odh" show={this.props.show} onHide={this.props.onHide} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>Объект дорожного хозяйства</Modal.Title>
        </Modal.Header>

        <ModalBody>
          <Row>
            <Col md={12}>
              <ExtField
                type="string"
                label="Учреждение"
                value={state.company_name}
                readOnly
              />
              <ExtField
                type="string"
                label="Название"
                value={state.name}
                readOnly
              />
              <ExtField
                type="string"
                label="Категория"
                value={state.clean_category_name}
                readOnly
              />
              <ExtField
                type="string"
                label="Общая площадь (кв.м.)"
                value={state.total_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Протяженность (п.м.)"
                value={state.distance}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь проезжей части (кв.м.)"
                value={state.roadway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь тротуаров (кв.м.)"
                value={state.footway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь уборки (кв.м.)"
                value={state.cleaning_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Длина тротуара (п.м.)"
                value={state.footway_length}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь механизированной уборки тротуаров (кв.м.)"
                value={state.auto_footway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь ручной уборки тротуаров (кв.м.)"
                value={state.manual_footway_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь уборки снега (кв.м.)"
                value={state.snow_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Протяженность лотков (п.м.)"
                value={state.gutters_length}
                readOnly
              />
              <ExtField
                type="select"
                label="Подразделение"
                value={state.company_structure_id}
                error={errors.company_structure_id}
                options={COMPANY_ELEMENTS}
                emptyValue={null}
                onChange={this.handleChange}
                boundKeys={['company_structure_id']}
              />

            </Col>
          </Row>
        </ModalBody>

        <Modal.Footer>
          <Button onClick={this.myHandleSubmit}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}
