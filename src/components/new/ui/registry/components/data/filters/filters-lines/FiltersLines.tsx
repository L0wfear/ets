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
import { getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import AdvancedStringLikeFilter from './advanced-string-like/AdvancedStringLikeFilter';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import AdvancedSelectLikeFilter from './advanced-select-like/AdvancedSelectLikeFilter';

type PropsFiltersLines = {
  wasFirstOpen: boolean;
  registryKey: string;
  fileds: any[];
  userData: InitialStateSession['userData'];
  onChangeFilterRawValue: (valueKey: string, type: string, value: any) => any;
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
} & WithSearchProps;

type StateFiltersLines = {
};

class FiltersLines extends React.PureComponent<PropsFiltersLines, StateFiltersLines> {
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

        if (displayIf === displayIfContant.lenghtStructureMoreOne && this.props.STRUCTURES.length) {
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
      case 'advanced-select-like': {
        return (
          <EtsFilterContainer key={otherFilterData.valueKey}>
            <AdvancedSelectLikeFilter
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
      case 'advanced-datetime':
      case 'advanced-date': {
        return (
          <EtsFilterContainer key={otherFilterData.valueKey}>
            <AdvancedDateFilter
              formatedTitle={formatedTitle}
              filterData={otherFilterData}
              registryKey={registryKey}
              onChange={this.handleChange}
              time={type === 'advanced-datetime'}
            />
          </EtsFilterContainer>
        );
      }
      case 'advanced-string-like': {
        return (
          <EtsFilterContainer key={otherFilterData.valueKey}>
            <AdvancedStringLikeFilter
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
  STRUCTURES: getSessionStructuresOptions(state),
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

export default compose<any, any>(
  withSearch,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(FiltersLines);
