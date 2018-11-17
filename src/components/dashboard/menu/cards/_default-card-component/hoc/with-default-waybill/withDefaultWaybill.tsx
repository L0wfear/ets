import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import withDefaultCard from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';
import { connect } from 'react-redux';

import { ReduxState } from 'redux-main/@types/state';
import {
  TypeConfigWithDefaultWaybill,
  StatePropsDefaultWaybill,
  DispatchPropsDefaultWaybill,
  PropsDefaultWaybill,
} from './withDefaultWaybill.h';

const withDefaultWaybill = (config: TypeConfigWithDefaultWaybill) => (Component) => (
  hocAll(
    withDefaultCard({
      path: config.path,
      loadData: config.loadData,
      InfoComponent: config.InfoComponent,
    }),
    connect<StatePropsDefaultWaybill, DispatchPropsDefaultWaybill, {}, ReduxState>(
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
  )(
    class DefaultWaybill extends React.Component<PropsDefaultWaybill, {}> {
      handleClick: any = ({ currentTarget: { dataset: { path } } }) => {
        this.props.setInfoData(
          config.setInfoDataPropsMake(
            this.props,
            path,
          ),
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
        );
      }
    },
  )
);

export default withDefaultWaybill;
