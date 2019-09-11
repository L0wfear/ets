import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { roadAccidentFormSchema } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/schema';

import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  OwnRoadAccidentProps,
  PropsRoadAccident,
  PropsRoadAccidentWithForm,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/road_accident/form/@types/RoadAccident';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/old/ui/input/fields';
import { isNullOrUndefined } from 'util';
import { getDefaultRoadAccidentElement } from './utils';
import roadAccidentPermissions from '../_config-data/permissions';
import { getSessionState } from 'redux-main/reducers/selectors';
import FieldRoadAccidentDriverId from './inside_fields/driver_id/FieldRoadAccidentDriverId';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { autobaseGetSetRoadAccidentCause } from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident_cause/actions';
import { autobaseCreateRoadAccident, autobaseUpdateRoadAccident } from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident/actions';

const RoadAccidentForm: React.FC<PropsRoadAccident> = (props) => {
  const [roadAccidentCauseOptions, setRoadAccidentCauseOptions] = React.useState([]);
  const [roadAccidentCauseIsLoading, setRoadAccidentCauseIsLoading] = React.useState(false);
  const dispatch = etsUseDispatch();
  const userCompanyId = etsUseSelector((stateRedux) => getSessionState(stateRedux).userData.company_id);

  const {
    formState: state,
    formErrors: errors,

    page, path,
  } = props;

  const IS_CREATING = !state.id;

  const title = !IS_CREATING
    ? 'Изменение записи'
    : 'Создание записи';

  const ownIsPermitted = !IS_CREATING
    ? props.isPermittedToUpdate
    : props.isPermittedToCreate;

  const isPermitted =
    ownIsPermitted &&
    (isNullOrUndefined(state.company_id) ||
      state.company_id === userCompanyId);

  const roadAccidentCauseOptionsLoad = React.useCallback (async () => {
    try {
      setRoadAccidentCauseIsLoading(true);
      const { data } = await dispatch(
        autobaseGetSetRoadAccidentCause(
          {},
          { page, path },
        ),
      );

      setRoadAccidentCauseOptions(
        data.map(defaultSelectListMapper),
      );

    } catch (error) {
      console.error(error); // tslint:disable-line
    }
    setRoadAccidentCauseIsLoading(false);
  }, []);

  React.useEffect(
    () => {
      roadAccidentCauseOptionsLoad();
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
              makeGoodFormat
            />
            <FieldRoadAccidentDriverId
              driver_id={state.driver_id}
              error_driver_id={errors.driver_id}
              isPermitted={isPermitted}
              handleChange={props.handleChange}
              page={page}
              path={path}
              car_gov_number={state.car_gov_number}
              car_id={state.car_id}

              driver_fio={state.driver_fio}
              employee_position_name={state.employee_position_name}
              special_license={state.special_license}
              drivers_license={state.drivers_license}
              accident_date={state.accident_date}
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
              etsIsLoading={roadAccidentCauseIsLoading}
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
  withForm<PropsRoadAccidentWithForm, RoadAccident>({
    uniqField: 'id',
    createAction: autobaseCreateRoadAccident,
    updateAction: autobaseUpdateRoadAccident,
    mergeElement: (props) => {
      return getDefaultRoadAccidentElement(props.element);
    },
    schema: roadAccidentFormSchema,
    permissions: roadAccidentPermissions,
  }),
)(RoadAccidentForm);
