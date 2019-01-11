import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import sspPermissions from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { sspFormSchema } from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/schema';
import { get } from 'lodash';

import { getDefaultSspFormElement } from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsSspForm,
  PropsSspForm,
  StateSspForm,
  StatePropsSspForm,
  DispatchPropsSspForm,
  PropsSspFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/ssp/SspForm/@types/SspForm.h';

import { DivNone } from 'global-styled/global-styled';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';
import { ExtField } from 'components/ui/new/field/ExtField';
import { isNumber } from 'util';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

class SspForm extends React.PureComponent<PropsSspForm, StateSspForm> {
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
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Просмотр объекта' : 'Просмотр объекта';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <Modal id="modal-ssp" show onHide={this.handleHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <FlexContainer isWrap>
            <Flex grow={1} shrink={1} basis={200}>
              {
                this.props.userData.isKgh || this.props.userData.isOkrug
                  ? (
                    <ExtField
                      type="string"
                      value={state.company_name}
                      label={this.props.userData.isKgh ? 'Наименование ГБУ' : 'Учреждение'}
                      readOnly
                    />
                  )
                  : (
                    <DivNone />
                  )
              }
              <ExtField
                type="string"
                value={state.name}
                label="Полное наименование"
                readOnly
              />
              <ExtField
                type="string"
                value={state.shortname}
                label="Краткое наименование"
                readOnly
              />
              <ExtField
                type="string"
                value={state.address}
                label="Адрес"
                readOnly
              />
              <ExtField
                type="string"
                value={isNumber(state.productivity) ? parseFloat(state.productivity.toString()).toFixed(2) : ''}
                label="Производительность (куб. м в сутки)"
                readOnly
              />
              <ExtField
                type="string"
                value={get(YES_NO_SELECT_OPTIONS_INT.find(({ value }) => value === state.is_mobile), 'label', '-')}
                label="Мобильность"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={state}
                entity={'ssp'}
              />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          !isPermitted && false // либо обновление, либо создание
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

export default compose<PropsSspForm, OwnPropsSspForm>(
  connect<StatePropsSspForm, DispatchPropsSspForm, OwnPropsSspForm, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          geoobjectActions.actionCreateSsp(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          geoobjectActions.actionUpdateSsp(
            formState,
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsSspFormWithForm, Ssp>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultSspFormElement(props.element);
    },
    schema: sspFormSchema,
    permissions: sspPermissions,
  }),
)(SspForm);
