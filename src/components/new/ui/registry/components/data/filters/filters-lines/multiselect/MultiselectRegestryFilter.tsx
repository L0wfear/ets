import * as React from 'react';
import { connect } from 'react-redux';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import {
  getListData,
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import { uniqBy } from 'lodash';

import {
  EtsFilter,
  EtsFilterTitle,
  EtsFilterInputContainer,
  EtsPreloaderFieldContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import { get } from 'lodash';
import { getJSON } from 'api/adapter';
import configStand from 'config';
import { actionFetchWithCount } from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import Preloader from 'components/ui/new/preloader/Preloader';
import { DivNone } from 'global-styled/global-styled';
import { isNumber, isBoolean, isArray } from 'util';

type PropsMultiselectRegestryFilter = {
  filterData: {
    title: string;
    valueKey: string | number;
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
  onChange: (valueKey: string | number, type: string, value: any[], option: object) => any;
};

type StateMultiselectRegestryFilter = {
  array: any[];
  filterData: {
    title: string;
    valueKey: string | number;
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

const makeOptions = (props: PropsMultiselectRegestryFilter) => (
  props.filterData.options
  || (
    uniqBy(
      makeOptionsFromArray(props.array, props.filterData.valueKey, props.filterData.labelKey),
      'value',
    )
  )
);

class MultiselectRegestryFilter extends React.Component<PropsMultiselectRegestryFilter, StateMultiselectRegestryFilter> {
  state = {
    array: this.props.array,
    filterData: this.props.filterData,
    options: makeOptions(this.props),
    disabled: this.props.wasFirstOpen,
    isLoading: Boolean(get(this.props.filterData, 'getRegistryData', false)),
  };

  static getDerivedStateFromProps(nextProps: PropsMultiselectRegestryFilter, prevState: StateMultiselectRegestryFilter) {
    const { array, filterData } = nextProps;

    if (array !== prevState.array || filterData !== prevState.filterData) {
      const changeObj: Partial<StateMultiselectRegestryFilter> = {
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
    if (!prevProps.wasFirstOpen && this.props.wasFirstOpen || prevState.array !== this.state.array && this.props.wasFirstOpen) {
      const getRegistryData = get(this.props.filterData, 'getRegistryData', null);

      if (getRegistryData) {
        let response = null;
        try {
          response = await this.props.actionFetchWithCount(
            getJSON(
              `${configStand.backend}/${getRegistryData.entity}`,
              {},
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

    this.props.onChange(filterData.valueKey, 'in', value || [], options);
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
            multi
            onChange={this.handleChange}
            disabled={this.props.filterData.disabled || this.state.disabled || emptyList}
          />
          {
            this.state.isLoading
              ? (
                <EtsPreloaderFieldContainer>
                  <Preloader typePreloader="field" />
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
)(MultiselectRegestryFilter);
