import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { registrySetRowIsOpen } from 'components/new/ui/registry/module/actions-registy';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import * as React from 'react';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { WithFormRegistrySearchAddPropsWithoutWithSerach } from './withFormRegistrySearch';
//import { WithFormRegistrySearchAddPropsWithoutWithSerach } from './withFormRegistrySearch';
type OwnProps = {
  registryKey: string;
  page: string;
  path?: string;
};

const withFormRegistryWithoutWithSearch = <F extends any> (
  Component: React.ComponentType<WithFormRegistrySearchAddPropsWithoutWithSerach<F>>
): React.FC<OwnProps> =>
    React.memo(({registryKey, page, path = ''}) => {
      const [element, setElement] = React.useState(null),
        dispatch = etsUseDispatch(),
        array = etsUseSelector((state) => getListData(getRegistryState(state), registryKey).data.array),
        isOpen = etsUseSelector((state) => getListData(getRegistryState(state), registryKey).data.isOpen),
        selected_row = etsUseSelector((state) => getListData(getRegistryState(state), registryKey).data.selectedRow),
        uniqKey = etsUseSelector((state) => getListData(getRegistryState(state), registryKey).data.uniqKey),
        uniqKeyType = etsUseSelector((state) => getListData(getRegistryState(state), registryKey).data.uniqKeyType),
        handleHide = React.useCallback(() => {
          dispatch(registrySetRowIsOpen(registryKey, false));
          setElement(null);
        }, []);

      React.useEffect(() => {
        if (array && isOpen) {
          const param_uniq_key
            = uniqKeyType === 'number' ? Number(uniqKey) : String(uniqKey),
            element = array.find(
              (el) => el[param_uniq_key] === selected_row[param_uniq_key]
            );

          setElement(element);
        }
      }, [array, isOpen, selected_row, uniqKey, uniqKeyType]);

      return (
        <Component
          registryKey={registryKey}
          page={page}
          path={path}
          element={element}
          handleHide={handleHide}
        />
      );
    });

export default withFormRegistryWithoutWithSearch;
