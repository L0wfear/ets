import * as React from 'react';
import { compose } from 'recompose';
import { isBoolean, isNull } from 'util';
import { createValidDate } from 'components/@next/@utils/dates/dates';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { carFormSchema } from 'components/new/pages/nsi/autobase/pages/car_actual/form/schema';

import { getDefaultCarElement } from 'components/new/pages/nsi/autobase/pages/car_actual/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
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
    const { passport_data } = state;
    const isPermitted = !IS_CREATING ? props.isPermittedToUpdate : props.isPermittedToCreate;

    const isBool = isBoolean(state.is_gibdd_passport) && isBoolean(state.is_gtn_passport) && isBoolean(state.is_gims_passport);
    const noPassport = isBool ? !state.is_gibdd_passport && !state.is_gtn_passport && !state.is_gims_passport && isNull(state.passport_number) : false;
    const [gibddPassport, setGibddPassport] = React.useState<CarWrap['passport_data']>(null);
    const [gtnPassport, setGtnPassport] = React.useState<CarWrap['passport_data']>(null);

    React.useEffect(() => {
      const gibddPassport = passport_data?.car_passports.filter(
        (el) => el.type === 'GIBDD'
      );
      const gtnPassport = passport_data?.car_passports.filter(
        (el) => el.type === 'GTN'
      );
      setGibddPassport(gibddPassport[0]);
      setGtnPassport(gtnPassport[0]);
    }, [passport_data.car_passports]);

    React.useEffect(() => {
      state.exploitation_date_start = createValidDate(state.exploitation_date_start);
    }, [state.exploitation_date_start]);

    const contextValue: CarActualRegistryFormContextType = React.useMemo(
      () => {
        return {
          currentSelectedCar: state,
        };
      },
      [state],
    );

    const onSubmit = React.useCallback(
      async () => {
        const response = await props.submitAction(state, props.meta);

        if (response) {
          props.handleChange(response);
          if(response.passport_data.type === 'GIBDD') {
            setGibddPassport(response.passport_data);
          } else {
            setGtnPassport(response.passport_data);
          }
        }
      },
      [state, props.submitAction],
    );

    return (
      <CarActualRegistryFormContext.Provider value={contextValue}>
        <EtsBootstrap.ModalContainer id="modal-car" show onHide={props.hideWithoutChanges} bsSize="large">
          <EtsBootstrap.ModalHeader closeButton>
            <EtsBootstrap.ModalTitle>Карточка транспортного средства</EtsBootstrap.ModalTitle>
          </EtsBootstrap.ModalHeader>
          <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
            <CarFormBodyHeader noPassport={noPassport} isPermitted={isPermitted} />
            <CarFormBodyContainer
              isPermitted={isPermitted}
              noPassport={noPassport}
              formState={state}
              formErrors={errors}
              onChange={props.handleChange}
              onChangeBoolean={props.handleChangeBoolean}
              gibddPassport={gibddPassport}
              gtnPassport={gtnPassport}
              page={props.page}
              path={props.path}
            />
          </ModalBodyPreloader>
          <EtsBootstrap.ModalFooter>
            {
              isPermitted // либо обновление, либо создание
                ? (
                  <EtsBootstrap.Button id="save_car_actial" disabled={!props.canSave} onClick={onSubmit}>Сохранить</EtsBootstrap.Button>
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

export default compose<PropsCar, PropsCarWithForm>(
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
