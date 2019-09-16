import * as React from 'react';

import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionInitialFormByKey, actionRemoveFormData } from 'redux-main/reducers/modules/form_data_record/actions';
import { getFormDataByKey } from 'redux-main/reducers/modules/form_data_record/selectors';

const useForm = <F>(formKey: FormKeys, props: WithFormRegistrySearchAddProps<F>) => {
  const dispatch = etsUseDispatch();

  React.useEffect(
    () => {
      if (props.element) {
        dispatch(
          actionInitialFormByKey(
            formKey,
            props.element,
            props.meta || {
              page: props.page,
              path: props.path,
            },
          ),
        );
      }
      return () => dispatch(actionRemoveFormData(formKey));
    },
    [formKey, props.element, props.meta],
  );

  const handleHide = React.useCallback(
    (isSubmitted: any, result?: any) => {
      props.handleHide(isSubmitted, result);
    },
    [props.handleHide],
  );

  const hasData = etsUseSelector((state) => Boolean(getFormDataByKey(state, formKey)));
  const value = React.useMemo(
    () => ({
      hasData,
      handleHide,
    }),
    [handleHide, hasData],
  );

  return value;
};

export default useForm;
