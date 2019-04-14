import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectListMapper, defaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { MeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/@types';
import { actionGetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';

type UseTechnicalOperationOptionsAns = {
  technicalOperationOptions: DefaultSelectListMapper<MeasureUnit>,
};

type UseTechnicalOperationOptions = (
  loadTechnicalOperation: HandleThunkActionCreator<typeof actionGetTechnicalOperationRegistry>,
  page: string,
  path: string,
) => UseTechnicalOperationOptionsAns;

const useTechnicalOperationOptions: UseTechnicalOperationOptions = (loadTechnicalOperation, page, path) => {
  const [technicalOperationOptions, setTechnicalOperationOptions] = React.useState<DefaultSelectListMapper<MeasureUnit>>([]);

  React.useEffect(
    () => {
      loadTechnicalOperation({}, { page, path }).then(
        ({ payload: { data } }) => (
          setTechnicalOperationOptions(
            data.map(defaultSelectListMapper),
          )
        ),
      ).catch((error) => {
        console.error(error); //tslint:disable-line
      });
    },
    [],
  );

  return {
    technicalOperationOptions,
  };
};

export default useTechnicalOperationOptions;
