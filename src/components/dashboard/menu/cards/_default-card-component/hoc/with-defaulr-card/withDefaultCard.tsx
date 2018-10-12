import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import {
  PropsDefaultCard,
  StateDefaultCard,
  ConfigType,
  StatePropsDefaultCard,
  DispatchPropsDefaultCard,
  OwnerPropsDefaultCard,
} from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

import {
  CardMainContainer,
  CardMainContainerWrap,
  CardTitleContainer,
  CardTitleContainerWrap,
  CardBodyContainer,
} from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { DivNone } from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';

const withDefaultCard = ({ path, InfoComponent, ...config }: ConfigType) => (Component) => (
  hocAll(
    withRequirePermissionsNew({
      permissions: `dashboard.${path}`,
    }),
    connect<StatePropsDefaultCard, DispatchPropsDefaultCard, OwnerPropsDefaultCard, ReduxState>(
      (state) => {
        return ({
          isLoading: state.dashboard[path].isLoading,
          title: state.dashboard[path].data.title,
          dateLoad: state.dashboard[path].dateLoad,
        })
      },
      (dispatch) => ({
        loadData: () => (
          dispatch(
            config.loadData(),
          )
        ),
      }),
    ),
  )(
    class DefaultCard extends React.Component<PropsDefaultCard, StateDefaultCard> {
      state = {
        timerId: 0,
        inLoadByLocalRefresh: false,
      };

      componentDidMount() {
        this.setState({
          timerId: setTimeout(() => {
            this.loadData();

            this.setState({
              timerId: setInterval(() => (
                this.loadData()
              ), (this.props.timeInterval || 2 * 60) * 1000),
            })
          }, this.props.timeDelay * 1000 || 0),
        })
      }

      componentDidUpdate(prevProps) {
        if (prevProps.dateLoad !== this.props.dateLoad) {
          if (!this.state.inLoadByLocalRefresh) {
            clearTimeout(this.state.timerId);
            clearInterval(this.state.timerId);

            this.setState({
              timerId: setInterval(() => (
                this.loadData()
              ), 60 * 1000),
            });
          }
        }
      }

      componentWillUnmount() {
        clearTimeout(this.state.timerId);
        clearInterval(this.state.timerId);
      }
    
      loadData = () => {
        this.setState({ inLoadByLocalRefresh: true });
        this.props.loadData()
          .then(() => (
            this.setState({ inLoadByLocalRefresh: false })
          ));
      };

      render() {
        const { isLoading, title, loadData, dateLoad, ...props } = this.props;

        return (
          <CardMainContainer>
            <CardMainContainerWrap>
              <CardTitleContainer>
                <CardTitleContainerWrap>
                  <div>{title}</div>
                  <div className="button_refresh">
                    <Button onClick={this.loadData}>
                      <Glyphicon
                        className={cx({ 'glyphicon-spin': isLoading })}
                        glyph="refresh"
                      />
                    </Button>
                  </div>
                </CardTitleContainerWrap>
              </CardTitleContainer>
              <CardBodyContainer isLoading={isLoading}>
                <Component {...props} />
              </CardBodyContainer>
              {
                InfoComponent ?
                (
                  <InfoComponent />
                )
                :
                (
                  <DivNone />
                )
              }
            </CardMainContainerWrap>
          </CardMainContainer>
        )
      }
    }
  )
);

export default withDefaultCard;
