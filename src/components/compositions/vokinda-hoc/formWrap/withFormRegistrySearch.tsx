import * as React from 'react';
import { connect } from 'react-redux';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { getListData, getServiceData } from 'components/new/ui/registry/module/selectors-registry';
import { registryResetSelectedRowToShowInForm, registryLoadOneData } from 'components/new/ui/registry/module/actions-registy';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { isNullOrUndefined } from 'util';
import { DivNone } from 'global-styled/global-styled';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

let lasPermissions = {};
let lastPermissionsArray = [];

const getPermissionsCreateReadUpdate = (permission) => {
  if (lasPermissions !== permission) {
    lasPermissions = permission;

    lastPermissionsArray = [permission.create, permission.read, permission.update];
  }

  return lastPermissionsArray;
};

export const withFormRegistrySearch = (Component) => (
  compose<any, any>(
    connect<any, any, { registryKey: string }, any, ReduxState>(
      (state, { registryKey }) => ({
        getOneData: getServiceData(state.registry, registryKey).getOneData,
        array: getListData(state.registry, registryKey).data.array,
        uniqKey: getListData(state.registry, registryKey).data.uniqKey,
        permissions: getPermissionsCreateReadUpdate(getListData(state.registry, registryKey).permissions), //  прокидывается в следующий компонент
      }),
      (dispatch: any) => ({
        registryResetSelectedRowToShowInForm: (...arg) => (
          dispatch(
            registryResetSelectedRowToShowInForm(
              ...arg,
            ),
          )
        ),
        registryLoadOneData: (...arg) => (
          dispatch(
            registryLoadOneData(
              ...arg,
            ),
          )
        ),
      }),
      null,
      {
        pure: false,
      },
    ),
    withSearch,
    withRequirePermissionsNew(),
  )(
    ({ registryResetSelectedRowToShowInForm: registryResetSelectedRowToShowInFormProps, array, uniqKey, ...props}) => {
      const [element, setElement] = React.useState(null);
      const uniqKeyValue = getNumberValueFromSerch(props.params[uniqKey]);

      React.useEffect(
        () => {
          if (!isNullOrUndefined(uniqKeyValue) && array.length) {
            const newElement = array.find((item) => item[uniqKey] === uniqKeyValue);
            if (newElement) {
              setElement(newElement);
              return;
            }

            if (props.getOneData) {
              props.registryLoadOneData(props.registryKey, uniqKeyValue).then((responseElement) => {
                if (responseElement) {
                  setElement(responseElement);
                } else {
                  handleHide(false);
                }
              });
            } else {
              handleHide(false);
            }
          } else if (element) {
            setElement(null);
          }
        },
        [uniqKeyValue, array],
      );
      const handleHide = React.useCallback(
        (isSubmitted: boolean, response?: any) => {
          registryResetSelectedRowToShowInFormProps(props.registryKey, isSubmitted, response);

          props.setParams({
            [uniqKey]: null,
          });
        },
        [uniqKey],
      );

      return element
        ? (
          <Component
            {...props}
            element={element}
            onFormHide={handleHide}
          />
        )
        : (
          <DivNone />
        );
    },
  )
);

export default withFormRegistrySearch;
