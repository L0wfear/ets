import * as React from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap';
import ModalBody from 'components/ui/Modal';
import Field from 'components/ui/Field.jsx';
import Form from 'components/compositions/Form.jsx';
import { connectToStores } from 'utils/decorators';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';

const STATIC_VAL = {
  type: 'string',
  readOnly: true,
};
const INPUT_VAL = {
  company_structure_name: 'custom',
};

@connectToStores(['geoObjects', 'companyStructure'])
export default class DtForm extends Form {
  handleChange = (key, value) => {
    if (key === 'company_structure_id') {
      global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);
    }

    super.handleChange(key, value);
  }

  render() {
    const [state, meta] = [this.props.formState, this.props.formMeta];

    const { companyStructureList = [] } = this.props;
    const COMPANY_ELEMENTS = companyStructureList.map(defaultSelectListMapper);

    return (
      <Modal {...this.props} backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Дворовая территория</Modal.Title>
        </Modal.Header>

        <ModalBody>
          {meta.cols.map(d =>
            !INPUT_VAL[d.name] &&
              <Row key={d.name}>
                <Col md={12}>
                  <Field
                    label={d.displayName}
                    value={state[d.name]}
                    {...STATIC_VAL}
                  />
                </Col>
              </Row>
          )}
          <Row>
            <Col md={12}>
              <Field
                type="select"
                label={'Подразделение'}
                value={state.company_structure_id}
                options={COMPANY_ELEMENTS}
                emptyValue={null}
                onChange={(...arg) => this.handleChange('company_structure_id', ...arg)}
              />
            </Col>
          </Row>
        </ModalBody>

        <Modal.Footer>
          <Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}
