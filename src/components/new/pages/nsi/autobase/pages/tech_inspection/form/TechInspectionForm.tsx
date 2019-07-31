import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import techInspectionPermissions from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data/permissions';
import { compose } from 'recompose';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { techInspectionFormSchema } from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/shema';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

import { getDefaultTechInspectionElement } from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import {
  OwnTechInspectionProps,
  PropsTechInspection,
  StatePropsTechInspection,
  DispatchPropsTechInspection,
  PropsTechInspectionWithForm,
} from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/@types/TechInspectionForm';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/old/ui/input/fields';
import { isNullOrUndefined } from 'util';
import { getSessionState } from 'redux-main/reducers/selectors';

import { get } from 'lodash';

const TechInspectionForm: React.FC<PropsTechInspection> = (props) => {
  const [carListOptions, setCarListOptions] = React.useState([]);

  const {
    formState: state,
    formErrors: errors,
    selectedCarData,

    page,
    path,
  } = props;

  const car_id = get(selectedCarData, 'asuods_id', null);

  const IS_CREATING = !state.id;

  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const ownIsPermitted = (
    !IS_CREATING
      ? props.isPermittedToUpdate
      : props.isPermittedToCreate
  );

  const isPermitted = (
    ownIsPermitted
    && (
      isNullOrUndefined(state.company_id)
      || state.company_id === props.userCompanyId
    )
  );

  React.useEffect(
    () => {
      if (!car_id) {
        props.autobaseGetSetCar({}, { page, path }).then(
          ({ data }) => (
            setCarListOptions(
              data.map(
                (rowData) => ({
                  value: rowData.asuods_id,
                  label: rowData.gov_number,
                  rowData,
                }),
              ),
            )
          ),
        );
      }
    },
    [IS_CREATING, car_id],
  );

  const handleChangeIsActiveToTrue = React.useCallback(
    () => {
      props.handleChange({
        is_allowed: true,
      });
    },
    [],
  );
  const handleChangeIsActiveToFalse = React.useCallback(
    () => {
      props.handleChange({
        is_allowed: false,
      });
    },
    [],
  );

  return (
    <EtsBootstrap.ModalContainer
      id="modal-tech-inspection"
      show
      onHide={props.hideWithoutChanges}
     >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            {!car_id && (
              <ExtField
                id="car_id"
                type="select"
                label="Номер транспортного средства"
                value={state.car_id}
                error={errors.car_id}
                options={carListOptions}
                emptyValue={null}
                onChange={props.handleChange}
                boundKeys="car_id"
                clearable={false}
                disabled={!isPermitted}
                modalKey={path}
              />
            )}
            <ExtField
              id="reg_number"
              type="string"
              label="Номер диагностической карты/Талона ГТО"
              value={state.reg_number}
              error={errors.reg_number}
              onChange={props.handleChange}
              boundKeys="reg_number"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="date_end"
              type="date"
              label="Срок действия до"
              date={state.date_end}
              time={false}
              error={errors.date_end}
              onChange={props.handleChange}
              boundKeys="date_end"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="tech_operator"
              type="string"
              label="Место выдачи"
              value={state.tech_operator}
              error={errors.tech_operator}
              onChange={props.handleChange}
              boundKeys="tech_operator"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="date_start"
              type="date"
              label="Дата прохождения"
              date={state.date_start}
              time={false}
              error={errors.date_start}
              onChange={props.handleChange}
              boundKeys="date_start"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="true_is_allowed"
              type="boolean"
              label="Заключение о возможности эксплуатации ТС"
              value={state.is_allowed}
              error={errors.is_allowed}
              emptyValue={null}
              onChange={handleChangeIsActiveToTrue}
              boundKeys="is_allowed"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="false_is_allowed"
              type="boolean"
              label="Заключение о невозможности эксплуатации ТС"
              value={!state.is_allowed}
              error={errors.is_allowed}
              emptyValue={null}
              onChange={handleChangeIsActiveToFalse}
              boundKeys="is_allowed"
              disabled={!isPermitted}
              modalKey={path}
            />
            <ExtField
              id="note"
              type="string"
              label="Примечание"
              value={state.note}
              error={errors.note}
              onChange={props.handleChange}
              boundKeys="note"
              disabled={!isPermitted}
              modalKey={path}
            />
            <FileField
              id="file"
              label="Файл"
              multiple
              value={state.files}
              error={errors.files}
              onChange={props.handleChange}
              boundKeys="files"
              disabled={!isPermitted}
              modalKey={path}
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

export default compose<PropsTechInspection, OwnTechInspectionProps>(
  connect<
    StatePropsTechInspection,
    DispatchPropsTechInspection,
    OwnTechInspectionProps,
    ReduxState
  >(
    (state) => ({
      userCompanyId: getSessionState(state).userData.company_id,
    }),
    (dispatch: any) => ({
      autobaseGetSetCar: (...arg) =>
        dispatch(autobaseActions.autobaseGetSetCar(...arg)),
    }),
  ),
  withForm<PropsTechInspectionWithForm, TechInspection>({
    uniqField: 'id',
    createAction: autobaseActions.autobaseCreateTechInspection,
    updateAction: autobaseActions.autobaseUpdateTechInspection,
    mergeElement: (props) => {
      return getDefaultTechInspectionElement(props.element);
    },
    schema: techInspectionFormSchema,
    permissions: techInspectionPermissions,
  }),
)(TechInspectionForm);
