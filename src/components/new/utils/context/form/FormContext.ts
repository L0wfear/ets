import * as React from 'react';
import { SchemaFormContext, FormErrorBySchema } from './@types';
import { EtsModalContainerProps } from 'components/new/ui/@bootstrap/02-modal_container/EtsModalContainer';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

// что имееем по formData
export type OneFormDataByKey<F, Store extends object> = {
  key: string;                                                                  // уникальный ключ формы
  mergeElement: (element: Partial<F>, sessionData: InitialStateSession) => F;   // функция получения нужного для формы элемента
  uniqField: keyof F;                                                           // ключ, отсутсвие знаения которого говорит, что элемент создаётся
  schema: SchemaFormContext<F>;                                                 // схема, по которой всё генерируется и валидируется
  permissions: {                                                                // разрешения
    create: string | string[] | boolean;                                        //  создание
    update: string | string[] | boolean;                                        //  редактирование
    [k: string]: any;                                                           //  что ещё угодно
  };

  formState: F;                                                                 // состояни формы
  formErrors: FormErrorBySchema<F>;                                             // состояние ошибок
  IS_CREATING: boolean;                                                         // флаг создания элемента
  canSave: boolean;                                                             // можно ли сохранить
  page: string;                                                                 // ключ для загрузки
  path: string;                                                                 // ключ для загрузки #2
  isPermittedToCreate: boolean;                                                 // разрешено создавать?
  isPermittedToUpdate: boolean;                                                 // разрешено редактировать?

  // может быть не нужно хранить в каждой formData
  handleHide: (isSubmitted: boolean | any, resultSubmit?: F) => void;           // функция закрытия формы
  handleChange: (objChange: Partial<F>) => void;                                // функция изменения формы

  // может быть лучше по entitry и format
  handleSubmitPromise: (formState: F) => Promise<F>;                            // промис создания/ сохранения
  loadItemPromise?: (id: F[keyof F]) => Promise<F>;                             // Получениче данных по одному элементу

  bsSizeForm?: EtsModalContainerProps['bsSize'];                                // размер формы

  store: Store;                                                                 // всякие глобальные данные
};

// конфиг для hook withFormContext
export type ConfigFormData<F extends any, Store extends Record<string, any>> = {
  key: OneFormDataByKey<F, Store>['key'];
  mergeElement: OneFormDataByKey<F, Store>['mergeElement'];
  schema: OneFormDataByKey<F, Store>['schema'];
  uniqField?: OneFormDataByKey<F, Store>['uniqField'];
  permissions: OneFormDataByKey<F, Store>['permissions'];
  loadItemPromise?: OneFormDataByKey<F, Store>['loadItemPromise'];
  handleSubmitPromise: OneFormDataByKey<F, Store>['handleSubmitPromise'];
  bsSizeForm?: OneFormDataByKey<F, Store>['bsSizeForm'];
  store?: OneFormDataByKey<F, Store>['store'];
};

// необходимый набор для добавления данных по форме в контекст
export type ConfigFormDataForAdd<F extends any, Store extends Record<string, any>> = (
  ConfigFormData<F, Store>
  & Pick<
    OneFormDataByKey<F, Store>,
    'handleChange'
    | 'handleHide'
    | 'page'
    | 'path'
    | 'isPermittedToCreate'
    | 'isPermittedToUpdate'
    | 'IS_CREATING'
    | 'uniqField'
    | 'store'
  >
);

// что имеет контекст
export type InitialFormContextValue = {
  addFormData: <T extends any, Store extends Record<string, any>>(config: ConfigFormDataForAdd<T, Store>, element: Partial<T>, sessionData: InitialStateSession) => void;                             // добавление данных по форме в контекст
  removeFormData: <T extends any, Store extends Record<string, any>>(formDataKey: OneFormDataByKey<T, Store>['key']) => void;                                       // удаление данных формы из контекста
  handleChangeFormState: <T extends any, Store extends Record<string, any>>(formDataKey: string, obj: Partial<OneFormDataByKey<T, Store>['formState']>) => void;    // изменение состояния формы в контексте по ключу
  handleChangeStore: <T extends any, Store extends Record<string, any>>(formDataKey: string, obj: Partial<OneFormDataByKey<T, Store>['store']>) => void;            // изменение состояния стора в контексте по ключу
  formDataByKey: Record<string, OneFormDataByKey<any, any>>;                                                                                        // сами формы
};

// дефолтный контекст
export const initialContextValue: InitialFormContextValue = ({
  addFormData: (config, element) => null,
  removeFormData: (formDataKey) => null,
  handleChangeFormState: (formDataKey, obj) => null,
  handleChangeStore: (formDataKey, obj) => null,
  formDataByKey: {},
});

const FormContext = React.createContext<InitialFormContextValue>(initialContextValue);

export default FormContext;
