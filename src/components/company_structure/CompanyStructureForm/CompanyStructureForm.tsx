import * as React from 'react';
import memoize from 'memoize-one';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import companyStructurePermissions from 'components/company_structure/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { companyStructureFormSchema } from 'components/company_structure/CompanyStructureForm/schema';

import {
  getdefaultCompanyStructureElement,
  STRUCTURE_TYPE_DEY,
  STRUCTURE_TYPE_DEK,
  STRUCTURE_TYPES
} from 'components/company_structure/CompanyStructureForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import {
  OwnCompanyStructureProps,
  PropsCompanyStructure,
  StateCompanyStructure,
  StatePropsCompanyStructure,
  DispatchPropsCompanyStructure,
  PropsCompanyStructureWithForm,
} from 'components/company_structure/CompanyStructureForm/@types/CompanyStructureForm.h';
import { CompanyStructure, CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { DivNone } from 'global-styled/global-styled';
import { getCompanyStructureState, getGeoobjectState } from 'redux-main/reducers/selectors';
import companyStructureActions from 'redux-main/reducers/modules/company_structure/actions';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

class CompanyStructureForm extends React.PureComponent<PropsCompanyStructure, StateCompanyStructure> {
  componentDidMount() {
    this.props.getCarpool();
  }

  handleChangeParentID = (parent_id) => {
    this.props.handleChange({
      type: null,
      parent_id,
    });
  }
  handleHide = () => {
    this.props.handleHide(false);
  }

  makeOptionFromTechMaintTypeList = (
    memoize(
      (companyStructureLinearList: CompanyStructureLinear[]) => (
        companyStructureLinearList
          .filter((companyStructure) => (
            companyStructure.type !== STRUCTURE_TYPE_DEY.value
          ))
          .map((companyStructure) => ({
            value: companyStructure.id,
            label: companyStructure.name,
            allData: companyStructure,
          }))
      ),
    )
  );
  makeOptionFromCarpoolList = (
    memoize(
      (carpoolList) => (
        carpoolList
          .map((carpool) => ({
            value: carpool.id,
            label: `${carpool.name} (${carpool.address})`,
          }))
      ),
    )
  );

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      companyStructureLinearList,
      carpoolList,
    } = this.props;

    const {
      parent_id,
    } = state;

    const companyStructureOptions = this.makeOptionFromTechMaintTypeList(
      companyStructureLinearList,
    );

    const carpoolOptions = this.makeOptionFromCarpoolList(
      carpoolList,
    );

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение подразделения' : 'Создание подразделения';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    let structureType = 'half';
    let parent_type_is_dek = false;

    if (parent_id) {
      parent_type_is_dek = companyStructureLinearList
        .find((companyStructure) => companyStructure.id === parent_id)
        .type === STRUCTURE_TYPE_DEK.value;
    }
    if (!parent_id || !parent_type_is_dek) {
      structureType = 'all';
    }

    return (
      <Modal id="modal-company-structure" show onHide={this.handleHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="select"
                label="Родительское подразделение"
                emptyValue={null}
                error={errors.parent_id}
                options={companyStructureOptions}
                value={state.parent_id}
                onChange={this.handleChangeParentID}
                clearable
                disabled={companyStructureOptions.length === 0}
                placeholder="Подразделение"
              />
              <ExtField
                type="select"
                label="Тип подразделения"
                error={errors.type}
                options={STRUCTURE_TYPES[structureType]}
                value={state.type}
                onChange={this.props.handleChange}
                boundKeys="type"
                clearable
              />
              <ExtField
                type="string"
                label="Наименование"
                error={errors.name}
                value={state.name}
                onChange={this.props.handleChange}
                boundKeys="name"
              />
              <ExtField
                id="carpool_ids"
                type="select"
                multi
                label="Автобаза"
                error={errors.carpool_ids}
                options={carpoolOptions}
                value={state.carpool_ids}
                onChange={this.props.handleChange}
                boundKeys="carpool_ids"
              />
              <ExtField
                type="string"
                label="Примечание"
                error={errors.note}
                value={state.note}
                onChange={this.props.handleChange}
                boundKeys="note"
              />
            </Col>
          </Row>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
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

export default compose<PropsCompanyStructure, OwnCompanyStructureProps>(
  connect<StatePropsCompanyStructure, DispatchPropsCompanyStructure, OwnCompanyStructureProps, ReduxState>(
    (state) => ({
      companyStructureLinearList: getCompanyStructureState(state).companyStructureLinearList,
      carpoolList: getGeoobjectState(state).carpoolList,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState: CompanyStructure) => (
        dispatch(
          companyStructureActions.createCompanyStructure(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState: CompanyStructure) => (
        dispatch(
          companyStructureActions.updateCompanyStructure(
            formState,
            { page, path },
          ),
        )
      ),
      getCarpool: () => (
        dispatch(
          geoobjectActions.actionGetAndSetInStoreCarpool(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsCompanyStructureWithForm, CompanyStructure>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getdefaultCompanyStructureElement(props.element);
    },
    schema: companyStructureFormSchema,
    permissions: companyStructurePermissions,
  }),
)(CompanyStructureForm);
