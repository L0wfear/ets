import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { CleaningAreaRate } from 'redux-main/reducers/modules/cleaning_area_rate/@types/cleaningAreaRate';
import { defaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';

type Props = {
  formDataKey: 'cleaning_area_rate';
};

const FieldCleanCategoryId: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<CleaningAreaRate>(props.formDataKey);
    const clean_category_name = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['clean_category_name']>(props.formDataKey, 'clean_category_name');
    const formStateValue = useForm.useFormDataFormStatePickValue<CleaningAreaRate, CleaningAreaRate['clean_category_id']>(props.formDataKey, 'clean_category_id');
    const error = useForm.useFormDataFormErrorsPickValue<CleaningAreaRate, string>(props.formDataKey, 'clean_category_id');
    const handleChange = useForm.useFormDataHandleChange<CleaningAreaRate>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<CleaningAreaRate>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event, option?) => {
        const value = get(event, 'target.value', event);
        handleChange({
          clean_category_id: value || null,
          clean_category_name: get(option, 'label'),
        });
      },
      [handleChange],
    );

    const cleanCategoriesList = etsUseSelector((state) => getSomeUniqState(state).cleanCategoriesList);

    const options = React.useMemo(
      () => {
        return cleanCategoriesList.map(defaultSelectListMapper);
      },
      [cleanCategoriesList],
    );

    return (
      <ExtField
        id={`${meta.path}_clean_category_id`}
        type="select"
        clearable={false}
        label="Категория ОДХ"
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted || !options[0]}
        value_string={clean_category_name}
      />
    );
  },
);

export default FieldCleanCategoryId;
