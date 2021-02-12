import * as React from 'react';
import * as ClickOutHandler from 'react-onclickout';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import FiltersPopup from './filter_popup/FiltersPopup';
import { getFilterData, getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionChangeRegistryFilterFields, setUserFiltersSettingsThunk } from 'components/new/ui/registry/module/actions-registy';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type Props = CommonTypesForButton & {};

const ButtonFiltersControl: React.FC<Props> = React.memo(
  (props) => {
    const [showConfigPopup, setShowConfigPopup] = React.useState(false);
    const hasHiddenField = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).meta.fields.some(({ hidden }) => hidden));
    const fields = etsUseSelector((state) => getFilterData(getRegistryState(state), props.registryKey).fields);
    const [needUpdateLocalStorageFilters, setNeedUpdateLocalStorageFilters] = React.useState(false);
    const dispatch = etsUseDispatch();

    const setLocalStorageData = React.useCallback(
      (data) => {
        const filterFields = JSON.parse(localStorage.getItem(`filterFields`));
        const newData = data.map((el) => ({valueKey: el.valueKey, hidden: !!el.hidden}));
        localStorage.setItem('filterFields', JSON.stringify({...filterFields, [props.registryKey]: newData}));
      }, [props.registryKey]);
  
    const toggleShowPopup = React.useCallback(
      () => {
        setShowConfigPopup(!showConfigPopup);
      },
      [showConfigPopup],
    );
    const closePopup = React.useCallback(
      () => {
        setShowConfigPopup(false);
      },
      [],
    );

    React.useEffect(() => {
      (async () => {
        if (needUpdateLocalStorageFilters) {
          try {
            setLocalStorageData(fields);
            await dispatch(setUserFiltersSettingsThunk(props.registryKey));
          } catch (error) {
            dispatch(actionChangeRegistryFilterFields(
              props.registryKey,
              'getFromLocalStorage',
            ));
            global.NOTIFICATION_SYSTEM.notify(error.message, 'error', 'tr');
          } finally {
            setNeedUpdateLocalStorageFilters(false);
          }
        }
      })();
    }, [needUpdateLocalStorageFilters]);

    return (
      <ClickOutHandler onClickOut={closePopup}>
        <EtsBootstrap.Button bsSize="small" active={showConfigPopup || hasHiddenField} onClick={toggleShowPopup}>
          <EtsBootstrap.Glyphicon glyph="cog" />
        </EtsBootstrap.Button>
        {
          showConfigPopup
            && (
              <FiltersPopup 
                registryKey={props.registryKey}
                setNeedUpdateLocalStorageFilters={setNeedUpdateLocalStorageFilters}
              />
            )
        }
      </ClickOutHandler>
    );
  },
);

export default ButtonFiltersControl;
