import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { ExtField } from 'components/ui/new/field/ExtField';
import ModalBody from 'components/ui/Modal';
import Form from 'components/compositions/Form';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';
import { connect } from 'react-redux';
import { getCompanyStructureState } from 'redux-main/reducers/selectors';
import { getAndSetInStoreCompanyStructureDescendantsByUser } from 'redux-main/reducers/modules/company_structure/actions';
import memoize from 'memoize-one';

class OdhForm extends Form {
  componentDidMount() {
    this.props.getAndSetInStoreCompanyStructureDescendantsByUser();
  }

  myHandleSubmit = () => this.handleSubmit();

  handleChangeWrap = (key, value) => {
    if (key === 'company_structure_id') {
      global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);
    }

    this.handleChange(key, value);
  }

  makeOptionFromCarpoolList = (
    memoize(
      companyStructureDescendantsByUserList => (
        companyStructureDescendantsByUserList
          .map(
            defaultSelectListMapper,
          )
      ),
    )
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      companyStructureDescendantsByUserList,
    } = this.props;

    const COMPANY_ELEMENTS = this.makeOptionFromCarpoolList(
      companyStructureDescendantsByUserList,
    );

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
                onChange={this.handleChangeWrap}
                boundKeys="company_structure_id"
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

export default connect(
  state => ({
    companyStructureDescendantsByUserList: getCompanyStructureState(state).companyStructureDescendantsByUserList,
  }),
  (dispatch, { page, path }) => ({
    getAndSetInStoreCompanyStructureDescendantsByUser: () => (
      dispatch(
        getAndSetInStoreCompanyStructureDescendantsByUser(
          {},
          { page, path },
        ),
      )
    ),
  }),
)(OdhForm);
