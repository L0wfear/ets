import * as React from 'react';
import { HandleThunkActionCreator } from 'react-redux';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { RefillType } from 'redux-main/reducers/modules/refill_type/@types/refillType';
import { actionLoadRefillType } from 'redux-main/reducers/modules/refill_type/actions_refill_type';

type UseRefillTypeOptionsAns = DefaultSelectListMapper<RefillType>;

type UseRefillTypeOptions = (
  loadAction: HandleThunkActionCreator<typeof actionLoadRefillType>,
  page: string,
  path?: string,
) => UseRefillTypeOptionsAns;

const useRefillTypeOptions: UseRefillTypeOptions = (loadAction, page, path) => {
  const [options, setOptions] = React.useState<UseRefillTypeOptionsAns>([]);

  React.useEffect(
    () => {
      loadAction({}, { page, path }).then(
        (refillTypeList) => (
          setOptions(
            refillTypeList.map((rowData) => ({
              value: rowData.id,
              label: rowData.name,
              isDisabled: !rowData.is_selectable,
              rowData,
            })),
          )
        ),
      ).catch((error) => {
        console.error(error); // tslint:disable-line
      });
    },
    [],
  );

  return options;
};

export default useRefillTypeOptions;
