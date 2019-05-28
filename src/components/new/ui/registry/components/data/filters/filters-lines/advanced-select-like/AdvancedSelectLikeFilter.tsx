import * as React from 'react';
import { connect } from 'react-redux';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import {
  getListData,
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import { get, uniqBy } from 'lodash';

import {
  EtsFilter,
  EtsFilterTitle,
  EtsFilterInputContainer,
  EtsPreloaderFieldContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import { getJSON } from 'api/adapter';
import configStand from 'config';
import { actionFetchWithCount } from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import PreloadNew from 'components/ui/new/preloader/PreloadNew';

import { DivNone } from 'global-styled/global-styled';
import { isNumber, isBoolean, isArray } from 'util';

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
  actionFetchWithCount: any;
  wasFirstOpen: boolean;
  formatedTitle: string;
  filterValuesObj: any;
  array: any[];
  onChange: (valueKey: string, type: string, value: any[], option: object) => any;
};

type StateAdvancedSelectLikeFilterFilter = {
  array: any[];
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string | number;
    options?: any;
    disabled?: boolean;
    getRegistryData: any;
  };
  options: any[];
  disabled: boolean;
  isLoading: boolean;
};

const getOption = (value, label) => {
  if ((value || isNumber(value) || isBoolean(value)) && (label || isNumber(label))) {
    return { value, label };
  }
  return null;
};

const makeOptionsFromArray = (array: any[], valueKey: string | number, labelKey?: string | number) => (
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

const makeObjByKey = (array: any[], valueKey: string) => {
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

const checkOnNewValuewInArray = (array: any[], filterData: StateAdvancedSelectLikeFilterFilter['filterData'], options: StateAdvancedSelectLikeFilterFilter['options']) => {
  const objArray = Object.values(makeObjByKey(array, filterData.valueKey));

  return options.length !== objArray.length;
};

class AdvancedSelectLikeFilterFilter extends React.PureComponent<PropsAdvancedSelectLikeFilterFilter, StateAdvancedSelectLikeFilterFilter> {
  state = {
    array: this.props.array,
    filterData: this.props.filterData,
    options: makeOptions(this.props),
    disabled: this.props.wasFirstOpen,
    isLoading: Boolean(get(this.props.filterData, 'getRegistryData', false)),
  };

  static getDerivedStateFromProps(nextProps: PropsAdvancedSelectLikeFilterFilter, prevState: StateAdvancedSelectLikeFilterFilter) {
    const { array, filterData } = nextProps;

    if (array !== prevState.array || filterData !== prevState.filterData) {
      const changeObj: Partial<StateAdvancedSelectLikeFilterFilter> = {
        array,
        filterData,
      };
      const getRegistryData = get(nextProps.filterData, 'getRegistryData', null);
      if (!getRegistryData) {
        changeObj.options = makeOptions(nextProps);
      }

      return changeObj;
    }

    if (nextProps.wasFirstOpen && prevState.disabled) {
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
      this.props.wasFirstOpen
      && (
       !prevProps.wasFirstOpen
        || (
          prevState.array !== this.state.array
          && checkOnNewValuewInArray(this.state.array, this.state.filterData, this.state.options)
        )
      )
    );
    if (triggerToUpdate) {
      const getRegistryData = get(this.props.filterData, 'getRegistryData', null);

      if (getRegistryData) {
        let response = null;
        const payload = get(getRegistryData, 'payload', {});

        try {
          response = await this.props.actionFetchWithCount(
            getJSON(
              `${configStand.backend}/${getRegistryData.entity}`,
              payload,
            ),
            { page: '' },
          );
        } catch (error) {
          console.error(error); // tslint:disable-line:no-console

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
  }

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

    return (
      <EtsFilter noneClick={this.state.isLoading}>
        <EtsFilterTitle>{this.props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputContainer>
          <ReactSelect
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
          />
          {
            this.state.isLoading
              ? (
                <EtsPreloaderFieldContainer>
                  <PreloadNew typePreloader="field" />
                </EtsPreloaderFieldContainer>
              )
              : (
                <DivNone />
              )
          }
        </EtsFilterInputContainer>
      </EtsFilter>
    );
  }
}

const mapStateToProps = (state, { registryKey, filterData }) => ({
  array: getListData(state.registry, registryKey).data.array,
  filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
});

export default connect<any, any, any, ReduxState>(
  mapStateToProps,
  (dispatch: any) => ({
    actionFetchWithCount: (...arg) => (
      dispatch(
        actionFetchWithCount(...arg),
      )
    ),
  }),
)(AdvancedSelectLikeFilterFilter);
