import * as React from 'react';
import { get } from 'lodash';

import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData, getRootRegistry } from 'components/new/ui/registry/module/selectors-registry';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import { registrySelectRow } from 'components/new/ui/registry/module/actions-registy';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

type Props = {
  registryKey: string;
} & WithSearchProps;

const EtsTableSearchParams: React.FC<Props> = React.memo(
  (props) => {
    const { registryKey } = props;
    const dispatch = etsUseDispatch();

    const is_loading = etsUseSelector((state) => getRootRegistry(state.registry, registryKey).isLoading);
    const selected_row_in_params = etsUseSelector((state) => getListData(state.registry, registryKey).meta.selected_row_in_params);
    const uniqKey = etsUseSelector((state) => getListData(state.registry, registryKey).data.uniqKey) as string;
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, registryKey).data.uniqKeyForParams);
    const processedArray = etsUseSelector((state) => getListData(state.registry, registryKey).processed.processedArray);
    const selectedUniqKey = etsUseSelector((state) => get(getListData(state.registry, registryKey), `data.selectedRow.${uniqKey}`));

    const uniqKeyValue = getNumberValueFromSerch(props.match.params[uniqKeyForParams]);
    const uniqKeyValuePrevios = usePrevious(uniqKeyValue);
    const is_loading_prev = usePrevious(is_loading);

    React.useEffect(
      () => {
        if (selected_row_in_params && !is_loading) {
          if (uniqKeyValue) {
            if (selectedUniqKey !== uniqKeyValue) {
              const rowData = processedArray.find(({ [uniqKey]: id }) => id === uniqKeyValue);

              if (rowData) {
                dispatch(registrySelectRow(registryKey, rowData));
              } else {
                props.setParams({ [uniqKeyForParams]: null });
              }
            }
          } else {
            dispatch(registrySelectRow(registryKey, null));
          }
        }
      },
      [
        is_loading,
        is_loading_prev,
        registryKey,
        uniqKey,
        selected_row_in_params,
        selectedUniqKey,
        uniqKeyValue,
        uniqKeyValuePrevios,
        uniqKeyForParams,
        processedArray,
        props.setParams,
      ],
    );

    return null;
  },
);

export default withSearch(EtsTableSearchParams);
