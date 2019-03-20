import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import FuelingWaterPermissions from 'components/new/pages/nsi/geoobjects/pages/fueling_water/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { FuelingWaterFormSchema } from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/schema';

import { getDefaultFuelingWaterFormElement } from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsFuelingWaterForm,
  PropsFuelingWaterForm,
  StateFuelingWaterForm,
  StatePropsFuelingWaterForm,
  DispatchPropsFuelingWaterForm,
  PropsFuelingWaterFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/@types/FuelingWaterForm.h';

import { DivNone } from 'global-styled/global-styled';
import { FuelingWater } from 'redux-main/reducers/modules/geoobject/actions_by_type/fueling_water/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import { FlexContainer, Flex } from 'global-styled/global-styled';
import { ExtField } from 'components/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';

class FuelingWaterForm extends React.PureComponent<
  PropsFuelingWaterForm,
  StateFuelingWaterForm
> {
  render() {
    const { formState: state, page, path } = this.props;

    const IS_CREATING = !state.id;

    const title = !IS_CREATING ? 'Просмотр объекта' : 'Просмотр объекта';
    const isPermitted = !IS_CREATING
      ? this.props.isPermittedToUpdate
      : this.props.isPermittedToCreate;

    return (
      <Modal
        id="modal-FuelingWater"
        show
        onHide={this.props.hideWithoutChanges}
        bsSize="large"
        backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <FlexContainer isWrap>
            <Flex grow={1} shrink={1} basis={200}>
              {this.props.userData.isKgh || this.props.userData.isOkrug ? (
                <ExtField
                  type="string"
                  value={state.company_name || '-'}
                  label={
                    this.props.userData.isKgh
                      ? 'Наименование ГБУ:'
                      : 'Учреждение:'
                  }
                  readOnly
                />
              ) : (
                <DivNone />
              )}
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
              <MapGeoobjectWrap geoobjectData={state} entity="fuelingWater" />
            </Flex>
          </FlexContainer>
        </ModalBodyPreloader>
        <Modal.Footer>
          {isPermitted && false ? ( // либо обновление, либо создание
            <Button
              disabled={!this.props.canSave}
              onClick={this.props.defaultSubmit}>
              Сохранить
            </Button>
          ) : (
            <DivNone />
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default compose<PropsFuelingWaterForm, OwnPropsFuelingWaterForm>(
  connect<
    StatePropsFuelingWaterForm,
    DispatchPropsFuelingWaterForm,
    OwnPropsFuelingWaterForm,
    ReduxState
  >((state) => ({
    userData: getSessionState(state).userData,
  })),
  withForm<PropsFuelingWaterFormWithForm, FuelingWater>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreateFuelingWater,
    updateAction: geoobjectActions.actionUpdateFuelingWater,
    mergeElement: (props) => {
      return getDefaultFuelingWaterFormElement(props.element);
    },
    schema: FuelingWaterFormSchema,
    permissions: FuelingWaterPermissions,
  }),
)(FuelingWaterForm);
