import { SchemaFormContext, FormErrorBySchema } from 'components/@next/@form/@types';
import { EtsModalContainerProps } from 'components/new/ui/@bootstrap/02-modal_container/EtsModalContainer';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { ReduxState } from 'redux-main/@types/state';

export type FormKeys = (
  'maintenance_work'
  | 'inspect_one_act_scan'
  | 'consumable_material'
  | 'norm'
  | 'cleaning_area_rate'
  | 'fuel_operations'
  | 'cleaning_rate'
  | 'mission'
);

export type OneFormDataByKey<F extends Record<string, any>> = {
  formState: F;                                                                 // состояни формы
  originalFormState: F;                                                         // состояние формы при инициализации
  formErrors: FormErrorBySchema<F>;                                             // состояние ошибок
  IS_CREATING: boolean;                                                         // флаг создания элемента
  canSave: boolean;                                                             // можно ли сохранить
  meta: LoadingMeta;                                                            // ключ для загрузки
  isPermittedToCreate: boolean;                                                 // разрешено создавать?
  isPermittedToUpdate: boolean;                                                 // разрешено редактировать?
};

export type ConfigFormData<F extends Record<string, any>> = {
  uniqField: Extract<keyof F, string>;                                          // ключ, отсутсвие знаения которого говорит, что элемент создаётся
  schema: SchemaFormContext<F>;                                                 // схема, по которой всё генерируется и валидируется
  permissions: {                                                                // разрешения
    create: string | boolean | Array<string | boolean>;                         // создание
    update: string | boolean | Array<string | boolean>;                         // редактирование
    [k: string]: string | boolean | Array<string | boolean>;                    // что ещё угодно
  };
  bsSizeForm?: EtsModalContainerProps['bsSize'];                                // размер формы
  getDefaultElement: (reduxState: ReduxState) => F;
  getOneRecordPromise?: (id: number) => Promise<F>;
  handleSubmitPromise: (formState: F, ...any: any[]) => Promise<Partial<F>>,

} & (
  F extends { structure_id: number; structure_name: string }
    ? {
      user_structure_on_new?: boolean;                                              // Вставлять подразделение пользователя при создании
    }
    : {}
);

export type IStateFormDataRecord = Partial<Record<FormKeys, OneFormDataByKey<any>>>;
