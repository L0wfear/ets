import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import DangerZonePermissions from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { DangerZoneFormSchema } from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/schema';

import { getDefaultDangerZoneFormElement } from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnPropsDangerZoneForm,
  PropsDangerZoneForm,
  StateDangerZoneForm,
  StatePropsDangerZoneForm,
  DispatchPropsDangerZoneForm,
  PropsDangerZoneFormWithForm,
} from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/@types/DangerZoneForm.h';

import { DivNone } from 'global-styled/global-styled';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import geoobjectActions from 'redux-main/reducers/modules/geoobject/actions';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';
import { ExtField } from 'components/ui/new/field/ExtField';

import MapGeoobjectWrap from 'components/new/pages/nsi/geoobjects/ui/form/form-components/map-geoobject/MapGeoobjectWrap';
import { getSessionState } from 'redux-main/reducers/selectors';
import { isNumber } from 'util';

class DangerZoneForm extends React.PureComponent<PropsDangerZoneForm, StateDangerZoneForm> {
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
      <Modal id="modal-DangerZone" show onHide={this.props.hideWithoutChanges} bsSize="large" backdrop="static">
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
                label="Наименование ОДХ:"
                readOnly
              />
              <ExtField
                type="string"
                value={state.address_comm}
                label="Адресная привязка:"
                readOnly
              />
              <ExtField
                type="string"
                value={isNumber(state.roadway_area) ? parseFloat(state.roadway_area.toString()).toFixed(2) : ''}
                label="Площадь на проезжей части, м²:"
                readOnly
              />
              <ExtField
                type="string"
                value={isNumber(state.sidewalk_area) ? parseFloat(state.sidewalk_area.toString()).toFixed(2) : ''}
                label="Площадь на тротуаре, м²:"
                readOnly
              />
              <ExtField
                type="string"
                value={isNumber(state.sidelines_area) ? parseFloat(state.sidelines_area.toString()).toFixed(2) : ''}
                label="Площадь на обочинах, м²:"
                readOnly
              />
            </Flex>
            <Flex grow={2} shrink={2} basis={600}>
              <MapGeoobjectWrap
                geoobjectData={state}
                entity="dangerZone"
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

export default compose<PropsDangerZoneForm, OwnPropsDangerZoneForm>(
  connect<StatePropsDangerZoneForm, DispatchPropsDangerZoneForm, OwnPropsDangerZoneForm, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
  ),
  withForm<PropsDangerZoneFormWithForm, DangerZone>({
    uniqField: 'id',
    createAction: geoobjectActions.actionCreateDangerZone,
    updateAction: geoobjectActions.actionUpdateDangerZone,
    mergeElement: (props) => {
      return getDefaultDangerZoneFormElement(props.element);
    },
    schema: DangerZoneFormSchema,
    permissions: DangerZonePermissions,
  }),
)(DangerZoneForm);
