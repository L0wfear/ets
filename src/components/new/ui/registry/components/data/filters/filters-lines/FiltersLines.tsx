import * as React from 'react';
import { connect } from 'react-redux';
import { getFilterData } from 'components/new/ui/registry/module/selectors-registry';
import MultiselectRegestryFilter from 'components/new/ui/registry/components/data/filters/filters-lines/multiselect/MultiselectRegestryFilter';
import {
  EtsFiltersLines,
  EtsFilterContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { registryChangeFilterRawValues } from 'components/new/ui/registry/module/actions-registy';
import AdvancedNumberFilter from 'components/new/ui/registry/components/data/filters/filters-lines/advanced-number/AdvancedNumberFilter';
import { getSessionState } from 'redux-main/reducers/selectors';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { isArray } from 'util';
import AdvancedDateFilter from './advanced-date/AdvancedDateFilter';

type PropsFiltersLines = {
  wasFirstOpen: boolean;
  registryKey: string;
  fileds: any[];
  userData: InitialStateSession['userData'];
  onChangeFilterRawValue: (valueKey: string, type: string, value: any) => any;
};

type StateFiltersLines = {
};

class FiltersLines extends React.Component<PropsFiltersLines, StateFiltersLines> {
  handleChange = (valueKey, type, value) => {
    this.props.onChangeFilterRawValue(valueKey, type, value);
  }

  fieldMap = ({ type, ...otherFilterData }, index) => {
    const { registryKey } = this.props;

    let formatedTitle = otherFilterData.title;

    if (isArray(otherFilterData.title)) {
      formatedTitle = otherFilterData.title.reduce((filtredTitle, titleSomeValue) => {
        const { displayIf } = titleSomeValue;

        if (displayIf === displayIfContant.isKgh && this.props.userData.isKgh) {
          return titleSomeValue.title;
        }
        if (displayIf === displayIfContant.isOkrug && this.props.userData.isOkrug) {
          return titleSomeValue.title;
        }

        return filtredTitle;
      }, null);
    }

    if (!formatedTitle) {
      return null;
    }

    switch (type) {
      case 'multiselect': {
        return (
          <EtsFilterContainer key={otherFilterData.valueKey}>
            <MultiselectRegestryFilter
              formatedTitle={formatedTitle}
              filterData={otherFilterData}
              wasFirstOpen={this.props.wasFirstOpen}
              registryKey={registryKey}
              onChange={this.handleChange}
            />
          </EtsFilterContainer>
        );
      }
      case 'advanced-number': {
        return (
          <EtsFilterContainer key={otherFilterData.valueKey}>
            <AdvancedNumberFilter
              formatedTitle={formatedTitle}
              filterData={otherFilterData}
              registryKey={registryKey}
              onChange={this.handleChange}
            />
          </EtsFilterContainer>
        );
      }
      case 'advanced-date': {
        return (
          <EtsFilterContainer key={otherFilterData.valueKey}>
            <AdvancedDateFilter
              formatedTitle={formatedTitle}
              filterData={otherFilterData}
              registryKey={registryKey}
              onChange={this.handleChange}
            />
          </EtsFilterContainer>
        );
      }
      default: return (
        <EtsFilterContainer key={otherFilterData.valueKey}>
          {`not found filter with type ${type}`}
        </EtsFilterContainer>

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
  userData: getSessionState(state).userData,
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
