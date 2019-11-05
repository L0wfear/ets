import * as React from 'react';
import { isArray } from 'util';

import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';
import MultiselectRegistryFilter from 'components/new/ui/registry/components/data/filters/filters-lines/multiselect/MultiselectRegistryFilter';
import {
  EtsFiltersLines,
  EtsFilterContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { registryChangeFilterRawValues } from 'components/new/ui/registry/module/actions-registy';
import AdvancedNumberFilter from 'components/new/ui/registry/components/data/filters/filters-lines/advanced-number/AdvancedNumberFilter';
import { getSessionState } from 'redux-main/reducers/selectors';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import AdvancedDateFilter from './advanced-date/AdvancedDateFilter';
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import AdvancedStringLikeFilter from './advanced-string-like/AdvancedStringLikeFilter';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import AdvancedSelectLikeFilter from './advanced-select-like/AdvancedSelectLikeFilter';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {
  needUpdateFiltersOptions: boolean;
  registryKey: string;
};

type Props = (
  OwnProps
  & WithSearchProps
);

const FiltersLines: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const STRUCTURES = etsUseSelector((state) => getSessionStructuresOptions(state));
    const userData = etsUseSelector((state) => getSessionState(state).userData);
    const fileds = etsUseSelector((state) => getFilterData(state.registry, props.registryKey).fields);

    const handleChange = React.useCallback(
      (valueKey, type, value) => {
        dispatch(registryChangeFilterRawValues(props.registryKey, valueKey, type, value));
      },
      [],
    );

    const fieldMap = React.useCallback(
      ({ type, ...otherFilterData }) => {
        let formatedTitle = otherFilterData.title;

        if (isArray(otherFilterData.title)) {
          formatedTitle = otherFilterData.title.reduce((filtredTitle, titleSomeValue) => {
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

        switch (type) {
          case 'multiselect': {
            return (
              <EtsFilterContainer key={otherFilterData.valueKey}>
                <MultiselectRegistryFilter
                  formatedTitle={formatedTitle}
                  filterData={otherFilterData}
                  needUpdateFiltersOptions={props.needUpdateFiltersOptions}
                  registryKey={props.registryKey}
                  onChange={handleChange}
                />
              </EtsFilterContainer>
            );
          }
          case 'advanced-select-like': {
            return (
              <EtsFilterContainer key={otherFilterData.valueKey}>
                <AdvancedSelectLikeFilter
                  formatedTitle={formatedTitle}
                  filterData={otherFilterData}
                  needUpdateFiltersOptions={props.needUpdateFiltersOptions}
                  registryKey={props.registryKey}
                  onChange={handleChange}
                />
              </EtsFilterContainer>
            );
          }
          case 'advanced-number': {
            return (
              <EtsFilterContainer key={otherFilterData.valueKey}>
                <AdvancedNumberFilter
                  formatedTitle={formatedTitle}
                  filterData={otherFilterData}
                  registryKey={props.registryKey}
                  onChange={handleChange}
                />
              </EtsFilterContainer>
            );
          }
          case 'advanced-datetime':
          case 'advanced-date': {
            return (
              <EtsFilterContainer key={otherFilterData.valueKey}>
                <AdvancedDateFilter
                  formatedTitle={formatedTitle}
                  filterData={otherFilterData}
                  registryKey={props.registryKey}
                  onChange={handleChange}
                  time={type === 'advanced-datetime'}
                />
              </EtsFilterContainer>
            );
          }
          case 'advanced-string-like': {
            return (
              <EtsFilterContainer key={otherFilterData.valueKey}>
                <AdvancedStringLikeFilter
                  formatedTitle={formatedTitle}
                  filterData={otherFilterData}
                  registryKey={props.registryKey}
                  onChange={handleChange}
                />
              </EtsFilterContainer>
            );
          }
          default: return (
            <EtsFilterContainer key={otherFilterData.valueKey}>
              {`not found filter with type ${type}`}
            </EtsFilterContainer>

          );
        }
      },
      [userData, STRUCTURES, props.needUpdateFiltersOptions],
    );

    return (
      <EtsFiltersLines>
        { fileds.map(fieldMap) }
      </EtsFiltersLines>
    );
  },
);

export default withSearch<OwnProps>(FiltersLines);
