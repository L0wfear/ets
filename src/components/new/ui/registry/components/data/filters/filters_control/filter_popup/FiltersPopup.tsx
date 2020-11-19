import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ColumnPopupContainer, ColumnPopupContainerWrapper } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/columns_control/column_popup/@styled';
import { ReduxState } from 'redux-main/@types/state';
import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState, getSessionState } from 'redux-main/reducers/selectors';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ControlItem from './ControlItem';
import { actionChangeRegistryFilterFields } from 'components/new/ui/registry/module/actions-registy';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { isArray } from 'util';

type ColumnsPopupStateProps = {
  fields: OneRegistryData['filter']['fields'];
};
type ColumnsPopupDispatchProps = {
  actionChangeRegistryFilterFields: HandleThunkActionCreator<typeof actionChangeRegistryFilterFields>;
};
type ColumnsPopupOwnProps = {
  registryKey: string;
};
type ColumnsPopupMergedProps = (
  ColumnsPopupStateProps
  & ColumnsPopupDispatchProps
  & ColumnsPopupOwnProps
);
type ColumnsPopupProps = ColumnsPopupMergedProps;

const ColumnsPopup: React.FC<ColumnsPopupProps> = (props) => {
  const STRUCTURES = etsUseSelector((state) => getSessionStructuresOptions(state));
  const userData = etsUseSelector((state) => getSessionState(state).userData);
  
  const handleChange = React.useCallback(
    (field) => {
      props.actionChangeRegistryFilterFields(
        props.registryKey,
        field,
      );
    },
    [props.registryKey, props.fields],
  );

  const fieldMap = React.useCallback(
    ({...fieldData }) => {
      let formatedTitle = fieldData.title;

      if (isArray(fieldData.title)) {
        formatedTitle = fieldData.title.reduce((filtredTitle, titleSomeValue) => {
          const { displayIf } = titleSomeValue;
          if (displayIf === displayIfContant.isKgh && userData.isKgh) {
            return titleSomeValue.title;
          }
          if (displayIf === displayIfContant.isOkrug && userData.isOkrug) {
            return titleSomeValue.title;
          }

          if (displayIf === displayIfContant.lenghtStructureMoreOne && STRUCTURES.length) {
            return titleSomeValue.title;
          }

          return filtredTitle;
        }, null);
      }
      if (!formatedTitle) {
        return null;
      }
      return (
        <ControlItem
          key={fieldData.valueKey}
          fieldData={fieldData}
          onChange={handleChange}
        />
      );  

    },
    [userData, STRUCTURES],
  );

  return (
    <ColumnPopupContainerWrapper>
      <ColumnPopupContainer>
        {
          props.fields.map(fieldMap)
        }
      </ColumnPopupContainer>
    </ColumnPopupContainerWrapper>
  );
};

export default connect<ColumnsPopupStateProps, ColumnsPopupDispatchProps, ColumnsPopupOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    fields: getFilterData(getRegistryState(state), registryKey).fields,
  }),
  (dispatch: any) => ({
    actionChangeRegistryFilterFields: (registryKey, hiddenFields) => (
      dispatch(
        actionChangeRegistryFilterFields(registryKey, hiddenFields),
      )
    ),
  }),
)(ColumnsPopup);
