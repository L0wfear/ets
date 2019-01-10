import * as React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import odhPermissions from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { odhFormSchema } from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/schema';
import { get } from 'lodash';

import { getDefaultOdhFormElement } from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsOdhForm,
  PropsOdhForm,
  StateOdhForm,
  StatePropsOdhForm,
  DispatchPropsOdhForm,
  PropsOdhFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/odh/OdhForm/@types/OdhForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { getCompanyStructureState } from 'redux-main/reducers/selectors';
import { getAndSetInStoreCompanyStructureDescendantsByUser } from 'redux-main/reducers/modules/company_structure/actions';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';
import { companyStructureDescendantsByUser } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { changeCompanyStructureIdNotyfication } from 'utils/notifications';

class OdhForm extends React.PureComponent<PropsOdhForm, StateOdhForm> {
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

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Объект дорожного хозяйства' : 'Объект дорожного хозяйства';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    const companyStructureOptions = this.makeOptionFromCarpoolList(
      companyStructureDescendantsByUserList,
    );

    return (
      <Modal id="modal-odh" show onHide={this.handleHide} backdrop="static">
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

export default compose<PropsOdhForm, OwnPropsOdhForm>(
  connect<StatePropsOdhForm, DispatchPropsOdhForm, OwnPropsOdhForm, ReduxState>(
    (state) => ({
      companyStructureDescendantsByUserList: getCompanyStructureState(state).companyStructureDescendantsByUserList,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          geoobjectActions.actionCreateOdh(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          geoobjectActions.actionUpdateOdh(
            formState,
            { page, path },
          ),
        )
      ),
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
  withForm<PropsOdhFormWithForm, Odh>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultOdhFormElement(props.element);
    },
    schema: odhFormSchema,
    permissions: odhPermissions,
  }),
)(OdhForm);
