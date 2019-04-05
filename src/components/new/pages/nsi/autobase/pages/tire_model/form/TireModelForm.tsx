import * as React from 'react';

import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnTireModelProps,
  PropsTireModel,
  StatePropsTireModel,
  DispatchPropsTireModel,
  PropsTireModelWithForm,
} from 'components/new/pages/nsi/autobase/pages/tire_model/form/@types/TireModelForm';
import { TireModel } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import { getDefaultTireModelElement } from './utils';
import { tireModelFormSchema } from './schema';
import tireModelPermissions from '../_config-data/permissions';

const TireModelForm: React.FC<PropsTireModel> = (props) => {
  const {
    formState: state,
    formErrors: errors,
    page,
    path,
    tireManufacturerList,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

  React.useEffect(
    () => {
      props.tireManufacturerGetAndSetInStore();
    },
    [],
  );

  const tireManufacturerOptions = React.useMemo(
    () => (
      tireManufacturerList.map(defaultSelectListMapper)
    ),
    [tireManufacturerList],
  );

  return (
    <Modal id="modal-tire_model" show onHide={props.hideWithoutChanges} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={6}>
            <ExtField
              id="name"
              type="string"
              label="Марка шины"
              value={state.name}
              error={errors.name}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="name"
              modalKey={path}
            />
          </Col>
          <Col md={6}>
            <ExtField
              id="tire_manufacturer_id"
              type="select"
              label="Производитель шины"
              options={tireManufacturerOptions}
              value={state.tire_manufacturer_id}
              error={errors.tire_manufacturer_id}
              disabled={!isPermitted}
              onChange={props.handleChange}
              boundKeys="tire_manufacturer_id"
              clearable={false}
              modalKey={path}
            />
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
      {
        isPermitted // либо обновление, либо создание
        ? (
          <Button disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
        )
        : (
          <DivNone />
        )
      }
      </Modal.Footer>
    </Modal>
  );
};

export default compose<PropsTireModel, OwnTireModelProps>(
  connect<StatePropsTireModel, DispatchPropsTireModel, OwnTireModelProps, ReduxState>(
    (state) => ({
      tireManufacturerList: getAutobaseState(state).tireManufacturerList,
    }),
    (dispatch, { page, path }) => ({
      tireManufacturerGetAndSetInStore: () => (
        dispatch(
          autobaseActions.tireManufacturerGetAndSetInStore(
            {},
            { page, path },
          ),
        )
      ),
    }),
  ),
  withForm<PropsTireModelWithForm, TireModel>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateTireModel,
    updateAction: autobaseActions.autobaseUpdateTireModel,
    mergeElement: (props) => {
      return getDefaultTireModelElement(props.element);
    },
    schema: tireModelFormSchema,
    permissions: tireModelPermissions,
  }),
)(TireModelForm);
