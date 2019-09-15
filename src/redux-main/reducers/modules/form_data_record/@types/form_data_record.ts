import { SchemaFormContext, FormErrorBySchema } from 'components/@next/@form/@types';
import { EtsModalContainerProps } from 'components/new/ui/@bootstrap/02-modal_container/EtsModalContainer';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

export type FormKeys = (
  'maintenance_work'
  | string
);

export type OneFormDataByKey<F extends object> = {
  formState: F;                                                                 // состояни формы
  formErrors: FormErrorBySchema<F>;                                             // состояние ошибок
  IS_CREATING: boolean;                                                         // флаг создания элемента
  canSave: boolean;                                                             // можно ли сохранить
  meta: LoadingMeta;                                                            // ключ для загрузки
  isPermittedToCreate: boolean;                                                 // разрешено создавать?
  isPermittedToUpdate: boolean;                                                 // разрешено редактировать?
};

export type ConfigFormData<F extends Record<string, any>> = {
  uniqField: keyof F;                                                           // ключ, отсутсвие знаения которого говорит, что элемент создаётся
  schema: SchemaFormContext<F>;                                                 // схема, по которой всё генерируется и валидируется
  permissions: {                                                                // разрешения
    create: string | boolean | Array<string | boolean>;                         // создание
    update: string | boolean | Array<string | boolean>;                         // редактирование
    [k: string]: string | boolean | Array<string | boolean>;                    // что ещё угодно
  };
  bsSizeForm?: EtsModalContainerProps['bsSize'];                                // размер формы
  default_element: F;
  handleSubmitPromise: (formState: F) => Promise<F | any>,
};

export type IStateFormDataRecord = Partial<Record<FormKeys, OneFormDataByKey<any>>>;
