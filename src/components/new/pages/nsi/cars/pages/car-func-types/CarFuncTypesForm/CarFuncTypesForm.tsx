import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import carFuncTypesPermissions from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { carFuncTypesFormSchema } from 'components/new/pages/nsi/cars/pages/car-func-types/CarFuncTypesForm/car-func-types-from-schema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { getDefaultCarFuncTypesElement } from 'components/new/pages/nsi/cars/pages/car-func-types/CarFuncTypesForm/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnCarFuncTypesProps,
  PropsCarFuncTypes,
  StateCarFuncTypes,
  PropsCarFuncTypesWithForm,
} from 'components/new/pages/nsi/cars/pages/car-func-types/CarFuncTypesForm/@types/CarFuncTypes.h';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';

class CarFuncTypesForm extends React.PureComponent<PropsCarFuncTypes, StateCarFuncTypes> {
  render() {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = this.props;

    const IS_CREATING = !state.asuods_id;

    const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
    const isPermitted = !IS_CREATING ? this.props.isPermittedToUpdate : this.props.isPermittedToCreate;

    return (
      <Modal id="modal-car-func-types" show onHide={this.props.hideWithoutChanges} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <Row>
            <Col md={12}>
              <ExtField
                type="string"
                label="Полное наименование"
                value={state.full_name}
                disabled
              />
              <ExtField
                type="string"
                label="Краткое наименование"
                value={state.short_name}
                disabled
              />
              <ExtField
                type="string"
                label="Среднее количество часов работы (1-24)"
                value={state.avg_work_hours}
                onChange={this.props.handleChange}
                boundKeys="avg_work_hours"
                error={errors.avg_work_hours}
                disabled={!isPermitted}
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

export default compose<PropsCarFuncTypes, OwnCarFuncTypesProps>(
  withForm<PropsCarFuncTypesWithForm, CarFuncTypes>({
    uniqField: 'asuods_id',
    createAction: autobaseActions.autobaseCreateCarFuncTypes,
    updateAction: autobaseActions.autobaseUpdateCarFuncTypes,
    mergeElement: (props) => {
      return getDefaultCarFuncTypesElement(props.element);
    },
    schema: carFuncTypesFormSchema,
    permissions: carFuncTypesPermissions,
  }),
)(CarFuncTypesForm);
