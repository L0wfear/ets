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
import InputNumber from 'components/new/ui/field/InputNumber';
import { DivNone } from 'global-styled/global-styled';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import { ReduxState } from 'redux-main/@types/state';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { get } from 'lodash';
import { isArray } from 'util';

type StateProps = {
  filterValuesObj: OneRegistryData['filter']['rawFilterValues'][any];
};
type DispatchProps = {
  dispatch: DispatchProp['dispatch'];
};
type OwnProps = {
  registryKey: string;
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
    disabled?: boolean;
    step: number;
  };
  formatedTitle: string;
  onChange: (valueKey: string, type: string, value: any) => any;
};
type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

export const AdvancedNumberFilter: React.FC<Props> = React.memo(
  (props) => {

    const eq = ['eq'];

    const id = `filter_r:${props.registryKey.toLocaleLowerCase()}_p:${props.filterData.valueKey}`;
    const id_select = `${id}_n:select`;
    const id_one = `${id}_n:one`;
    const id_two = `${id}_n:two`;
    const [activeTypeArr, setActiveTypeArr] = React.useState(eq);
    const [userChangeFilter, setUserChangeFilter] = React.useState(false); // если пользак изменил поле вручную DITETS19-1340

    const optionsType = [
      {
        value: eq.join(','),
        label: 'равно',
      },
      {
        value: ['gt'].join(','),
        label: 'больше',
      },
      {
        value: ['lt'].join(','),
        label: 'меньше',
      },
      {
        value: ['neq'].join(','),
        label: 'не равно',
      },
      {
        value: ['gt', 'lt'].join(','),
        label: 'диапазон',
      },
    ];

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
      const valueAsNumber = Number(value);
      setUserChangeFilter(true);
      props.onChange(filterData.valueKey, activeTypeArr[index], value !== '' ? valueAsNumber : '');
    }, [props.filterData, activeTypeArr, ]);

    const handleChangeFirst = React.useCallback(({ currentTarget: { value }}) => {
      handleChange(value, 0);
    }, [handleChange]);

    const handleChangeSecond = React.useCallback(({ currentTarget: { value }}) => {
      handleChange(value, 1);
    }, [handleChange]);

    React.useEffect(() => {
      if ( !userChangeFilter ) {
        const newActiveTypeArr = Object.entries(props.filterValuesObj)
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
    }, [props.filterValuesObj, ]);

    return (
      <EtsFilter>
        <EtsFilterTitle>{props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputAdvacedContainer>
          <AdvacedFirstLineContainer>
            <AdvacedSelectContainer>
              <ReactSelect
                id={id_select}
                value={activeTypeArr ? activeTypeArr.toString() : activeTypeArr}
                options={optionsType}
                onChange={handleChangeType}
                clearable={false}
                disabled={props.filterData.disabled}
              />
            </AdvacedSelectContainer>
            <AdvacedFirstInputContainer>
              <InputNumber
                id={id_one}
                value={props.filterValuesObj[activeTypeArr[0]].value}
                onChange={handleChangeFirst}
                noShowLabel
                noShowError
                disabled={props.filterData.disabled}
                step={props.filterData.step}
              />
            </AdvacedFirstInputContainer>
          </AdvacedFirstLineContainer>
          <AdvacedSecondLineContainer>
            {
              activeTypeArr.length > 1
                ? (
                  <InputNumber
                    id={id_two}
                    value={props.filterValuesObj[activeTypeArr[1]].value}
                    onChange={handleChangeSecond}
                    noShowLabel
                    noShowError
                    disabled={props.filterData.disabled}
                    step={props.filterData.step}
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
  },
);

export default connect<StateProps, DispatchProps, any, ReduxState>(
  (state, { registryKey, filterData }) => ({
    filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
  }),
)(AdvancedNumberFilter);
