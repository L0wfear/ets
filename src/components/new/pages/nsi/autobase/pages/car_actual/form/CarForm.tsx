import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { carFormSchema } from 'components/new/pages/nsi/autobase/pages/car_actual/form/schema';

import { getDefaultCarElement } from 'components/new/pages/nsi/autobase/pages/car_actual/form/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnCarProps,
  PropsCar,
  StatePropsCar,
  DispatchPropsCar,
  PropsCarWithForm,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import { DivNone } from 'global-styled/global-styled';
import carActualPermissions from '../_config-data/permissions';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import CarFormBodyHeader from './body_header/CarFormBodyHeader';
import CarFormBodyContainer from './body_container/CarFormBodyContainer';

const CarForm: React.FC<PropsCar> = React.memo(
  (props) => {
    const {
      formState: state,
      // formErrors: errors,
      page,
      path,
    } = props;

    const IS_CREATING = !state.asuods_id;

    const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

    return (
      <Modal id="modal-car" show onHide={props.hideWithoutChanges} bsSize="large" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Карточка транспортного средства</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <CarFormBodyHeader isPermitted={isPermitted} />
          <CarFormBodyContainer isPermitted={isPermitted} />
        </ModalBodyPreloader>
        <Modal.Footer>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <Button id="save_employee" disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</Button>
          )
          : (
            <DivNone />
          )
        }
        </Modal.Footer>
      </Modal>
    );
  },
);

export default compose<PropsCar, OwnCarProps>(
  connect<StatePropsCar, DispatchPropsCar, OwnCarProps, ReduxState>(
    null,
  ),
  withForm<PropsCarWithForm, Car>({
    uniqField: 'asuods_id',
    mergeElement: (props) => {
      return getDefaultCarElement(props.element);
    },
    schema: carFormSchema,
    permissions: carActualPermissions,
  }),
)(CarForm);
