import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

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
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';
import { ReduxState } from 'redux-main/@types/state';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

type StateProps = {
  filterValuesObj: OneRegistryData['filter']['rawFilterValues'][any];
};
type DispatchProps = {
  dispatch: DispatchProp['dispatch'];
};
type OwnProps = {
  registryKey: string;
  filterData: {
    title: string;
    valueKey: string;
    labelKey?: string;
    disabled?: boolean;
    step: number;
  };
  formatedTitle: string;
  onChange: (valueKey: string, type: string, value: any) => any;
};
type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

type State = {
  activeTypeArr: string[];
  optionsType: any;
};

class AdvancedNumberFilter extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const eq = ['eq'];
    const activeTypeArr: State['activeTypeArr'] = eq;

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
    const id = `filter_r:${this.props.registryKey.toLocaleLowerCase()}_p:${this.props.filterData.valueKey}`;
    const id_select = `${id}_n:select`;
    const id_one = `${id}_n:one`;
    const id_two = `${id}_n:two`;

    return (
      <EtsFilter>
        <EtsFilterTitle>{this.props.formatedTitle}</EtsFilterTitle>
        <EtsFilterInputAdvacedContainer>
          <AdvacedFirstLineContainer>
            <AdvacedSelectContainer>
              <ReactSelect
                id={id_select}
                value={activeTypeArr}
                options={state.optionsType}
                onChange={this.handleChangeType}
                clearable={false}
                disabled={this.props.filterData.disabled}
              />
            </AdvacedSelectContainer>
            <AdvacedFirstInputContainer>
              <InputNumber
                id={id_one}
                value={filterValuesObj[activeTypeArr[0]].value}
                onChange={this.handleChangeFirst}
                noShowLabel
                noShowError
                disabled={this.props.filterData.disabled}
                step={this.props.filterData.step}
              />
            </AdvacedFirstInputContainer>
          </AdvacedFirstLineContainer>
          <AdvacedSecondLineContainer>
          {
            activeTypeArr.length > 1
            ? (
              <InputNumber
                id={id_two}
                value={filterValuesObj[activeTypeArr[1]].value}
                onChange={this.handleChangeSecond}
                noShowLabel
                noShowError
                disabled={this.props.filterData.disabled}
                step={this.props.filterData.step}
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

export default connect<StateProps, DispatchProps, any, ReduxState>(
  (state, { registryKey, filterData }) => ({
    filterValuesObj: getFilterData(state.registry, registryKey).rawFilterValues[filterData.valueKey],
  }),
)(AdvancedNumberFilter);
