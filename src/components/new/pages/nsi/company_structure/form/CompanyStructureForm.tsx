import * as React from 'react';
import { compose } from 'recompose';
import memoize from 'memoize-one';
import { connect } from 'react-redux';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { companyStructureFormSchema } from 'components/new/pages/nsi/company_structure/form/schema';

import {
  getdefaultCompanyStructureElement,
  STRUCTURE_TYPE_DEY,
  STRUCTURE_TYPE_DEK,
  STRUCTURE_TYPES
} from 'components/new/pages/nsi/company_structure/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import {
  OwnCompanyStructureProps,
  PropsCompanyStructure,
  StatePropsCompanyStructure,
  PropsCompanyStructureWithForm,
} from 'components/new/pages/nsi/company_structure/form/@types/CompanyStructureForm';
import { CompanyStructure, CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { DivNone } from 'global-styled/global-styled';
import { getCompanyStructureState } from 'redux-main/reducers/selectors';
import companyStructurePermissions from '../_config-data/permissions';
import { createCompanyStructure, updateCompanyStructure, getAndSetInStoreCompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/actions';

class CompanyStructureForm extends React.PureComponent<PropsCompanyStructure, {}> {
  componentDidMount() {
    this.props.dispatch(
      getAndSetInStoreCompanyStructureLinear(
        {},
        this.props,
      ),
    );
  }
  handleChangeParentID = (parent_id) => {
    this.props.handleChange({
      type: null,
      parent_id,
    });
  };

  makeOptionFromTechMaintTypeList = (
    memoize(
      (companyStructureLinearList: Array<CompanyStructureLinear>) => (
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

  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      companyStructureLinearList,
    } = this.props;

    const {
      parent_id,
    } = state;

    const companyStructureOptions = this.makeOptionFromTechMaintTypeList(
      companyStructureLinearList,
    );

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Изменение подразделения' : 'Создание подразделения';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    let structureType = 'half';
    let parent_type_is_dek = false;

    if (parent_id) {
      parent_type_is_dek = (
        get(
          companyStructureLinearList.find((companyStructure) => companyStructure.id === parent_id),
          'type',
          null,
        ) === STRUCTURE_TYPE_DEK.value
      );
    }
    if (!parent_id || !parent_type_is_dek) {
      structureType = 'all';
    }

    return (
      <EtsBootstrap.ModalContainer id="modal-company-structure" show onHide={this.props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
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
                type="string"
                label="Примечание"
                error={errors.note}
                value={state.note}
                onChange={this.props.handleChange}
                boundKeys="note"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted // либо обновление, либо создание
              ? (
                <EtsBootstrap.Button disabled={!this.props.canSave} onClick={this.props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
              )
              : (
                <DivNone />
              )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default compose<PropsCompanyStructure, OwnCompanyStructureProps>(
  connect<StatePropsCompanyStructure, {}, OwnCompanyStructureProps, ReduxState>(
    (state) => ({
      companyStructureLinearList: getCompanyStructureState(state).companyStructureLinearList,
    }),
  ),
  withForm<PropsCompanyStructureWithForm, CompanyStructure>({
    uniqField: 'id',
    createAction: createCompanyStructure,
    updateAction: updateCompanyStructure,
    mergeElement: (props) => {
      return getdefaultCompanyStructureElement(props.element);
    },
    schema: companyStructureFormSchema,
    permissions: companyStructurePermissions,
  }),
)(CompanyStructureForm);
