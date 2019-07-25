import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { carFormSchema } from 'components/new/pages/nsi/autobase/pages/car_actual/form/schema';

import { getDefaultCarElement } from 'components/new/pages/nsi/autobase/pages/car_actual/form/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnCarProps,
  PropsCar,
  PropsCarWithForm,
  CarWrap,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import { DivNone } from 'global-styled/global-styled';
import carActualPermissions from '../_config-data/permissions';
import CarFormBodyHeader from './body_header/CarFormBodyHeader';
import CarFormBodyContainer from './body_container/CarFormBodyContainer';
import { actionUpdateCarWrap, actionsGetCarFormDataByAsuodsId } from 'redux-main/reducers/modules/autobase/car/actions';
import { CarActualRegistryFormContext, CarActualRegistryFormContextType } from './body_container/CarFormContext';

const CarForm: React.FC<PropsCar> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
    } = props;

    const IS_CREATING = !state.asuods_id;

    const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

    const contextValue: CarActualRegistryFormContextType = React.useMemo(
      () => {
        return {
          currentSelectedCar: state,
        };
      },
      [state],
    );

    return (
      <CarActualRegistryFormContext.Provider value={contextValue}>
        <EtsBootstrap.ModalContainer id="modal-car" show onHide={props.hideWithoutChanges} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Карточка транспортного средства</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <CarFormBodyHeader isPermitted={isPermitted} />
          <CarFormBodyContainer
            isPermitted={isPermitted}
            formState={state}
            formErrors={errors}
            onChange={props.handleChange}
            onChangeBoolean={props.handleChangeBoolean}

            page={props.page}
            path={props.path}
          />
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
        {
          isPermitted // либо обновление, либо создание
          ? (
            <EtsBootstrap.Button id="save_car_actial" disabled={!props.canSave} onClick={props.defaultSubmit}>Сохранить</EtsBootstrap.Button>
          )
          : (
            <DivNone />
          )
        }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
      </CarActualRegistryFormContext.Provider>
    );
  },
);

export default compose<PropsCar, OwnCarProps>(
  withForm<PropsCarWithForm, CarWrap>({
    updateAction: actionUpdateCarWrap,
    getRecordAction: actionsGetCarFormDataByAsuodsId,
    uniqField: 'asuods_id',
    mergeElement: (props) => {
      return getDefaultCarElement(props.element);
    },
    schema: carFormSchema,
    permissions: carActualPermissions,
  }),
)(CarForm);
