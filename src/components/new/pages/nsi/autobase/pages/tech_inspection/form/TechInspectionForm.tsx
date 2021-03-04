import * as React from 'react';
import { isNullOrUndefined } from 'util';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import techInspectionPermissions from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data/permissions';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { techInspectionFormSchema } from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/shema';

import { defaultTechInspection, getDefaultTechInspectionElement } from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/utils';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import {
  PropsTechInspection,
  PropsTechInspectionWithForm,
} from 'components/new/pages/nsi/autobase/pages/tech_inspection/form/@types/TechInspectionForm';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { DivNone } from 'global-styled/global-styled';
import { FileField } from 'components/old/ui/input/fields';
import { getSessionState, getSomeUniqState } from 'redux-main/reducers/selectors';

import { autobaseCreateTechInspection, autobaseUpdateTechInspection } from 'redux-main/reducers/modules/autobase/actions_by_type/tech_inspection/actions';
import useCarActualOptions from 'components/new/utils/hooks/services/useOptions/useCarActualOptions';
import { carActualOptionLabelGarage } from 'components/@next/@utils/formatData/formatDataOptions';
import { handleChangeBooleanWithSavedFields } from 'utils/functions';
import { registryKey as  techInspectionArchiveRegistryKey} from 'components/new/pages/nsi/autobase/pages/tech_inspection_archive/TechInspectionArchiveList';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { techInspectionArchivePermissions } from 'components/new/pages/nsi/autobase/pages/tech_inspection_archive/_config-data/permissions';
import { actionGetAndSetInStoreMoscowTimeServer } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import { createValidDate, diffDates } from 'components/@next/@utils/dates/dates';

const inspectionFields: Array<keyof TechInspection> = [
  'reg_number',
  'date_end',
  'tech_operator',
  'date_start',
];

const TechInspectionForm: React.FC<PropsTechInspection> = (props) => {
  const [carListOptions, setCarListOptions] = React.useState([]);
  const [savedFields, setSavedFields] = React.useState<Partial<TechInspection>>(null);
  const {
    formState: state,
    formErrors: errors,
    selectedCarData,
    page,
    path,
  } = props;

  const car_id = get(selectedCarData, 'asuods_id', null);
  const dispatch = etsUseDispatch();
  const IS_CREATING = !state.id;
  const is_archive = props.registryKey === techInspectionArchiveRegistryKey;
  const userCompanyId = etsUseSelector((state) => getSessionState(state).userData.company_id);
  const title = !IS_CREATING ? 'Изменение записи' : 'Создание записи';
  const ownIsPermitted = (
    !IS_CREATING
      ? props.isPermittedToUpdate
      : props.isPermittedToCreate
  );
  const isPermittedUpdateExpired = etsUseSelector(
    (state) => getSessionState(state).userData.permissionsSet.has(techInspectionArchivePermissions.update_expired),
  );
  const moscowTime = etsUseSelector((state) => getSomeUniqState(state).moscowTimeServer.date);
  const isExpired = React.useMemo(() => {
    return diffDates(createValidDate(moscowTime), createValidDate(state.date_end), 'days') > 1;
  }, [state.date_end, moscowTime]);

  const isPermitedDefault = (
    ownIsPermitted
    && (
      isNullOrUndefined(state.company_id)
      || state.company_id === userCompanyId
    )
  );
  const isPermitted = isPermitedDefault && (!isExpired || isPermittedUpdateExpired) && !is_archive;
  const carActualOptions = useCarActualOptions(props.page, props.path, { labelFunc: carActualOptionLabelGarage, });
  const carList = carActualOptions.options;
  const isLoading = carActualOptions.isLoading;
  const isAvailableForChangeIsNotInspectionable = React.useMemo(() => {
    const isFilledSomeOfInsuranceField = inspectionFields.some((key) => Boolean(state[key]));
    return !isFilledSomeOfInsuranceField || IS_CREATING;
  }, [IS_CREATING]);

  const warningText = React.useMemo(() => {
    return !IS_CREATING && !isAvailableForChangeIsNotInspectionable 
      ? 'Невозможно изменить признак необходимости прохождения ТО/ГТО в существующей записи с информацией о диагностической карте'
      : '';
  }, [IS_CREATING, isAvailableForChangeIsNotInspectionable]);

  React.useEffect(
    () => {
      if (!car_id && carList.length) {
        setCarListOptions(carList);
      }
    },
    [IS_CREATING, car_id, carList],
  );

  React.useEffect(
    () => {
      dispatch(actionGetAndSetInStoreMoscowTimeServer({}, {page, path}));
    }, 
    []
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
  const handleChangeIsNotInspectionable = React.useCallback((field, event) => {
    handleChangeBooleanWithSavedFields<TechInspection>(
      state.is_not_inspectionable, 
      inspectionFields, 
      state, 
      defaultTechInspection,
      savedFields, 
      setSavedFields,
      props.handleChange
    );
    props.handleChangeBoolean(field, event);
  }, [props.handleChangeBoolean, state, props.handleChange, savedFields]);

  return (
    <EtsBootstrap.ModalContainer
      id="modal-tech-inspection"
      show
      onHide={props.hideWithoutChanges}
    >
      <EtsBootstrap.ModalHeader closeButton>
        <EtsBootstrap.ModalTitle> {title} </EtsBootstrap.ModalTitle>
      </EtsBootstrap.ModalHeader>
      <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            {!car_id && (
              <ExtField
                id="car_id"
                type="select"
                label="Рег. номер ТС"
                value={state.car_id}
                error={errors.car_id}
                options={carListOptions}
                emptyValue={null}
                onChange={props.handleChange}
                boundKeys="car_id"
                clearable={false}
                disabled={!isPermitted}
                modalKey={path}
                hint="Выводится рег. номер ТС, актуальный на текущий день."
                etsIsLoading={isLoading}
              />
            )}
            <ExtField
              id="is_not_inspectionable"
              type="boolean"
              label="Не подлежит прохождению ТО/ГТО"
              value={state.is_not_inspectionable}
              error={errors.is_not_inspectionable}
              onChange={handleChangeIsNotInspectionable}
              boundKeys="is_not_inspectionable"
              disabled={!isPermitted || !isAvailableForChangeIsNotInspectionable}
              modalKey={path}
              warning={warningText}
            />
            {!Boolean(state.is_not_inspectionable) &&(
              <>
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
              </>
            )}
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
        {isPermitedDefault ? ( // либо обновление, либо создание
          <EtsBootstrap.Button
            disabled={!props.canSave || !isPermitted}
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

export default withForm<PropsTechInspectionWithForm, TechInspection>(
  {
    uniqField: 'id',
    createAction: autobaseCreateTechInspection,
    updateAction: autobaseUpdateTechInspection,
    mergeElement: (props) => {
      return getDefaultTechInspectionElement(props.element);
    },
    schema: techInspectionFormSchema,
    permissions: techInspectionPermissions,
  }
)(TechInspectionForm);
