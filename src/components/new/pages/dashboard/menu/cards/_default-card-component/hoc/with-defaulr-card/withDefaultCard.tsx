import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import {
  PropsDefaultCard,
  StateDefaultCard,
  ConfigType,
  StatePropsDefaultCard,
  DispatchPropsDefaultCard,
  OwnerPropsDefaultCard,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

import {
  CardTitleContainer,
  CardTitleContainerWrap,
  CardBodyContainer,
  GlyphiconWithNonAnimation,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { DivNone } from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import { getDashboardState } from 'redux-main/reducers/selectors';

const withDefaultCard = <P extends {}>({ path, InfoComponent, ...config }: ConfigType) => (Component: React.ClassType<P, any, any>) => (
  compose<P, P>(
    withRequirePermissionsNew<P>({
      permissions: `dashboard.${path}`,
    }),
    connect<StatePropsDefaultCard, DispatchPropsDefaultCard, OwnerPropsDefaultCard<P>, ReduxState>(
      (state) => {
        return ({
          isLoading: getDashboardState(state)[path].isLoading,
          title: getDashboardState(state)[path].data.title,
          dateLoad: getDashboardState(state)[path].dateLoad,
        });
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
    class DefaultCard extends React.Component<PropsDefaultCard<P>, StateDefaultCard> {
      state = {
        timerId: 0,
        inLoadByLocalRefresh: false,
      };

      componentDidMount() {
        this.loadData();

        this.setState({
          timerId: setTimeout(() => {
            this.setState({
              timerId: setInterval(() => {
                if (!this.props.isLoading) {
                  this.loadData();
                }
              }, (this.props.timeInterval || 2 * 60) * 1000),
            });
          }, this.props.timeDelay * 100 || 0),
        });
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
      }

      render() {
        const { isLoading, title, loadData, dateLoad, ...props } = this.props;
        return (
          <EtsBootstrap.DashboardCard>
            <div>
              <CardTitleContainer>
                <CardTitleContainerWrap>
                  <div>{title}</div>
                  <div className="button_refresh">
                    <EtsBootstrap.Button onClick={this.loadData} disabled={isLoading}>
                      <GlyphiconWithNonAnimation
                        isLoading={isLoading}
                        glyph="refresh"
                      />
                    </EtsBootstrap.Button>
                  </div>
                </CardTitleContainerWrap>
              </CardTitleContainer>
              <CardBodyContainer isLoading={isLoading}>
                <Component {...props} />
              </CardBodyContainer>
            </div>
            <div>
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
            </div>

          </EtsBootstrap.DashboardCard>
        );
      }
    },
  )
);

export default withDefaultCard;
