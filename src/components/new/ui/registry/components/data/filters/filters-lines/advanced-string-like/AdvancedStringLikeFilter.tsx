import * as React from 'react';
import { connect } from 'react-redux';

import {
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import {
  EtsFilter,
  EtsFilterTitle,
  EtsFilterInputContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { ReduxState } from 'redux-main/@types/state';

import { get } from 'lodash';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type PropsAdvancedStringLikeFilter = {
  filterData: {
    title: string;
    valueKey: string;
    disabled?: boolean;
  };
  registryKey: string;
  formatedTitle: string;
  filterValuesObj: any;
  onChange: (valueKey: string, type: string, value: Array<any>) => any;
};

type StateAdvancedStringLikeFilter = {
  array: Array<any>;
  filterData: {
    title: string;
    valueKey: string;
    disabled?: boolean;
  };
  disabled: boolean;
};

class AdvancedStringLikeFilter extends React.PureComponent<PropsAdvancedStringLikeFilter, StateAdvancedStringLikeFilter> {
  handleChange = (e) => {
    const { props } = this;
    const { filterData } = props;

    this.props.onChange(filterData.valueKey, 'like', get(e, 'target.value', ''));
  };

  render() {
    const { props } = this;
    const {
      filterValuesObj: {
        like: {
          value,
        },
      },
    } = props;
    const id = `filter_r:${props.registryKey.toLocaleLowerCase()}_p:${props.filterData.valueKey}`;

    return (
      <EtsFilter>
        <EtsFilterTitle>{this.props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputContainer>
          <EtsBootstrap.FormControl
            id={id}
            value={value}
            onChange={this.handleChange}
            disabled={this.props.filterData.disabled}
          />
        </EtsFilterInputContainer>
      </EtsFilter>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state, { registryKey, filterData }) => ({
    filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
  }),
)(AdvancedStringLikeFilter);
