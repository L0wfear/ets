import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import ModalBody from 'components/ui/Modal';
import Form from 'components/compositions/Form';
import { connectToStores } from 'utils/decorators';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';

@connectToStores(['objects'])
export default class DtForm extends Form {
  myHandleSubmit = () => this.handleSubmit();

  handleChangeWrap = (key, value) => {
    if (key === 'company_structure_id') {
      global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);
    }

    this.handleChange(key, value);
  }

  render() {
    const [state, errors] = [this.props.formState, this.props.formErrors];

    const { companyStructureLinearForUserList = [] } = this.props;
    const COMPANY_ELEMENTS = companyStructureLinearForUserList.map(defaultSelectListMapper);

    return (
      <Modal id="modal-dt" show={this.props.show} onHide={this.props.onHide} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title>Дворовая территория</Modal.Title>
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
                label="Название ДТ"
                value={state.object_address}
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
                label="Общая уборочная площадь (кв.м.)"
                value={state.clean_area}
                readOnly
              />
              <ExtField
                type="string"
                label="Площадь механизированной уборки (кв.м.)"
                value={state.auto_area}
                readOnly
              />
              <ExtField
                type="select"
                label="Учреждение"
                value={state.company_structure_id}
                error={errors.company_structure_id}
                options={COMPANY_ELEMENTS}
                emptyValue={null}
                onChange={this.handleChangeWrap}
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
