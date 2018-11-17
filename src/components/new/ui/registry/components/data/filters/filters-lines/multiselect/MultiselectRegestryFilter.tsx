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
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

type PropsMultiselectRegestryFilter = {
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
  };
  valueData: {
    value: any[] | void,
    type: string,
  };
  filterValuesObj: any;
  array: any[];
  onChange: (valueKey: string, type: string, value: any[], option: object) => any;
};

type StateMultiselectRegestryFilter = {
  array: any[];
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
  };
  options: any[];
};

const makeOptions = (props: PropsMultiselectRegestryFilter) => {
  return uniqBy(
    props.array,
    props.filterData.valueKey,
  ).reduce((newArr, { [props.filterData.valueKey]: value, [props.filterData.labelKey || props.filterData.valueKey]: label }) => {
    if (value && label) {
      newArr.push({ value, label });
    }

    return newArr;
  }, []);
};

class MultiselectRegestryFilter extends React.Component<PropsMultiselectRegestryFilter, StateMultiselectRegestryFilter> {
  state = {
    array: this.props.array,
    filterData: this.props.filterData,
    options: makeOptions(this.props),
  };

  static getDerivedStateFromProps(nextProps: PropsMultiselectRegestryFilter, prevState: StateMultiselectRegestryFilter) {
    const { array, filterData } = nextProps;

    if (array !== prevState.array || filterData !== prevState.filterData) {
      return {
        array,
        filterData,
        options: makeOptions(nextProps),
      };
    }

    return null;
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

    return (
      <EtsFilter>
        <EtsFilterTitle>{this.props.filterData.title}</EtsFilterTitle>
        <EtsFilterInputContainer>
          <ReactSelect
            value={value}
            options={state.options}
            multi
            onChange={this.handleChange}
          />
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
)(MultiselectRegestryFilter);
