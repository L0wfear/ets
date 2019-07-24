import * as React from 'react';
import { connect } from 'react-redux';

import {
  getFilterData,
} from 'components/new/ui/registry/module/selectors-registry';

import {
  EtsFilter,
  EtsFilterTitle,
  EtsFilterInputAdvacedContainer,
  AdvacedFirstLineContainer,
  AdvacedSecondLineContainer,
  AdvacedSelectContainer,
  AdvacedFirstInputContainer,
} from 'components/new/ui/registry/components/data/filters/filters-lines/styled/styled';
import { DivNone } from 'global-styled/global-styled';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';
import InputDate from 'components/new/ui/field/InputDate';
import { createValidDate, createValidDateTime } from 'utils/dates';

type PropsAdvancedDateFilter = {
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
    disabled?: boolean;
  };
  filterValuesObj: any;
  formatedTitle: string;
  onChange: (valueKey: string, type: string, value: any) => any;
  time: boolean;
};

type StateAdvancedDateFilter = {
  activeTypeArr: string[];
  optionsType: any;
};

class AdvancedDateFilter extends React.PureComponent<PropsAdvancedDateFilter, StateAdvancedDateFilter> {
  constructor(props) {
    super(props);
    const eq = ['eq'];
    const activeTypeArr: StateAdvancedDateFilter['activeTypeArr'] = eq;

    this.state = {
      activeTypeArr,
      optionsType: [
        {
          value: eq,
          label: 'равно',
        },
        {
          value: ['gt'],
          label: 'больше',
        },
        {
          value: ['lt'],
          label: 'меньше',
        },
        {
          value: ['neq'],
          label: 'не равно',
        },
        {
          value: ['gt', 'lt'],
          label: 'диапазон',
        },
      ],
    };
  }

  handleChangeType = (value) => {
    const {
      activeTypeArr,
    } = this.state;
    activeTypeArr.forEach((type) => {
      this.props.onChange(this.props.filterData.valueKey, type, null);
    });

    const firstFilterValue = this.props.filterValuesObj[activeTypeArr[0]].value;

    if (firstFilterValue) {
      this.props.onChange(this.props.filterData.valueKey, value[0], firstFilterValue);
    }

    this.setState({
      activeTypeArr: value,
    });
  }

  handleChange = (value, index) => {
    const { props } = this;
    const { filterData } = props;
    const { activeTypeArr } = this.state;

    this.props.onChange(filterData.valueKey, activeTypeArr[index], value);
  }

  handleChangeFirst = (value) => {
    this.handleChange(
      value
        ? (
            this.props.time
            ? createValidDateTime(value)
            : createValidDate(value)
        )
        : null,
      0,
    );
  }

  handleChangeSecond = (value) => {
    this.handleChange(
      value
        ? (
            this.props.time
            ? createValidDateTime(value)
            : createValidDate(value)
        )
        : null,
      1,
    );
  }

  render() {
    const { props, state  } = this;
    const { activeTypeArr } = state;
    const {
      filterValuesObj,
    } = props;

    const id = `filter_${props.filterData.valueKey}`;

    return (
      <EtsFilter htmlFor="">
        <EtsFilterTitle>{this.props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputAdvacedContainer>
          <AdvacedFirstLineContainer>
            <AdvacedSelectContainer>
              <ReactSelect
                value={activeTypeArr}
                options={state.optionsType}
                onChange={this.handleChangeType}
                clearable={false}
                disabled={this.props.filterData.disabled}
              />
            </AdvacedSelectContainer>
            <AdvacedFirstInputContainer>
              <InputDate
                id={id}
                value={filterValuesObj[activeTypeArr[0]].value}
                onChange={this.handleChangeFirst}
                noShowLabel
                noShowError
                disabled={this.props.filterData.disabled}
                time={this.props.time}
              />
            </AdvacedFirstInputContainer>
          </AdvacedFirstLineContainer>
          <AdvacedSecondLineContainer>
          {
            activeTypeArr.length > 1
            ? (
              <InputDate
                value={filterValuesObj[activeTypeArr[1]].value}
                onChange={this.handleChangeSecond}
                noShowLabel
                noShowError
                disabled={this.props.filterData.disabled}
                time={this.props.time}
              />
            )
            : (
              <DivNone />
            )
          }
          </AdvacedSecondLineContainer>
        </EtsFilterInputAdvacedContainer>
      </EtsFilter>
    );
  }
}

const mapStateToProps = (state, { registryKey, filterData }) => ({
  filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
});

export default connect(
  mapStateToProps,
)(AdvancedDateFilter);
