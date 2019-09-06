import * as React from 'react';

import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionInitialForm, OneFormDataByKeyForAdd } from 'redux-main/reducers/modules/form_data_record/actions';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { getFormDataByKey } from 'redux-main/reducers/modules/form_data_record/selectors';

import FormContext from 'components/@next/@form/hook/FormContext';

const withFormContext = <OwnProps extends LoadingMeta, F extends Record<string, any>, Store extends object>(funcCreateFormData: (props: OwnProps) => OneFormDataByKeyForAdd<F, Store>) => {
  const Form: React.FC<OwnProps> = React.memo(
    (props) => {
      const dispatch = etsUseDispatch();

      const formData = React.useMemo(
        () => {
          return funcCreateFormData(props);
        },
        [props],
      );

      React.useEffect(
        () => {
          dispatch(
            actionInitialForm(
              formData,
              props.element,
              props,
            ),
          );
        },
        [formData],
      );

      const hasData = etsUseSelector((state) => Boolean(getFormDataByKey(state, formData.key)));

      return hasData && (
        <FormContext formDataKey={formData.key} />
      );
    },
  );

  return Form;
};

export default withFormContext;
