import * as React from 'react';
import EtsModal from 'components/new/ui/modal/Modal';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as Button from 'react-bootstrap/lib/Button';
import { ExtField } from 'components/ui/new/field/ExtField';
import { compose } from 'recompose';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { roadAccidentFormSchema } from 'components/new/pages/nsi/autobase/pages/road_accident/form/schema';

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
} from 'components/new/pages/nsi/autobase/pages/road_accident/form/@types/RoadAccident';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/ui/input/fields';
import { isNullOrUndefined } from 'util';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getDefaultRoadAccidentElement } from './utils';
import roadAccidentPermissions from '../_config-data/permissions';

const RoadAccidentForm: React.FC<PropsRoadAccident> = (props) => {
  const [roadAccidentCauseOptions, setRoadAccidentCauseOptions] = React.useState([]);
  const [driversOptions, setDriversOptions] = React.useState([]);

  const {
    formState: state,
    formErrors: errors,

    params,
    page, path,
  } = props;

  const car_actual_asuods_id = getNumberValueFromSerch(params.car_actual_asuods_id);

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
    [isPermitted],
  );

  React.useEffect(
    () => {
      if (car_actual_asuods_id) {
        props.handleChange('car_id', car_actual_asuods_id);
      }
    },
    [car_actual_asuods_id],
  );

  return (
    <EtsModal
      id="modal-insurance-policy"
      show
      onHide={props.hideWithoutChanges}
      backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <Row>
          <Col md={12}>
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
          </Col>
        </Row>
      </ModalBodyPreloader>
      <Modal.Footer>
        {isPermitted ? ( // либо обновление, либо создание
          <Button
            disabled={!props.canSave}
            onClick={props.defaultSubmit}>
            Сохранить
          </Button>
        ) : (
          <DivNone />
        )}
      </Modal.Footer>
    </EtsModal>
  );
};

export default compose<PropsRoadAccident, OwnRoadAccidentProps>(
  withSearch,
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
