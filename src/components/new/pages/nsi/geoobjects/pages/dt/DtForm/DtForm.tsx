import * as React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import dtPermissions from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { dtFormSchema } from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/schema';
import { get } from 'lodash';

import { getDefaultDtFormElement } from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsDtForm,
  PropsDtForm,
  StateDtForm,
  StatePropsDtForm,
  DispatchPropsDtForm,
  PropsDtFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/dt/DtForm/@types/DtForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { getCompanyStructureState } from 'redux-main/reducers/selectors';
import { getAndSetInStoreCompanyStructureDescendantsByUser } from 'redux-main/reducers/modules/company_structure/actions';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';
import { companyStructureDescendantsByUser } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';

class DtForm extends React.PureComponent<PropsDtForm, StateDtForm> {
  componentDidMount() {
    this.props.getAndSetInStoreCompanyStructureDescendantsByUser();
  }

  handleChangeCompanyStructure = (key, value) => {
    global.NOTIFICATION_SYSTEM.notify(changeCompanyStructureIdNotyfication);

    this.props.handleChange({
      [key]: value,
    });
  }

  makeOptionFromCarpoolList = (
    memoize(
      (companyStructureDescendantsByUserList: companyStructureDescendantsByUser[]) => (
        companyStructureDescendantsByUserList
          .map(
            defaultSelectListMapper,
          )
      ),
    )
  );

  handleChange = (name, value) => {
    this.props.handleChange({
      [name]: get(value, ['target', 'value'], value),
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }
  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      companyStructureDescendantsByUserList,
    } = this.props;

    const IS_CREATING = !state.yard_id;

    const title = !IS_CREATING ? 'Дворовая территория' : 'Дворовая территория';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const companyStructureOptions = this.makeOptionFromCarpoolList(
      companyStructureDescendantsByUserList,
    );

    return (
      <Modal id="modal-dt" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
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
                options={companyStructureOptions}
                emptyValue={null}
                onChange={this.handleChangeCompanyStructure}
                boundKeys="company_structure_id"
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          !isPermitted // либо обновление, либо создание
          ? (
            <Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsDtForm, OwnPropsDtForm>(
  connect<StatePropsDtForm, DispatchPropsDtForm, OwnPropsDtForm, ReduxState>(
    (state) => ({
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
  ),
  withForm<PropsDtFormWithForm, Dt>({
    uniqField: 'yard_id',
    createAction: geoobjectActions.actionCreateDt,
    updateAction: geoobjectActions.actionUpdateDt,
    mergeElement: (props) => {
      return getDefaultDtFormElement(props.element);
    },
    schema: dtFormSchema,
    permissions: dtPermissions,
  }),
)(DtForm);
