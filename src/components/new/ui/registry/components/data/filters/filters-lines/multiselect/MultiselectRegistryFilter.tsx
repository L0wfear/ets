import * as React from 'react';
import { connect } from 'react-redux';
import { isNumber, isBoolean, isArray, isObject, isNull } from 'util';
import { get, uniqBy } from 'lodash';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';

import {
  getListData,
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import {
  EtsFilter,
  EtsFilterTitle,
  EtsFilterInputContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import { getJSON } from 'api/adapter';
import configStand from 'config';
import { actionFetchWithCount } from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const cache: Record<string, Promise<any>> = {};

type PropsMultiselectRegistryFilter = {
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string | number;
    options?: any;
    registry_type?: string;
    disabled?: boolean;
    getRegistryData: any;
    format?: string;
    makeOptionsFromSessionData?: {
      groupName: string;
      valueKey: string;
      labelKey: string;
    };
  };
  registryKey: string;
  needUpdateFiltersOptions: boolean;
  formatedTitle: string;
  filterValuesObj: any;
  array: Array<any>;
  total_count: number;
  onChange: (valueKey: string, type: string, value: Array<any>, option: object) => any;
  session: any;
  inspectionConfig: any;
  dispatch: EtsDispatch;
  cache: Record<string, any>;
  setCache: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

type StateMultiselectRegistryFilter = {
  total_count: number;
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string | number;
    options?: any;
    disabled?: boolean;
    getRegistryData: any;
    format?: string;
  };
  options: Array<any>;
  disabled: boolean;
  isLoading: boolean;
};

export const employeeFIOLabelFunction = (employeeData, fullFlag = false) => {
  if (!employeeData) {
    return '';
  }
  let result = `${employeeData.last_name} `;

  if (fullFlag) {
    result = `${result}${employeeData.first_name || ''} ${employeeData.middle_name || ''}`;
  } else {
    if (employeeData.first_name && employeeData.first_name[0]) {
      result = `${result}${employeeData.first_name[0]}.`;
    }
    if (employeeData.middle_name && employeeData.middle_name[0]) {
      result = `${result}${employeeData.middle_name[0]}.`;
    }
  }

  return result;
};

const getLabel = (label, rowData, format) => {
  if (!format) {
    return label;
  }

  if (format === 'short_employee_name') {
    return employeeFIOLabelFunction(rowData);
  }

  if (format === 'work_mode_label') {
    return `${rowData.name} (${rowData.start_time_text} - ${rowData.end_time_text})`;
  }

  return 'no_define_format';
};

const getOption = (value, label) => {
  if ((value || isNumber(value) || isBoolean(value)) && (label || isNumber(label))) {
    return { value, label };
  }
  return null;
};

const makeOptionsFromArray = (array: Array<any>, valueKey: string | number, labelKey: string | number, format: string) => (
  array.reduce<Array<any>>((newArr, rowData) => {
    const { [valueKey]: value, [labelKey || valueKey]: label } = rowData;

    if (isArray(value)) {
      value.forEach((oneValue) => {
        let valueOfOption = oneValue;
        let labelOfOption = oneValue;

        if (isObject(oneValue)) {
          if ('id' in oneValue && 'name' in oneValue) {
            valueOfOption = oneValue.id;
            labelOfOption = oneValue.name;
          }
        }

        const newItem = getOption(valueOfOption, labelOfOption);
        if (newItem) {
          newArr.push(newItem);
        }
      });
    } else {

      const newItem = getOption(value, getLabel(label, rowData, format));
      if (newItem) {
        newArr.push(newItem);
      }
    }

    return newArr;
  }, [])
);

const makeOptions = (props: PropsMultiselectRegistryFilter) => {
  if (props.filterData.makeOptionsFromSessionData && props.session.userData) {
    const groupName = get(
      props.filterData.makeOptionsFromSessionData,
      'groupName'
    );
    const valueKey = get(
      props.filterData.makeOptionsFromSessionData,
      'valueKey'
    );
    const labelKey = get(
      props.filterData.makeOptionsFromSessionData,
      'labelKey'
    );

    return uniqBy(
      makeOptionsFromArray(
        props.session.userData[groupName],
        valueKey,
        labelKey,
        props.filterData?.format
      ),
      'value'
    );
  }
  if (props.filterData.registry_type === 'inspection_select' && !isNull(props.inspectionConfig)) {
    return props.inspectionConfig[props.filterData.valueKey];
  }
  return (
    props.filterData.options
    || uniqBy(
      makeOptionsFromArray(
        props.array,
        props.filterData.valueKey,
        props.filterData.labelKey,
        props.filterData?.format
      ),
      'value'
    )
  );
};

const makeObjByKey = (array: Array<any>, valueKey: string) => {
  return Object.values(array.reduce((newObj, { [valueKey]: value }) => {
    if (isArray(value)) {
      value.forEach((valueItem) => {
        newObj[valueItem] = true;
      });
    } else {
      newObj[value] = true;
    }

    return newObj;
  }, {}));
};

const checkOnNewValuewInArray = (array: Array<any>, filterData: StateMultiselectRegistryFilter['filterData'], options: StateMultiselectRegistryFilter['options']) => {
  const objArray = Object.values(makeObjByKey(array, filterData.valueKey));

  return options.length !== objArray.length;
};

const getOptions = (
  response, 
  getRegistryData: PropsMultiselectRegistryFilter['filterData']['getRegistryData'], 
  registryKey: PropsMultiselectRegistryFilter['registryKey'], 
  filterData: PropsMultiselectRegistryFilter['filterData'], 
  array: PropsMultiselectRegistryFilter['array']
): Array<any> => {
  const result = get(
    response,
    get(getRegistryData, 'typeAns', 'result.rows'),
    [],
  );
  const valueKey = get(getRegistryData, 'valueKey', null);
  const labelKey = get(getRegistryData, 'labelKey', valueKey);

  if (!valueKey) {
    throw new Error(`опередели valueKey в ${registryKey}/${filterData.valueKey}`);
  }

  let options = uniqBy(
    makeOptionsFromArray(
      result,
      valueKey,
      labelKey,
      getRegistryData?.format,
    ),
    'value',
  );

  if (getRegistryData.mergeWithArray) {
    const dataInArray = array.reduce((newObj, { [filterData.valueKey]: uniqKeyArray }) => {
      uniqKeyArray.forEach((uniqValue) => {
        if (uniqValue) {
          newObj[uniqValue] = true;
        }
      });

      return newObj;
    }, {});
    options = options.filter(({ value }) => value in dataInArray);
  }
  return options;
};

class MultiselectRegistryFilter extends React.PureComponent<PropsMultiselectRegistryFilter, StateMultiselectRegistryFilter> {
  state = {
    total_count: this.props.total_count,
    filterData: this.props.filterData,
    options: makeOptions(this.props),
    disabled: this.props.needUpdateFiltersOptions,
    isLoading: Boolean(get(this.props.filterData, 'getRegistryData', false)),
  };

  static getDerivedStateFromProps(nextProps: PropsMultiselectRegistryFilter, prevState: StateMultiselectRegistryFilter) {
    const { total_count, filterData } = nextProps;

    if (total_count !== prevState.total_count || filterData !== prevState.filterData) {
      const changeObj: Partial<StateMultiselectRegistryFilter> = {
        total_count,
        filterData,
      };
      const getRegistryData = get(nextProps.filterData, 'getRegistryData', null);
      if (!getRegistryData) {
        changeObj.options = makeOptions(nextProps);
      }

      return changeObj;
    }

    if (nextProps.needUpdateFiltersOptions && prevState.disabled) {
      const getRegistryData = get(nextProps.filterData, 'getRegistryData', null);

      if (!getRegistryData) {
        return {
          disabled: false,
        };
      }
    }

    return null;
  }

  componentDidMount() {
    const {
      filterData,
      array,
      registryKey,
      cache,
    } = this.props;
    const getRegistryData = get(filterData, 'getRegistryData', null);
    const valueKey = get(filterData, 'valueKey', null);
    if (valueKey && valueKey in cache) {
      const options = getOptions(cache[valueKey], getRegistryData, registryKey, filterData, array);
      this.setState({
        options,
        isLoading: false,
        disabled: false,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      registryKey,
      filterData,
      array,
    } = this.props;
    const triggerToUpdate = (
      (this.props.needUpdateFiltersOptions && !prevProps.needUpdateFiltersOptions)
      || (
        this.props.needUpdateFiltersOptions
        && prevProps.total_count !== this.props.total_count
        && checkOnNewValuewInArray(array, this.state.filterData, this.state.options)
      )
    );

    if (triggerToUpdate) {
      const getRegistryData = get(filterData, 'getRegistryData', null);

      if (getRegistryData) {
        let response = null;
        const payload = get(getRegistryData, 'payload', {});
        const groupName = get(getRegistryData, 'groupName', null);

        try {
          let promise = null;
          const valueKey = get(filterData, 'valueKey', null);
          if (groupName && groupName in cache) {
            promise = cache[groupName];
          } else {
            promise = this.props.dispatch(
              actionFetchWithCount(
                getJSON(
                  `${configStand.backend}/${getRegistryData.entity}`,
                  payload,
                ),
                { page: '' },
              )
            ).then((ans) => {
              delete cache[groupName];

              return ans;
            });

            if (groupName) {
              cache[groupName] = promise;
            }
          }

          response = await promise;
          if (valueKey && !(valueKey in this.props.cache)) {
            this.props.setCache((prevCache) => ({...prevCache, [valueKey]: response}));
          }
        } catch (error) {
          console.error(error); // eslint-disable-line

          this.setState({
            isLoading: false,
          });
          return;
        }

        const options = getOptions(response, getRegistryData, registryKey, filterData, array);
        this.setState({
          options,
          isLoading: false,
          disabled: false,
        });
      }
    }
  }

  handleChange = (value, options) => {
    const { props } = this;
    const { filterData } = props;

    this.props.onChange(filterData.valueKey, 'in', value || [], options);
  };

  render() {
    const { state, props } = this;
    const {
      filterValuesObj: {
        in: {
          value,
        },
      },
    } = props;

    const emptyList = !state.options.length;
    const id = `filter_r:${props.registryKey.toLocaleLowerCase()}_p:${props.filterData.valueKey}`;

    return (
      <EtsFilter noneClick={this.state.isLoading}>
        <EtsFilterTitle>{this.props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputContainer>
          <ReactSelect
            id={id}
            placeholder={
              this.state.isLoading
                ? 'Загрузка...'
                : (
                  emptyList
                    ? 'Список пуст'
                    : undefined
                )
            }
            value={value}
            options={state.options}
            multi
            onChange={this.handleChange}
            disabled={this.props.filterData.disabled || this.state.disabled || emptyList}
            etsIsLoading={this.state.isLoading}
          />
        </EtsFilterInputContainer>
      </EtsFilter>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state, { registryKey, filterData }) => ({
    total_count: getListData(state.registry, registryKey)?.data.total_count,
    array: getListData(state.registry, registryKey)?.data.array,
    filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
    session: state.session,
    inspectionConfig: state.some_uniq.inspectionConfig,
  }),
)(MultiselectRegistryFilter);
