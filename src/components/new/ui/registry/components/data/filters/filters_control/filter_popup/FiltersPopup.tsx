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
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { applyFilterFromRaw } from 'components/new/ui/registry/module/utils/filter';
import ExtField from 'components/@next/@ui/renderFields/Field';

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
type ColumnsPopupProps = ColumnsPopupMergedProps & WithSearchProps;

const ColumnsPopup: React.FC<ColumnsPopupProps> = (props) => {
  const STRUCTURES = etsUseSelector((state) => getSessionStructuresOptions(state));
  const userData = etsUseSelector((state) => getSessionState(state).userData);
  const [hiddenFilters, setHiddenFilters] = React.useState([]);
  const [selectAllChecked, setselectAllChecked] = React.useState(true);

  const setLocalStorageData = React.useCallback(
    (data) => {
      const filterFields = JSON.parse(localStorage.getItem(`filterFields`));
      localStorage.setItem('filterFields', JSON.stringify({...filterFields, [props.registryKey]: data}));
    }, [props.registryKey]);

  const handleChange = React.useCallback(
    async (key, locationSearch) => {
      const filterKey = `${props.registryKey}_filters`;
      const filterData = await props.actionChangeRegistryFilterFields(
        props.registryKey,
        key,
      );
      const field = filterData.payload.filter.fields.find((el) => el.valueKey === key);
      if (field.hidden) {
        setHiddenFilters([...hiddenFilters].concat(key));
      } else {
        setHiddenFilters(hiddenFilters.filter((el) => el !== key));
      }
      if (locationSearch.includes(key)) {
        props.setDataInSearch({
          [filterKey]: encodeURIComponent(JSON.stringify(applyFilterFromRaw(filterData.payload.filter.rawFilterValues))),
        });
      }
    },
    [props.registryKey, props.fields, hiddenFilters],
  );

  const handleChangeSelectAll = React.useCallback(
    () => {
      setselectAllChecked(!selectAllChecked);
      props.actionChangeRegistryFilterFields(
        props.registryKey,
        'selectAll',
        selectAllChecked
      );
      setHiddenFilters([]);
    },
    [selectAllChecked],
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
    [userData, STRUCTURES, handleChange],
  );

  React.useEffect(() => {
    const hiddenFilters = props.fields.reduce((acc, curr) => {
      if (curr.hidden) {
        acc.push(curr.valueKey);
      }
      return acc;
    }, []);
    setHiddenFilters(hiddenFilters);
  }, []);

  React.useEffect(() => {
    if (selectAllChecked) {
      setselectAllChecked(hiddenFilters.length === 0);
    }
  }, [hiddenFilters, selectAllChecked]);

  React.useEffect(() => {
    setLocalStorageData(props.fields);
  }, [props.fields]);

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
          props.fields.map(fieldMap)
        }
      </ColumnPopupContainer>
    </ColumnPopupContainerWrapper>
  );
};

export default compose<ColumnsPopupStateProps, ColumnsPopupOwnProps>(
  connect<ColumnsPopupStateProps, ColumnsPopupDispatchProps, ColumnsPopupOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      fields: getFilterData(getRegistryState(state), registryKey).fields,
    }),
    (dispatch: any) => ({
      actionChangeRegistryFilterFields: (registryKey, hiddenFields, selectAll) => (
        dispatch(
          actionChangeRegistryFilterFields(registryKey, hiddenFields, selectAll),
        )
      ),
    }),
  ),
  withSearch,
)(ColumnsPopup);
