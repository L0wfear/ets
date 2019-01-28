import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import { ButtonUpdateMainCarpool } from 'components/directories/geoobjects/pages/carpool/form/buttons/buttons';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';
import FieldsData from 'components/new/pages/nsi/geoobjects/ui/form/form-components/fields-data/FieldsData';
import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';

import carpoolPermissions from 'components/directories/geoobjects/pages/carpool/config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { carpoolSchema } from 'components/directories/geoobjects/pages/carpool/form/schema';
import { get } from 'lodash';

import { getDefaultCarpoolElement } from 'components/directories/geoobjects/pages/carpool/form/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnCarpoolProps,
  PropsCarpool,
  StateCarpool,
  StatePropsCarpool,
  DispatchPropsCarpool,
  PropsCarpoolWithForm,
} from 'components/directories/geoobjects/pages/carpool/form/@types/CarpoolForm.h';

import { Carpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

const renderers = {};

class CarpoolForm extends React.PureComponent<PropsCarpool, StateCarpool> {
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
      meta,
      entity,
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
              <FieldsData
                element={state}
                meta={meta}
                renderers={renderers}
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={state}
                entity={entity}
              />
            </Flex>
          </FlexContainer>
          <FlexContainer isWrap>
          </FlexContainer>
        </ModalBodyPreloader>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsCarpool, OwnCarpoolProps>(
  connect<StatePropsCarpool, DispatchPropsCarpool, OwnCarpoolProps, ReduxState>(
    null,
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
  withForm<PropsCarpoolWithForm, Carpool>({
    uniqField: 'id',
    mergeElement: (props) => {
      return getDefaultCarpoolElement(props.element);
    },
    schema: carpoolSchema,
    permissions: carpoolPermissions,
  }),
)(CarpoolForm);
