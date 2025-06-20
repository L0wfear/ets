import * as React from 'react';
import { connect } from 'react-redux';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';

import {
  getListData,
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import { get, uniqBy } from 'lodash';

import {
  EtsFilter,
  EtsFilterTitle,
  EtsFilterInputContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import { getJSON } from 'api/adapter';
import configStand from 'config';
import { actionFetchWithCount } from 'redux-main/_middleware/ets-loading/etsLoadingCounter';

import { isNumber, isBoolean, isArray } from 'util';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const cache: Record<string, Promise<any>> = {};

type PropsAdvancedSelectLikeFilterFilter = {
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string | number;
    options?: any;
    disabled?: boolean;
    getRegistryData: any;
  };
  registryKey: string;
  needUpdateFiltersOptions: boolean;
  formatedTitle: string;
  filterValuesObj: any;
  array: Array<any>;
  total_count: number;
  onChange: (valueKey: string, type: string, value: Array<any>, option: object) => any;

  dispatch: EtsDispatch;
};

type StateAdvancedSelectLikeFilterFilter = {
  total_count: number;
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string | number;
    options?: any;
    disabled?: boolean;
    getRegistryData: any;
  };
  options: Array<any>;
  disabled: boolean;
  isLoading: boolean;
};

const getOption = (value, label) => {
  if ((value || isNumber(value) || isBoolean(value)) && (label || isNumber(label))) {
    return { value, label };
  }
  return null;
};

const makeOptionsFromArray = (array: Array<any>, valueKey: string | number, labelKey?: string | number) => (
  array.reduce((newArr, { [valueKey]: value, [labelKey || valueKey]: label }) => {
    if (isArray(value)) {
      value.forEach((oneValue) => {
        const newItem = getOption(oneValue, oneValue);
        if (newItem) {
          newArr.push(newItem);
        }
      });
    } else {
      const newItem = getOption(value, label);
      if (newItem) {
        newArr.push(newItem);
      }
    }

    return newArr;
  }, [])
);

const makeOptions = (props: PropsAdvancedSelectLikeFilterFilter) => (
  props.filterData.options
  || (
    uniqBy(
      makeOptionsFromArray(props.array, props.filterData.valueKey, props.filterData.labelKey),
      'value',
    )
  )
);

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

const checkOnNewValuewInArray = (array: Array<any>, filterData: StateAdvancedSelectLikeFilterFilter['filterData'], options: StateAdvancedSelectLikeFilterFilter['options']) => {
  const objArray = Object.values(makeObjByKey(array, filterData.valueKey));

  return options.length !== objArray.length;
};

class AdvancedSelectLikeFilterFilter extends React.PureComponent<PropsAdvancedSelectLikeFilterFilter, StateAdvancedSelectLikeFilterFilter> {
  state = {
    total_count: this.props.total_count,
    filterData: this.props.filterData,
    options: makeOptions(this.props),
    disabled: this.props.needUpdateFiltersOptions,
    isLoading: Boolean(get(this.props.filterData, 'getRegistryData', false)),
  };

  static getDerivedStateFromProps(nextProps: PropsAdvancedSelectLikeFilterFilter, prevState: StateAdvancedSelectLikeFilterFilter) {
    const { total_count, filterData } = nextProps;

    if (total_count !== prevState.total_count || filterData !== prevState.filterData) {
      const changeObj: Partial<StateAdvancedSelectLikeFilterFilter> = {
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

  async componentDidUpdate(prevProps, prevState) {
    const triggerToUpdate = (
      (this.props.needUpdateFiltersOptions && !prevProps.needUpdateFiltersOptions)
      || (
        this.props.needUpdateFiltersOptions
        && prevProps.total_count !== this.props.total_count
        && checkOnNewValuewInArray(this.props.array, this.state.filterData, this.state.options)
      )
    );

    if (triggerToUpdate) {
      const getRegistryData = get(this.props.filterData, 'getRegistryData', null);

      if (getRegistryData) {
        let response = null;
        const payload = get(getRegistryData, 'payload', {});
        const groupName = get(getRegistryData, 'groupName', null);

        try {
          let promise = null;
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
        } catch (error) {
          console.error(error); // eslint-disable-line

          this.setState({
            isLoading: false,
          });
          return;
        }

        const result = get(
          response,
          get(getRegistryData, 'typeAns', 'result.rows'),
          [],
        );

        const valueKey = get(getRegistryData, 'valueKey', null);
        const labelKey = get(getRegistryData, 'labelKey', valueKey);

        if (!valueKey) {
          throw new Error(`опередели valueKey в ${this.props.registryKey}/${this.props.filterData.valueKey}`);
        }

        let options = makeOptionsFromArray(
          result,
          valueKey,
          labelKey,
        );

        if (getRegistryData.mergeWithArray) {
          const dataInArray = this.props.array.reduce((newObj, { [this.props.filterData.valueKey]: uniqKeyArray }) => {
            uniqKeyArray.forEach((uniqValue) => {
              if (uniqValue) {
                newObj[uniqValue] = true;
              }
            });

            return newObj;
          }, {});
          options = options.filter(({ value }) => value in dataInArray);
        }

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

    this.props.onChange(filterData.valueKey, 'like', value || [], options);
  };

  render() {
    const { state, props } = this;
    const {
      filterValuesObj: {
        like: {
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
    total_count: getListData(state.registry, registryKey).data.total_count,
    array: getListData(state.registry, registryKey).data.array,
    filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
  }),
)(AdvancedSelectLikeFilterFilter);
