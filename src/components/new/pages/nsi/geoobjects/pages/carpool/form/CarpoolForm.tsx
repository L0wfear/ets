import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';
import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';

import carpoolPermissions from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { carpoolSchema } from 'components/new/pages/nsi/geoobjects/pages/carpool/form/schema';

import { getDefaultCarpoolElement } from 'components/new/pages/nsi/geoobjects/pages/carpool/form/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsCarpoolForm,
  PropsCarpoolForm,
  StateCarpoolForm,
  StatePropsCarpoolForm,
  DispatchPropsCarpoolForm,
  PropsCarpoolFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/carpool/form/@types/CarpoolForm.h';

import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';
import { ExtField } from 'components/ui/new/field/ExtField';
import { DivNone } from 'global-styled/global-styled';
import { getSessionState } from 'redux-main/reducers/selectors/index';

class CarpoolForm extends React.PureComponent<PropsCarpoolForm, StateCarpoolForm> {
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

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    // const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <Modal id="modal-carpool" show onHide={this.handleHide} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <FlexContainer isWrap>
            <Flex grow={1} shrink={1} basis={200}>
              {
                this.props.userData.isKgh || this.props.userData.isOkrug
                  ? (
                    <ExtField
                      type="string"
                      value={state.company_name || '-'}
                      label={this.props.userData.isKgh ? 'Наименование ГБУ:' : 'Учреждение:'}
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
                label="Полное наименование:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.address}
                label="Адрес:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={state}
                entity="carpool"
              />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsCarpoolForm, OwnPropsCarpoolForm>(
  connect<StatePropsCarpoolForm, DispatchPropsCarpoolForm, OwnPropsCarpoolForm, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
    (dispatch, { page, path }) => ({
      createAction: (formState) => (
        dispatch(
          geoobjectActions.actionCreateCarpool(
            formState,
            { page, path },
          ),
        )
      ),
      updateAction: (formState) => (
        dispatch(
          geoobjectActions.actionUpdateCarpool(
            formState,
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsCarpoolFormWithForm, Carpool>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultCarpoolElement(props.element);
    },
    schema: carpoolSchema,
    permissions: carpoolPermissions,
  }),
)(CarpoolForm);
