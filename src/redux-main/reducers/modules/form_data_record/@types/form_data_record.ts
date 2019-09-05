import { SchemaFormContext, FormErrorBySchema } from 'components/@next/@form/@types';
import { EtsModalContainerProps } from 'components/new/ui/@bootstrap/02-modal_container/EtsModalContainer';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

type FormKeys = string;

export type OneFormDataByKey<F extends object, Store extends object> = {
  key: string;                                                                  // уникальный ключ формы
  uniqField: keyof F;                                                           // ключ, отсутсвие знаения которого говорит, что элемент создаётся
  schema: SchemaFormContext<F>;                                                 // схема, по которой всё генерируется и валидируется
  permissions: {                                                                // разрешения
    create: string | boolean | Array<string | boolean>;                         //  создание
    update: string | boolean | Array<string | boolean>;                         //  редактирование
    [k: string]: string | boolean | Array<string | boolean>;                    //  что ещё угодно
  };

  formState: F;                                                                 // состояни формы
  formErrors: FormErrorBySchema<F>;                                             // состояние ошибок
  IS_CREATING: boolean;                                                         // флаг создания элемента
  canSave: boolean;                                                             // можно ли сохранить
  meta: LoadingMeta;                                                            // ключ для загрузки
  isPermittedToCreate: boolean;                                                 // разрешено создавать?
  isPermittedToUpdate: boolean;                                                 // разрешено редактировать?

  bsSizeForm?: EtsModalContainerProps['bsSize'];                                // размер формы
  store: Store;                                                                 // всякие глобальные данные

  // может быть лучше по entitry и format
  handleSubmitPromise: (formState: F) => Promise<F>;                            // промис создания/ сохранения
  handleHide: (isSubmitted: boolean | any, resultSubmit?: Partial<F>) => void;  // функция закрытия формы
};

export type IStateFormDataRecord = Record<FormKeys, OneFormDataByKey<any, {}>>;
