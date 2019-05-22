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
import Preloader from 'components/ui/new/preloader/Preloader';
import { DivNone } from 'global-styled/global-styled';
import { isNumber, isBoolean, isArray } from 'util';

type PropsMultiselectRegestryFilter = {
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string | number;
    options?: any;
    disabled?: boolean;
    getRegistryData: any;
    format?: string;
  };
  registryKey: string;
  actionFetchWithCount: any;
  wasFirstOpen: boolean;
  formatedTitle: string;
  filterValuesObj: any;
  array: any[];
  onChange: (valueKey: string, type: string, value: any[], option: object) => any;
};

type StateMultiselectRegestryFilter = {
  array: any[];
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string | number;
    options?: any;
    disabled?: boolean;
    getRegistryData: any;
    format?: string;
  };
  options: any[];
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

const makeOptionsFromArray = (array: any[], valueKey: string | number, labelKey: string | number, format: string) => (
  array.reduce<any[]>((newArr, rowData) => {
    const { [valueKey]: value, [labelKey || valueKey]: label } = rowData;

    if (isArray(value)) {
      value.forEach((oneValue) => {
        let valueOfOption = oneValue;
        let labelOfOption = oneValue;

        if ('id' in oneValue && 'name' in oneValue) {
          valueOfOption = oneValue.id;
          labelOfOption = oneValue.name;
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

const makeOptions = (props: PropsMultiselectRegestryFilter) => (
  props.filterData.options
  || (
    uniqBy(
      makeOptionsFromArray(props.array, props.filterData.valueKey, props.filterData.labelKey, props.filterData.format),
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

const checkOnNewValuewInArray = (array: any[], filterData: StateMultiselectRegestryFilter['filterData'], options: StateMultiselectRegestryFilter['options']) => {
  const objArray = Object.values(makeObjByKey(array, filterData.valueKey));

  return options.length !== objArray.length;
};

class MultiselectRegestryFilter extends React.PureComponent<PropsMultiselectRegestryFilter, StateMultiselectRegestryFilter> {
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

        let options = uniqBy(
          makeOptionsFromArray(
            result,
            valueKey,
            labelKey,
            getRegistryData.format,
          ),
          'value',
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
