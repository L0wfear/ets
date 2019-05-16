import * as React from 'react';
import useForm from '../useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

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

const useWaybillFormData = {
  useFormDataIsDraft,
  useFormDataIsActive,
  useFormDataIsClosed,
  useFormDataIsActiveOrIsClosed,
  useWaybillPickStructureData,
};

export default useWaybillFormData;
