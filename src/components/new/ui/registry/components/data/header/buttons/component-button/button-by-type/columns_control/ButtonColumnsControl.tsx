import * as React from 'react';
import * as ClickOutHandler from 'react-onclickout';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ColumnsPopup from './column_popup/ColumnsPopup';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { actionChangeRegistryMetaFields, setUserColumnsSettingsThunk } from 'components/new/ui/registry/module/actions-registy';
import { get } from 'lodash';

type Props = CommonTypesForButton & {};

const ButtonColumnsControl: React.FC<Props> = React.memo(
  (props) => {
    const [showConfigPopup, setShowConfigPopup] = React.useState(false);
    const hasHiddenField = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).meta.fields.some(({ hidden }) => hidden));
    const [needUpdateLocalStorageFilters, setNeedUpdateLocalStorageFilters] = React.useState(false);
    const fields = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).meta.fields);
    const dispatch = etsUseDispatch();
    
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

    const setLocalStorageData = React.useCallback(
      (data) => {
        const columnContorolData = JSON.parse(localStorage.getItem(`columnContorol`));
        const newData = data.map((el) => ({key: el.key, hidden: !!el.hidden}));
        localStorage.setItem('columnContorol', JSON.stringify({...columnContorolData, [props.registryKey]: newData}));
      }, [props.registryKey]);

    React.useEffect(() => {
      (async () => {
        if (needUpdateLocalStorageFilters) {
          try {
            await dispatch(setUserColumnsSettingsThunk(props.registryKey, fields));
            setLocalStorageData(fields);
          } catch (error) {
            const localStorageFields = get(JSON.parse(localStorage.getItem(`columnContorol`)), props.registryKey, []);
            const fieldsData = localStorageFields.length 
              ? localStorageFields
              : fields.map((el) => ({...el, hidden: false}));
            dispatch(actionChangeRegistryMetaFields(
              props.registryKey,
              fieldsData,
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
              <ColumnsPopup 
                registryKey={props.registryKey}
                setNeedUpdateLocalStorageFilters={setNeedUpdateLocalStorageFilters}
              />
            )
        }
      </ClickOutHandler>
    );
  },
);

export default ButtonColumnsControl;
