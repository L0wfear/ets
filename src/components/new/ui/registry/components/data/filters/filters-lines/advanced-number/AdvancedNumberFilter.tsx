import * as React from 'react';

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
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
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

export const AdvancedNumberFilter: React.FC<Props> = React.memo(
  (props) => {
    const filterValuesObj = etsUseSelector((state) => getFilterData(state.registry, props.registryKey).rawFilterValues[props.filterData.valueKey]);

    const id = `filter_r:${props.registryKey.toLocaleLowerCase()}_p:${props.filterData.valueKey}`;
    const id_select = `${id}_n:select`;
    const id_one = `${id}_n:one`;
    const id_two = `${id}_n:two`;
    const [activeTypeArr, setActiveTypeArr] = React.useState(eq);
    const [userChangeFilter, setUserChangeFilter] = React.useState(false); // если пользак изменил поле вручную DITETS19-1340

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
      <EtsFilter>
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
              <InputNumber
                id={id_one}
                value={filterValuesObj[activeTypeArr[0]].value}
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
              Boolean(activeTypeArr[1]) && (
                <InputNumber
                  id={id_two}
                  value={filterValuesObj[activeTypeArr[1]].value}
                  onChange={handleChangeSecond}
                  noShowLabel
                  noShowError
                  disabled={props.filterData.disabled}
                  step={props.filterData.step}
                />
              )
            }
          </AdvacedSecondLineContainer>
        </EtsFilterInputAdvacedContainer>
      </EtsFilter>
    );
  },
);

export default AdvancedNumberFilter;
