import * as React from 'react';

import {
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import {
  EtsFilterDate,
  EtsFilterTitle,
  EtsFilterInputAdvacedContainer,
  AdvacedFirstLineContainer,
  AdvacedSecondLineContainer,
  AdvacedSelectContainer,
  AdvacedFirstInputContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import InputDate from 'components/new/ui/field/InputDate';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  registryKey: string;
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
    disabled?: boolean;
  };
  formatedTitle: string;
  onChange: (valueKey: string, type: string, value: any) => any;
  time: boolean;
};

const eq = ['eq'];

const optionsType = [
  {
    value: eq,
    label: 'равно',
  },
  {
    value: ['gt'],
    label: 'больше',
  },
  {
    value: ['lt'],
    label: 'меньше',
  },
  {
    value: ['neq'],
    label: 'не равно',
  },
  {
    value: ['gt', 'lt'],
    label: 'диапазон',
  },
];

export const AdvancedDateFilter: React.FC<Props> = React.memo(
  (props) => {
    const filterValuesObj = etsUseSelector((state) => getFilterData(state.registry, props.registryKey).rawFilterValues[props.filterData.valueKey]);

    const [activeTypeArr, setActiveTypeArr] = React.useState(eq);
    const [userChangeFilter, setUserChangeFilter] = React.useState(false); // если пользак изменил поле вручную DITETS19-1340

    const id = `filter_r:${props.registryKey.toLocaleLowerCase()}_p:${props.filterData.valueKey}`;
    const id_select = `${id}_n:select`;
    const id_one = `${id}_n:one`;
    const id_two = `${id}_n:two`;

    const handleChangeType = React.useCallback((valueList) => {
      setUserChangeFilter(true);
      activeTypeArr.forEach((type) => {
        props.onChange(props.filterData.valueKey, type, null);
      });

      const firstFilterValue = filterValuesObj[activeTypeArr[0]].value;

      if (firstFilterValue) {
        props.onChange(props.filterData.valueKey, valueList[0], firstFilterValue);
      }

      setActiveTypeArr(valueList);
    }, [activeTypeArr, props.onChange, props.filterData, filterValuesObj, ]);

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
            const val = value?.value ?? null;
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
      <EtsFilterDate>
        <EtsFilterTitle>{props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputAdvacedContainer>
          <AdvacedFirstLineContainer>
            <AdvacedSelectContainer>
              <ReactSelect
                id={id_select}
                value={activeTypeArr}
                options={optionsType}
                onChange={handleChangeType}
                clearable={false}
                disabled={props.filterData.disabled}
              />
            </AdvacedSelectContainer>
            <AdvacedFirstInputContainer>
              <InputDate
                id={id_one}
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
              Boolean(activeTypeArr[1]) && (
                <InputDate
                  id={id_two}
                  value={filterValuesObj[activeTypeArr[1]].value}
                  onChange={handleChangeSecond}
                  noShowLabel
                  noShowError
                  disabled={props.filterData.disabled}
                  time={props.time}
                />
              )
            }
          </AdvacedSecondLineContainer>
        </EtsFilterInputAdvacedContainer>
      </EtsFilterDate>
    );

  });

export default AdvancedDateFilter;
