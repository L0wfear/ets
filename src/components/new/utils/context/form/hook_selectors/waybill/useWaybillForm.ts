import * as React from 'react';
import useForm from '../useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import { useSelector, shallowEqual } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';
import { ReduxState } from 'redux-main/@types/state';

/**
 * является ли открытый ПЛ черновиком (IS_DRAFT)
 */
const useFormDataIsDraft = (formDataKey: string) => {
  const IS_CREATING = useForm.useFormDataSchemaIsCreating<Waybill>(formDataKey);
  const formState = useForm.useFormDataFormState<Waybill>(formDataKey);

  return (
    IS_CREATING
    || (
      formState ? formState.status === 'draft' : false
    )
  );
};

/**
 * является ли открытый ПЛ активным (IS_ACTIVE)
 */
export const useFormDataIsActive = (formDataKey: string) => {
  const formState = useForm.useFormDataFormState<Waybill>(formDataKey);

  return formState ? formState.status === 'active' : false;
};

/**
 * является ли открытый ПЛ закрытым (IS_CLOSED)
 */
export const useFormDataIsClosed = (formDataKey: string) => {
  const formState = useForm.useFormDataFormState<Waybill>(formDataKey);

  return formState ? formState.status === 'closed' : null;
};

/**
 * является ли открытый ПЛ активным или закрытым (IS_CLOSE_OR_IS_ACTIVE)
 */
const useFormDataIsActiveOrIsClosed = (formDataKey: string) => {
  const IS_ACTIVE = useFormDataIsActive(formDataKey);
  const IS_CLOSED = useFormDataIsClosed(formDataKey);

  return IS_ACTIVE || IS_CLOSED;
};

/**
 * можно ли редактировать закрытый ПЛ | можно, если нет он последний и нет активного для выбранного тс
 */
const useFormDataCanEditIfClose = (formDataKey: string) => {
  const userData = useSelector<ReduxState, InitialStateSession['userData']>(
    (state) => getSessionState(state).userData,
    shallowEqual,
  );

  const formState = useForm.useFormDataFormState<Waybill>(formDataKey);
  const IS_CLOSED = useFormDataIsClosed(formDataKey);

  const canEditIfClose = React.useMemo(
    () => {
      return (
        IS_CLOSED
          && formState.closed_editable
          && userData.permissionsSet.has(waybillPermissions.update_closed)
      );
    },
    [formState.closed_editable, IS_CLOSED, userData.permissionsSet],
  );

  return canEditIfClose;
};

/**
 * Получение информации о возможности просмотра, изменения и удаления преприятия
 * STRUCTURE_FIELD_VIEW - просмотр
 * STRUCTURE_FIELD_READONLY - дизейбл
 * STRUCTURE_FIELD_DELETABLE - возможность удалить
 */
const useWaybillPickStructureData = (options: Array<any>, userStructureId: number) => {
  return React.useMemo(
    () => {
      let STRUCTURE_FIELD_VIEW = false;
      let STRUCTURE_FIELD_READONLY = false;
      let STRUCTURE_FIELD_DELETABLE = false;

      if (
        userStructureId !== null
        && options.length === 1
        && userStructureId === options[0].value
      ) {
        STRUCTURE_FIELD_VIEW = true;
        STRUCTURE_FIELD_READONLY = true;
      } else if (
        userStructureId !== null
        && options.length > 1
        && options.some((el) => el.value === userStructureId)
      ) {
        STRUCTURE_FIELD_VIEW = true;
      } else if (userStructureId === null && options.length > 1) {
        STRUCTURE_FIELD_VIEW = true;
        STRUCTURE_FIELD_DELETABLE = true;
      }

      return {
        STRUCTURE_FIELD_VIEW,
        STRUCTURE_FIELD_READONLY,
        STRUCTURE_FIELD_DELETABLE,
      };
    },
    [options, userStructureId],
  );
};

const useFormDataFetSelectedCar = (formDataKey: string) => {
  const formState = useForm.useFormDataFormState<Waybill>(formDataKey);
  const store = useForm.useFormDataStore<Waybill, WaybillFormStoreType>(formDataKey);

  const selectedCar = React.useMemo(
    () => {
      const selectedCarFind = store.carActualList.options.find(
        ({ rowData }) => rowData.asuods_id === formState.car_id,
      );

      if (selectedCarFind) {
        return selectedCarFind.rowData;
      }

      return null;
    },
    [store.carActualList, formState.car_id],
  );

  return selectedCar;
};

const useFormDataFetSelectedTrailer = (formDataKey: string) => {
  const formState = useForm.useFormDataFormState<Waybill>(formDataKey);
  const store = useForm.useFormDataStore<Waybill, WaybillFormStoreType>(formDataKey);

  const selectedTrailer = React.useMemo(
    () => {
      const selectedTrailerFind = store.carActualList.options.find(
        ({ rowData }) => rowData.asuods_id === formState.trailer_id,
      );

      if (selectedTrailerFind) {
        return selectedTrailerFind.rowData;
      }

      return null;
    },
    [store.carActualList, formState.trailer_id],
  );

  return selectedTrailer;
};

const useFormDataIsPermittedForDepartureAndArrivalValues = (formDataKey: string) => {
  const userData = useSelector<ReduxState, InitialStateSession['userData']>(
    (state) => getSessionState(state).userData,
    shallowEqual,
  );

  const waybillFormData = useForm.useFormData<Waybill, WaybillFormStoreType>(formDataKey);

  return React.useMemo(
    () => {
      return (
        userData.permissionsSet.has(waybillFormData.permissions.departure_and_arrival_values)
      );
    },
    [waybillFormData.permissions.departure_and_arrival_values, userData.permissionsSet],
  );
};

const useWaybillFormData = {
  useFormDataIsDraft,
  useFormDataIsActive,
  useFormDataIsClosed,
  useFormDataIsActiveOrIsClosed,
  useWaybillPickStructureData,
  useFormDataCanEditIfClose,
  useFormDataFetSelectedCar,
  useFormDataFetSelectedTrailer,
  useFormDataIsPermittedForDepartureAndArrivalValues,
};

export default useWaybillFormData;
