import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { isArray } from 'util';

type Props = {
  formDataKey: 'cleaning_area_rate';
};

const FieldCleanSubcategoryId: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningAreaRate>(props.formDataKey);
    const clean_category_id = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['clean_category_id']>(props.formDataKey, 'clean_category_id');
    const clean_subcategory_name = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['clean_subcategory_name']>(props.formDataKey, 'clean_subcategory_name');
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['clean_subcategory_id']>(props.formDataKey, 'clean_subcategory_id');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningAreaRate, string>(props.formDataKey, 'clean_subcategory_id');
    const handleChange = useForm.useFormDataHandleChange<CleaningAreaRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningAreaRate>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event, option?) => {
        const value = get(event, 'target.value', event);
        handleChange({
          clean_subcategory_id: value || null,
          clean_subcategory_name: get(option, 'name'),
        });
      },
      [handleChange],
    );

    const cleanCategoriesList = etsUseSelector((state) => getSomeUniqState(state).cleanCategoriesList);
    const options = React.useMemo(
      () => {
        const selected_category = cleanCategoriesList.find(({ id }) => id === clean_category_id);
        if (selected_category && isArray(selected_category.subcategories)) {
          return selected_category.subcategories.map(defaultSelectListMapper);
        }

        return [];
      },
      [cleanCategoriesList, clean_category_id],
    );

    React.useEffect(
      () => {
        if (formStateValue && options[0]) {
          if (!options.some(({ value }) => value === formStateValue)) {
            handleChangeWrap(null);
          }
        }
      },
      [handleChangeWrap, options, formStateValue],
    );

    return (
      <ExtField
        id={`${meta.path}_clean_subcategory_id`}
        type="select"
        label="Подкатегория ОДХ"
        value={formStateValue}
        options={options}
        placeholder={
          !isPermitted
            ? null
            : !clean_category_id
              ? 'Заполните поле "Категория ОДХ"'
              : !options[0]
                ? 'Список пуст'
                : 'Выберите...'
        }
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted || !clean_category_id || !options[0]}
        value_string={clean_subcategory_name}
      />
    );
  },
);

export default FieldCleanSubcategoryId;
