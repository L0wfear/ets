import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ColumnPopupContainer } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/columns_control/column_popup/@styled';
import { ReduxState } from 'redux-main/@types/state';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import ControlItem from './ControlItem';
import { actionChangeRegistryMetaFields } from 'components/new/ui/registry/module/actions-registy';
import { get } from 'lodash';

type ColumnsPopupStateProps = {
  fields: OneRegistryData['list']['meta']['fields'];
};
type ColumnsPopupDispatchProps = {
  actionChangeRegistryMetaFields: HandleThunkActionCreator<typeof actionChangeRegistryMetaFields>;
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
  const handleChange = React.useCallback(
    (field) => {
      const newField = props.fields.map((fieldData) => {
        if ('key' in fieldData && fieldData.key === field.key) {
          return field;
        }

        return fieldData;
      });

      const columnContorolData = localStorage.getItem(`columnContorol`);
      const currentRegistryData = get(columnContorolData, props.registryKey, {});
      currentRegistryData[props.registryKey] = newField.map((fieldData) => {
        return {
          key: fieldData.key,
          hidden: Boolean(fieldData.hidden),
        };
      });
      localStorage.setItem('columnContorol', JSON.stringify(currentRegistryData));

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

  return (
    <ColumnPopupContainer>
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
