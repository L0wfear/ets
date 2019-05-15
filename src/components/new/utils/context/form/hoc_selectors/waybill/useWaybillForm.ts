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

  return formState ? formState.status === 'closed' : false;
};

const useWaybillFormData = {
  useFormDataIsDraft,
  useFormDataIsActive,
  useFormDataIsClosed,
};

export default useWaybillFormData;
