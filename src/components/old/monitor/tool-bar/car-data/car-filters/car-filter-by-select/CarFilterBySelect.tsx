import * as React from 'react';
import { connect } from 'react-redux';
import * as ClickOutHandler from 'react-onclickout';
import * as cx from 'classnames';

import {
  makeOptions,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/utils';

import {
  PropsCarFilterByText,
  StateCarFilterByText,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/CarFilterBySelect.h';
import DefaultInput from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/default-input/DefaultInput';

import {
  DivNone,
} from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const placeholder = {
  carFilterMultyGpsCode: 'БНСО',
  carFilterMultyType: 'Тип техники',
  carFilterMultyStructure: 'Подразделение',
  carFilterMultyOwner: 'Организация',
  carFilterMultyTechCondition: 'Техническое состояние',
  carFilterMultyModel: 'Марка шасси',
};

class CarFilterByText extends React.Component<PropsCarFilterByText, StateCarFilterByText> {
  constructor(props: PropsCarFilterByText) {
    super(props);

    const { carActualGpsNumberIndex } = props;

    const calcData = makeOptions(carActualGpsNumberIndex);

    this.state = {
      hidden: true,
      carActualGpsNumberIndex,
      carFilterMultyGpsCodeOptions: calcData.carFilterMultyGpsCodeOptions.arr,
      carFilterMultyTypeOptions: calcData.carFilterMultyTypeOptions.arr,
      carFilterMultyTechConditionOptions: calcData.carFilterMultyTechConditionOptions.arr,
      carFilterMultyModelOptions: calcData.carFilterMultyModelOptions.arr,
      carFilterMultyStructureOptions: calcData.carFilterMultyStructureOptions.arr,
      carFilterMultyOwnerOptions: calcData.carFilterMultyOwnerOptions.arr,
    };
  }

  static getDerivedStateFromProps(nextProps: any, prevState: StateCarFilterByText) {
    const { carActualGpsNumberIndex } = nextProps;

    if (carActualGpsNumberIndex !== prevState.carActualGpsNumberIndex) {
      const calcData = makeOptions(carActualGpsNumberIndex);

      return {
        carActualGpsNumberIndex,
        carFilterMultyGpsCodeOptions: calcData.carFilterMultyGpsCodeOptions.arr,
        carFilterMultyTypeOptions: calcData.carFilterMultyTypeOptions.arr,
        carFilterMultyTechConditionOptions: calcData.carFilterMultyTechConditionOptions.arr,
        carFilterMultyModelOptions: calcData.carFilterMultyModelOptions.arr,
        carFilterMultyStructureOptions: calcData.carFilterMultyStructureOptions.arr,
        carFilterMultyOwnerOptions: calcData.carFilterMultyOwnerOptions.arr,
      };
    }

    return null;
  }

  toggleHidden: any = () => {
    const hidden = !this.state.hidden;

    this.setState({ hidden });
  };
  handleClickOut: any = () => {
    if (!this.state.hidden) {
      this.setState({ hidden: true });
    }
  };

  render() {
    return (
      <span>
        <ClickOutHandler onClickOut={this.handleClickOut}>
          <div className={cx('tool_bar-block', { active: this.props.active })}>
            <div className="default_cube flex-row map-car-filter multi">
              <div className="button-toggle" onClick={this.toggleHidden} >
                <EtsBootstrap.Glyphicon glyph="filter" />
              </div>
              {
                this.state.hidden
                  ? (
                    <DivNone />
                  )
                  :                  (
                    <div className="car_text_filter-container multi">
                      <div>
                        {
                          [
                            'carFilterMultyGpsCode',
                            'carFilterMultyType',
                            'carFilterMultyTechCondition',
                            'carFilterMultyModel',
                            'carFilterMultyStructure',
                          ].map((keyField) => (
                            <DefaultInput
                              key={keyField}
                              keyField={keyField}
                              OPTIONS={this.state[`${keyField}Options`]}
                              placeholder={placeholder[keyField]}
                            />
                          ))
                        }
                        {
                          Boolean(this.props.isOkrug || !this.props.company_id)
                            ? (
                              <DefaultInput
                                keyField={'carFilterMultyOwner'}
                                OPTIONS={this.state.carFilterMultyOwnerOptions}
                                placeholder={placeholder.carFilterMultyOwner}
                              />
                            )
                            :                          (
                              <DivNone />
                            )
                        }
                      </div>
                    </div>
                  )
              }
            </div>
          </div>
        </ClickOutHandler>
      </span>
    );
  }
}

export default connect<any, any, any, ReduxState>(
  (state) => ({
    isOkrug: state.session.userData.isOkrug,
    company_id: state.session.userData.company_id,
    carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,

    active: ['carFilterMultyGpsCode', 'carFilterMultyType', 'carFilterMultyTechCondition', 'carFilterMultyModel', 'carFilterMultyStructure', 'carFilterMultyOwner'].some((key) => (
      state.monitorPage.filters.data[key].length
    )),
  }),
)(CarFilterByText);
