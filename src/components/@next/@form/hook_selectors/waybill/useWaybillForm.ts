import * as React from 'react';

import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { WaybillFormStoreType } from 'components/new/pages/waybill/form/context/@types';
import { getSessionState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import { getFormDataFormStateByKey, getFormDataIsCreatingByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import useForm from 'components/@next/@form/hook_selectors/useForm';

/**
 * является ли открытый ПЛ черновиком (IS_DRAFT)
 */
const useFormDataIsDraft = (formDataKey: string) => {
  const IS_DRAFT = etsUseSelector(
    (state) => {
      const IS_CREATING = getFormDataIsCreatingByKey<Waybill, WaybillFormStoreType>(state, formDataKey);
      const formState = getFormDataFormStateByKey<Waybill, WaybillFormStoreType>(state, formDataKey);

      return (
        IS_CREATING
        || (
          formState ? formState.status === 'draft' : false
        )
      );
    },
  );

  return IS_DRAFT;
};

/**
 * является ли открытый ПЛ активным (IS_ACTIVE)
 */
export const useFormDataIsActive = (formDataKey: string) => {
  const IS_ACTIVE = etsUseSelector((state) => getFormDataFormStateByKey<Waybill, WaybillFormStoreType>(state, formDataKey).status === 'active');

  return IS_ACTIVE;
};

/**
 * является ли открытый ПЛ закрытым (IS_CLOSED)
 */
export const useFormDataIsClosed = (formDataKey: string) => {
  const IS_CLOSED = etsUseSelector((state) => getFormDataFormStateByKey<Waybill, WaybillFormStoreType>(state, formDataKey).status === 'closed');

  return IS_CLOSED;
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
  const canEditIfClose = etsUseSelector(
    (state) => {
      const permissionsSet = getSessionState(state).userData.permissionsSet;
      const formState = getFormDataFormStateByKey<Waybill, WaybillFormStoreType>(state, formDataKey);
      const IS_CLOSED = getFormDataFormStateByKey<Waybill, WaybillFormStoreType>(state, formDataKey).status === 'closed';

      return (
        IS_CLOSED
          && formState.closed_editable
          && validatePermissions(waybillPermissions.update_closed, permissionsSet)
      );
    },
  );

  return canEditIfClose;
};

/**
 * Получение информации о возможности просмотра, изменения и удаления преприятия
 * STRUCTURE_FIELD_VIEW - просмотр
 * STRUCTURE_FIELD_READONLY - дизейбл
 * STRUCTURE_FIELD_DELETABLE - возможность удалить
 */
const useFormDataPickStructureData = (options: Array<any>) => {
  const userStructureId = etsUseSelector(
    (state) => getSessionState(state).userData.structure_id,
  );

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

const useFormDataGetSelectedCar = (formDataKey: string) => {
  const car_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_id']>(formDataKey, 'car_id');
  const carActualList = useForm.useFormDataStorePickValue<Waybill, WaybillFormStoreType>(formDataKey, 'carActualList');

  const selectedCar = React.useMemo(
    () => {
      const selectedCarFind = carActualList.options.find(
        ({ rowData }) => rowData.asuods_id === car_id,
      );

      if (selectedCarFind) {
        return selectedCarFind.rowData;
      }

      return null;
    },
    [carActualList, car_id],
  );

  return selectedCar;
};

const useFormDataGetSelectedTrailer = (formDataKey: string) => {
  const trailer_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['trailer_id']>(formDataKey, 'trailer_id');
  const carActualList = useForm.useFormDataStorePickValue<Waybill, WaybillFormStoreType>(formDataKey, 'carActualList');

  const selectedTrailer = React.useMemo(
    () => {
      const selectedTrailerFind = carActualList.options.find(
        ({ rowData }) => rowData.asuods_id === trailer_id,
      );

      if (selectedTrailerFind) {
        return selectedTrailerFind.rowData;
      }

      return null;
    },
    [carActualList, trailer_id],
  );

  return selectedTrailer;
};

const useFormDataIsPermittedForDepartureAndArrivalValues = (formDataKey: string) => {
  return true;
  // return etsUseIsPermitted(permissions.departure_and_arrival_values);
};

const useWaybillFormData = {
  useFormDataIsDraft,
  useFormDataIsActive,
  useFormDataIsClosed,
  useFormDataIsActiveOrIsClosed,
  useFormDataPickStructureData,
  useFormDataCanEditIfClose,
  useFormDataGetSelectedCar,
  useFormDataGetSelectedTrailer,
  useFormDataIsPermittedForDepartureAndArrivalValues,
};

export default useWaybillFormData;
