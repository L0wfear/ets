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
import InputNumber from 'components/new/ui/field/InputNumber';
import { DivNone } from 'global-styled/global-styled';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

type PropsAdvancedNumberFilter = {
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
    disabled?: boolean;
  };
  filterValuesObj: any;
  formatedTitle: string;
  onChange: (valueKey: string, type: string, value: any) => any;
};

type StateAdvancedNumberFilter = {
  activeTypeArr: string[];
  optionsType: any;
};

class AdvancedNumberFilter extends React.Component<PropsAdvancedNumberFilter, StateAdvancedNumberFilter> {
  constructor(props) {
    super(props);
    const eq = ['eq'];
    const activeTypeArr: StateAdvancedNumberFilter['activeTypeArr'] = eq;

    this.state = {
      activeTypeArr,
      optionsType: [
        {
          value: eq,
          label: '=',
        },
        {
          value: ['gt'],
          label: '>',
        },
        {
          value: ['lt'],
          label: '<',
        },
        {
          value: ['neq'],
          label: '≠',
        },
        {
          value: ['gt', 'lt'],
          label: '><',
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
    const valueAsNumber = Number(value);
    const { activeTypeArr } = this.state;

    this.props.onChange(filterData.valueKey, activeTypeArr[index], value !== '' ? valueAsNumber : '');
  }

  handleChangeFirst = ({ currentTarget: { value }}) => {
    this.handleChange(value, 0);

  }

  handleChangeSecond = ({ currentTarget: { value }}) => {
    this.handleChange(value, 1);
  }

  render() {
    const { props, state  } = this;
    const { activeTypeArr } = state;
    const {
      filterValuesObj,
    } = props;

    return (
      <EtsFilter>
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
              <InputNumber
                value={filterValuesObj[activeTypeArr[0]].value}
                onChange={this.handleChangeFirst}
                noShowLabel
                noShowError
                disabled={this.props.filterData.disabled}
              />
            </AdvacedFirstInputContainer>
          </AdvacedFirstLineContainer>
          <AdvacedSecondLineContainer>
          {
            activeTypeArr.length > 1
            ? (
              <InputNumber
                value={filterValuesObj[activeTypeArr[1]].value}
                onChange={this.handleChangeSecond}
                noShowLabel
                noShowError
                disabled={this.props.filterData.disabled}
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
)(AdvancedNumberFilter);
