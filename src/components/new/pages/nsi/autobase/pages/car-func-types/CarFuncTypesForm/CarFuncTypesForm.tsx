import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import carFuncTypesPermissions from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { carFuncTypesFormSchema } from 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/car-func-types-from-schema';

import { getDefaultCarFuncTypesElement } from 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnCarFuncTypesProps,
  PropsCarFuncTypes,
  StateCarFuncTypes,
  PropsCarFuncTypesWithForm,
} from 'components/new/pages/nsi/autobase/pages/car-func-types/CarFuncTypesForm/@types/CarFuncTypes.h';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { autobaseCreateCarFuncTypes, autobaseUpdateCarFuncTypes } from 'redux-main/reducers/modules/autobase/promises';

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
      <EtsBootstrap.ModalContainer id="modal-car-func-types" show onHide={this.props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{ title }</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
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

export default compose<PropsCarFuncTypes, OwnCarFuncTypesProps>(
  withForm<PropsCarFuncTypesWithForm, CarFuncTypes>({
    uniqField: 'asuods_id',
    createAction: autobaseCreateCarFuncTypes,
    updateAction: autobaseUpdateCarFuncTypes,
    mergeElement: (props) => {
      return getDefaultCarFuncTypesElement(props.element);
    },
    schema: carFuncTypesFormSchema,
    permissions: carFuncTypesPermissions,
  }),
)(CarFuncTypesForm);
