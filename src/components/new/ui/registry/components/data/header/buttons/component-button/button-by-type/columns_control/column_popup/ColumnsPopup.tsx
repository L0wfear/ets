import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ColumnPopupContainer, ColumnPopupContainerWrapper } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/columns_control/column_popup/@styled';
import { ReduxState } from 'redux-main/@types/state';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ControlItem from './ControlItem';
import { actionChangeRegistryMetaFields } from 'components/new/ui/registry/module/actions-registy';
import ExtField from 'components/@next/@ui/renderFields/Field';

type ColumnsPopupStateProps = {
  fields: OneRegistryData['list']['meta']['fields'];
};
type ColumnsPopupDispatchProps = {
  actionChangeRegistryMetaFields: HandleThunkActionCreator<typeof actionChangeRegistryMetaFields>;
};
type ColumnsPopupOwnProps = {
  registryKey: string;
  setNeedUpdateLocalStorageFilters: React.Dispatch<React.SetStateAction<boolean>>;
};
type ColumnsPopupMergedProps = (
  ColumnsPopupStateProps
  & ColumnsPopupDispatchProps
  & ColumnsPopupOwnProps
);
type ColumnsPopupProps = ColumnsPopupMergedProps;

const ColumnsPopup: React.FC<ColumnsPopupProps> = (props) => {
  const [selectAllChecked, setSelectAllChecked] = React.useState(true);

  const handleChange = React.useCallback(
    (field) => {
      props.actionChangeRegistryMetaFields(
        props.registryKey,
        props.fields.map((fieldData) => {
          if ('key' in fieldData && fieldData.key === field.key) {
            return field;
          }

          return fieldData;
        }),
      );
    },
    [props.registryKey, props.fields],
  );

  const handleChangeSelectAll = React.useCallback(
    () => {
      setSelectAllChecked(!selectAllChecked);
      const fields = props.fields.map((fieldData) => ({
        ...fieldData,
        hidden: selectAllChecked,
      }));
      props.actionChangeRegistryMetaFields(
        props.registryKey,
        fields,
      );
    },
    [selectAllChecked, props.fields],
  );

  React.useEffect(() => {
    if (selectAllChecked) {
      setSelectAllChecked(props.fields.filter((el) => el.hidden === true).length === 0);
    }
  }, [props.fields, selectAllChecked]);

  React.useEffect(() => {
    return () => props.setNeedUpdateLocalStorageFilters(true);
  }, []);

  return (
    <ColumnPopupContainerWrapper>
      <ColumnPopupContainer>
        <ExtField
          type="boolean"
          label={'Выделить всё'}
          onChange={handleChangeSelectAll}
          value={selectAllChecked}
          className="checkbox-input flex-reverse"
        />
        {
          props.fields.reduce(
            (newArr, fieldData, index) => {
              if ('key' in fieldData && fieldData.key !== 'checkbox' && fieldData.key !== 'enumerated') {
                newArr.push(
                  <ControlItem
                    key={fieldData.key.toString()}
                    fieldData={fieldData}

                    onChange={handleChange}
                  />,
                );
              }
              return newArr;
            },
            [],
          )
        }
      </ColumnPopupContainer>
    </ColumnPopupContainerWrapper>
  );
};

export default connect<ColumnsPopupStateProps, ColumnsPopupDispatchProps, ColumnsPopupOwnProps, ReduxState>(
  (state, { registryKey }) => ({
    fields: getListData(getRegistryState(state), registryKey).meta.fields,
  }),
  (dispatch: any) => ({
    actionChangeRegistryMetaFields: (...arg) => (
      dispatch(
        actionChangeRegistryMetaFields(...arg),
      )
    ),
  }),
)(ColumnsPopup);
