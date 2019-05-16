import * as React from 'react';
import { SchemaFormContext, FormErrorBySchema } from './@types';
import { Modal } from 'react-bootstrap';

// что имееем по formData
export type OneFormDataByKey<F> = {
  key: string;                                                        // уникальный ключ формы
  mergeElement: (element: Partial<F>) => F;                           // функция получения нужного для формы элемента
  uniqField: keyof F;                                                 // ключ, отсутсвие знаения которого говорит, что элемент создаётся
  schema: SchemaFormContext<F>;                                       // схема, по которой всё генерируется и валидируется
  permissions: {                                                      // разрешения
    create: string | string[] | boolean;                              //  создание
    update: string | string[] | boolean;                              //  редактирование
    [k: string]: any;                                                 //  что ещё угодно
  };

  formState: F;                                                       // состояни формы
  formErrors: FormErrorBySchema<F>;                                   // состояние ошибок
  IS_CREATING: boolean;                                               // флаг создания элемента
  canSave: boolean;                                                   // можно ли сохранить
  page: string;                                                       // ключ для загрузки
  path: string;                                                       // ключ для загрузки #2
  isPermittedToCreate: boolean;                                       // разрешено создавать?
  isPermittedToUpdate: boolean;                                       // разрешено редактировать?

  // может быть не нужно хранить в каждой formData
  handleHide: (isSubmitted: boolean | any, resultSubmit?: F) => void; // функция закрытия формы
  handleChange: (objChange: Partial<F>) => void;                      // функция изменения формы

  // может быть лучше по entitry и format
  handleSubmitPromise: (formState: F) => Promise<F>;                  // промис создания/ сохранения
  loadItemPromise?: (id: F[keyof F]) => Promise<F>;                   // Получениче данных по одному элементу

  bsSizeForm?: Modal.ModalProps['bsSize'];                            // размер формы

  store: Record<string, any>;                                         // всякие глобальные данные
};

// конфиг для hook withFormContext
export type ConfigFormData<F extends any> = {
  key: OneFormDataByKey<F>['key'];
  mergeElement: OneFormDataByKey<F>['mergeElement'];
  schema: OneFormDataByKey<F>['schema'];
  uniqField?: OneFormDataByKey<F>['uniqField'];
  permissions: OneFormDataByKey<F>['permissions'];
  loadItemPromise?: OneFormDataByKey<F>['loadItemPromise'];
  handleSubmitPromise: OneFormDataByKey<F>['handleSubmitPromise'];
  bsSizeForm?: OneFormDataByKey<F>['bsSizeForm'];
  store?: OneFormDataByKey<F>['store'];
};

// необходимый набор для добавления данных по форме в контекст
export type ConfigFormDataForAdd<F extends any> = (
  ConfigFormData<F>
  & Pick<
    OneFormDataByKey<F>,
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
  addFormData: <T extends any>(config: ConfigFormDataForAdd<T>, element: Partial<T>) => void;                             // добавление данных по форме в контекст
  removeFormData: <T extends any>(formDataKey: OneFormDataByKey<T>['key']) => void;                                       // удаление данных формы из контекста
  handleChangeFormState: <T extends any>(formDataKey: string, obj: Partial<OneFormDataByKey<T>['formState']>) => void;    // изменение состояния формы в контексте по ключу
  handleChangeStore: <T extends any>(formDataKey: string, obj: Partial<OneFormDataByKey<T>['store']>) => void;            // изменение состояния стора в контексте по ключу
  formDataByKey: Record<string, OneFormDataByKey<any>>;                                                                   // сами формы
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
