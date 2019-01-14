import * as React from 'react';
import { connect } from 'react-redux';
import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';
import MultiselectRegestryFilter from 'components/new/ui/registry/components/data/filters/filters-lines/multiselect/MultiselectRegestryFilter';
import { EtsFiltersLines } from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { registryChangeFilterRawValues } from 'components/new/ui/registry/module/actions-registy';
import AdvancedNumberFilter from 'components/new/ui/registry/components/data/filters/filters-lines/advanced-number/AdvancedNumberFilter';

type PropsFiltersLines = {
  registryKey: string;
  fileds: any[];
  onChangeFilterRawValue: (valueKey: string, type: string, value: any) => any;
};

type StateFiltersLines = {
};

class FiltersLines extends React.Component<PropsFiltersLines, StateFiltersLines> {
  handleChange = (valueKey, type, value) => {
    this.props.onChangeFilterRawValue(valueKey, type, value);
  }

  fieldMap = ({ type, ...otherFilterData }) => {
    const { registryKey } = this.props;

    switch (type) {
      case 'multiselect': return (
        <MultiselectRegestryFilter
          key={otherFilterData.valueKey}
          filterData={otherFilterData}
          registryKey={registryKey}
          onChange={this.handleChange}
        />
      );
      case 'advanced-number': return (
        <AdvancedNumberFilter
          key={otherFilterData.valueKey}
          filterData={otherFilterData}
          registryKey={registryKey}
          onChange={this.handleChange}
        />
      );
      default: return (
        <div
          key={otherFilterData.valueKey}
        >
          {`not found filter with type ${type}`}
        </div>
      );
    }
  }
  render() {
    return (
      <EtsFiltersLines>
        { this.props.fileds.map(this.fieldMap) }
      </EtsFiltersLines>
    );
  }
}

const mapStateToProps = (state, { registryKey }) => ({
  fileds: getFilterData(state.registry, registryKey).fields,
});

const mapDispatchToProps = (dispatch, { registryKey }) => ({
  onChangeFilterRawValue: (valueKey, type, value) => (
    dispatch(
      registryChangeFilterRawValues(
        registryKey,
        valueKey,
        type,
        value,
      ),
    )
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FiltersLines);
