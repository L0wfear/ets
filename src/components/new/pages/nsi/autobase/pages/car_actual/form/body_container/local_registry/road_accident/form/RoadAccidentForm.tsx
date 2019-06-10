import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { roadAccidentFormSchema } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/schema';

import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';

import { defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnRoadAccidentProps,
  PropsRoadAccident,
  StatePropsRoadAccident,
  DispatchPropsRoadAccident,
  PropsRoadAccidentWithForm,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/@types/RoadAccident';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import { isNullOrUndefined } from 'util';
import { getDefaultRoadAccidentElement } from './utils';
import roadAccidentPermissions from '../_config-data/permissions';

const RoadAccidentForm: React.FC<PropsRoadAccident> = (props) => {
  const [roadAccidentCauseOptions, setRoadAccidentCauseOptions] = React.useState([]);
  const [driversOptions, setDriversOptions] = React.useState([]);

  const {
    formState: state,
    formErrors: errors,

    page, path,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const ownIsPermitted = !IS_CREATING
    ? props.isPermittedToUpdate
    : props.isPermittedToCreate;

  const isPermitted =
    ownIsPermitted &&
    (isNullOrUndefined(state.company_id) ||
      state.company_id === props.userCompanyId);

  React.useEffect(
    () => {
      props.autobaseGetAccidentCause().then(
        ({ payload: { data } }) => {
          setRoadAccidentCauseOptions(
            data.map(defaultSelectListMapper),
          );
        },
      );

      props.employeeDriverGetSetDriver().then(
        ({ payload: { data } }) => {
          setDriversOptions(
            data.map((driver) => ({
              value: driver.id,
              label: driver.fio_license,
              rowData: driver,
            })),
          );
        },
      );
    },
    [],
  );

  return (
    <EtsBootstrap.ModalContainer
      id="modal-insurance-policy"
      show
      onHide={props.hideWithoutChanges}
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <ExtField
              id="accident_date"
              type="date"
              label="Дата"
              date={state.accident_date}
              time={false}
              error={errors.accident_date}
              onChange={props.handleChange}
              boundKeys="accident_date"
              disabled={!isPermitted}
              modalKey={page}
            />
            <ExtField
              id="driver_id"
              type="select"
              label="Водитель"
              value={state.driver_id}
              error={errors.driver_id}
              options={driversOptions}
              emptyValue={null}
              onChange={props.handleChange}
              boundKeys="driver_id"
              clearable={false}
              disabled={!isPermitted}
              modalKey={page}
            />
            <ExtField
              id="cause_id"
              type="select"
              label="Причина ДТП"
              value={state.cause_id}
              error={errors.cause_id}
              options={roadAccidentCauseOptions}
              emptyValue={null}
              onChange={props.handleChange}
              boundKeys="cause_id"
              clearable={false}
              disabled={!isPermitted}
              modalKey={page}
            />
            <ExtField
              id="accident_place"
              type="string"
              label="Место ДТП"
              value={state.accident_place}
              error={errors.accident_place}
              onChange={props.handleChange}
              boundKeys="accident_place"
              disabled={!isPermitted}
              modalKey={page}
            />
            <ExtField
              id="is_guilty"
              type="boolean"
              label="Виновность"
              value={state.is_guilty}
              error={errors.is_guilty}
              onChange={props.handleChangeBoolean}
              boundKeys="is_guilty"
              disabled={!isPermitted}
              modalKey={page}
            />
            <ExtField
              id="damage_price"
              type="number"
              label="Стоимость ущерба, руб."
              value={state.damage_price}
              error={errors.damage_price}
              onChange={props.handleChange}
              boundKeys="damage_price"
              disabled={!isPermitted}
              modalKey={page}
            />
            <ExtField
              id="comment"
              type="string"
              label="Примечание"
              value={state.comment}
              error={errors.comment}
              onChange={props.handleChange}
              boundKeys="comment"
              disabled={!isPermitted}
              modalKey={page}
            />
            <FileField
              id="files"
              label="Файл"
              multiple
              value={state.files}
              error={errors.files}
              onChange={props.handleChange}
              boundKeys="files"
              disabled={!isPermitted}
              modalKey={page}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </ModalBodyPreloader>
      <EtsBootstrap.ModalFooter>
        {isPermitted ? ( // либо обновление, либо создание
          <EtsBootstrap.Button
            disabled={!props.canSave}
            onClick={props.defaultSubmit}>
            Сохранить
          </EtsBootstrap.Button>
        ) : (
          <DivNone />
        )}
      </EtsBootstrap.ModalFooter>
    </EtsBootstrap.ModalContainer>
  );
};

export default compose<PropsRoadAccident, OwnRoadAccidentProps>(
  connect<StatePropsRoadAccident, DispatchPropsRoadAccident, OwnRoadAccidentProps, ReduxState>(
    (state) => ({
      userCompanyId: state.session.userData.company_id,
    }),
    (dispatch, { page, path }) => ({
      autobaseGetAccidentCause: () => (
        dispatch(
          autobaseActions.autobaseGetSetRoadAccidentCause({}, { page, path }),
        )
      ),
      employeeDriverGetSetDriver: () => (
        dispatch(
          employeeActions.employeeDriverGetSetDriver({}, { page, path }),
        )
      ),
    }),
  ),
  withForm<PropsRoadAccidentWithForm, RoadAccident>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateRoadAccident,
    updateAction: autobaseActions.autobaseUpdateRoadAccident,
    mergeElement: (props) => {
      return getDefaultRoadAccidentElement(props.element);
    },
    schema: roadAccidentFormSchema,
    permissions: roadAccidentPermissions,
  }),
)(RoadAccidentForm);
