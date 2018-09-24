import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import withDefaultCard from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import {
  ConfigType,
} from 'components/dashboard/new/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

require('components/dashboard/new/menu/cards/_default-card-component/hoc/with-default-waybill/withDefaultWaybill.scss');

type TypeConfig = ConfigType & {
  setInfoData: Function;
  setInfoDataPropsMake: Function;
  ListComponent: any;
};

type PropsDefaultWaybill = {
  setInfoData: Function;
  items: any[];
};

const withDefaultWaybill = (config: TypeConfig) => (Component) => (
  hocAll(
    withDefaultCard({
      path: config.path,
      loadData: config.loadData,
      InfoComponent: config.InfoComponent,
    }),
    connect(
      (state) => ({
        items: state.dashboard[config.path].data.items,
      }),
      (dispatch) => ({
        setInfoData: (infoData) => (
          dispatch(
            config.setInfoData(infoData),
          )
        ),
      }),
    ),
  )(class DefaultWaybill extends React.Component<PropsDefaultWaybill, {}> {
    handleClick: any = ({ currentTarget: { dataset: { path } } }) => {
      this.props.setInfoData(
        config.setInfoDataPropsMake(
          this.props,
          path,
        )
      );
    }
  
    render() {
      const { ListComponent } = config;
  
      return (
        <div>
          <ListComponent
            items={this.props.items}
            handleClick={this.handleClick}
          />
          <Component />
        </div>
      )
    }
  })
);

export default withDefaultWaybill;