import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import {
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import {
  EtsFilter,
  EtsFilterTitle,
  EtsFilterInputAdvacedContainer,
  AdvacedFirstLineContainer,
  AdvacedSecondLineContainer,
  AdvacedSelectContainer,
  AdvacedFirstInputContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { DivNone } from 'global-styled/global-styled';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';
import InputDate from 'components/new/ui/field/InputDate';
import { createValidDate, createValidDateTime } from 'utils/dates';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { ReduxState } from 'redux-main/@types/state';
import { get } from 'lodash';
import { isArray } from 'util';

type StateProps = {
  filterValuesObj: OneRegistryData['filter']['rawFilterValues'][any];
};
type DispatchProps = {
  dispatch: DispatchProp['dispatch'];
};
type OwnProps = {
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
    disabled?: boolean;
  };
  formatedTitle: string;
  onChange: (valueKey: string, type: string, value: any) => any;
  time: boolean;
}
;
type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

export const AdvancedDateFilter: React.FC<Props> = React.memo(
  (props) => {
    const eq = ['eq'];

    const [activeTypeArr, setActiveTypeArr] = React.useState(eq);
    const [userChangeFilter, setUserChangeFilter] = React.useState(false); // если пользак изменил поле вручную DITETS19-1340

    const optionsType = [
      {
        value: eq.join(','),
        label: '=',
      },
      {
        value: ['gt'].join(','),
        label: '>',
      },
      {
        value: ['lt'].join(','),
        label: '<',
      },
      {
        value: ['neq'].join(','),
        label: '≠',
      },
      {
        value: ['gt', 'lt'].join(','),
        label: '><',
      },
    ];

    const {
      filterValuesObj,
    } = props;

    const id = `filter_${props.filterData.valueKey}`;

    const handleChangeType = React.useCallback((value) => {
      setUserChangeFilter(true);
      const valueList = !isArray(value) ? value.split(',') : value;
      activeTypeArr.forEach((type) => {
        props.onChange(props.filterData.valueKey, type, null);
      });

      const firstFilterValue = props.filterValuesObj[activeTypeArr[0]].value;

      if (firstFilterValue) {
        props.onChange(props.filterData.valueKey, valueList[0], firstFilterValue);
      }

      setActiveTypeArr(valueList);
    }, [activeTypeArr, props.onChange, props.filterData, props.filterValuesObj, ]);

    const handleChange = React.useCallback((value, index) => {
      const { filterData } = props;

      props.onChange(filterData.valueKey, activeTypeArr[index], value);
      setUserChangeFilter(true);
    }, [props.filterData, activeTypeArr, ]);

    const handleChangeFirst = React.useCallback((value) => {
      handleChange(
        value
          ? (
              props.time
              ? createValidDateTime(value)
              : createValidDate(value)
          )
          : null,
        0,
      );
      setUserChangeFilter(true);
    }, [handleChange, props.time, ]);

    const handleChangeSecond = React.useCallback((value) => {
      handleChange(
        value
          ? (
              props.time
              ? createValidDateTime(value)
              : createValidDate(value)
          )
          : null,
        1,
      );
      setUserChangeFilter(true);
    }, [handleChange, props.time, ]);

    React.useEffect(() => {
      if ( !userChangeFilter ) {
        const newActiveTypeArr = Object.entries(filterValuesObj)
        .reduce((newArr, [key, value]) => {
            const val = get(value, 'value', null);
            if (val && val.toString().length) {
              return [...newArr, key];
            }
            return newArr;
        }, []);

        if (newActiveTypeArr.length && activeTypeArr.toString() !== newActiveTypeArr.toString()) {
          handleChangeType(newActiveTypeArr);
        }
      }
    }, [filterValuesObj, ]);

    return (
      <EtsFilter htmlFor={id}>
        <EtsFilterTitle>{props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputAdvacedContainer>
          <AdvacedFirstLineContainer>
            <AdvacedSelectContainer>
              <ReactSelect
                value={activeTypeArr ? activeTypeArr.toString() : activeTypeArr}
                options={optionsType}
                onChange={handleChangeType}
                clearable={false}
                disabled={props.filterData.disabled}
              />
            </AdvacedSelectContainer>
            <AdvacedFirstInputContainer>
              <InputDate
                id={id}
                value={filterValuesObj[activeTypeArr[0]].value}
                onChange={handleChangeFirst}
                noShowLabel
                noShowError
                disabled={props.filterData.disabled}
                time={props.time}
              />
            </AdvacedFirstInputContainer>
          </AdvacedFirstLineContainer>
          <AdvacedSecondLineContainer>
          {
            activeTypeArr.length > 1
            ? (
              <InputDate
                value={filterValuesObj[activeTypeArr[1]].value}
                onChange={handleChangeSecond}
                noShowLabel
                noShowError
                disabled={props.filterData.disabled}
                time={props.time}
              />
            )
            : (
              <DivNone />
            )
          }
          </AdvacedSecondLineContainer>
        </EtsFilterInputAdvacedContainer>
      </EtsFilter>
    );

  });

export default connect<StateProps, DispatchProps, any, ReduxState>(
  (state, { registryKey, filterData }) => ({
    filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
  }),
)(AdvancedDateFilter);
