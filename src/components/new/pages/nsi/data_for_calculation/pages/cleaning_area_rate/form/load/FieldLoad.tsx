import * as React from 'react';

import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataMetaByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import { actionGetAndSetInStoreNormsByParams, actionResetNormList } from 'redux-main/reducers/modules/some_uniq/norm_registry/actions';
import { actionGetAndSetInStoreCleanCategories, actionResetCleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/actions';
import { actionUpdateFormErrors } from 'redux-main/reducers/modules/form_data_record/actions';

type Props = {
  formDataKey: 'cleaning_area_rate';
};

const FieldLoad: React.FC<Props> = React.memo(
  (props) => {
    const { formDataKey } = props;

    const meta = etsUseSelector((state) => getFormDataMetaByKey(state, formDataKey));

    const dispatch = etsUseDispatch();
    React.useEffect(
      () => {
        const loadData = async () => {
          dispatch(actionGetAndSetInStoreNormsByParams({ is_cleaning: true, is_cleaning_area: true }, meta));
          dispatch(actionGetAndSetInStoreCleanCategories({}, meta));

          dispatch(actionUpdateFormErrors(props.formDataKey));
        };

        loadData();

        return () => {
          dispatch(actionResetNormList());
          dispatch(actionResetCleanCategories());
        };
      },
      [],
    );

    return null;
  },
);

export default FieldLoad;
