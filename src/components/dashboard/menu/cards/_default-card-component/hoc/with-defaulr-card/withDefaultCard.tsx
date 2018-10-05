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
} from 'components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.h';

require('components/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard.scss');

const withDefaultCard = ({ path, InfoComponent, ...config }: ConfigType) => (Component) => (
  hocAll(
    withRequirePermissionsNew({
      permissions: `dashboard.${path}`,
    }),
    connect(
      (state) => ({
        isLoading: state.dashboard[path].isLoading,
        title: state.dashboard[path].data.title,
        dateLoad: state.dashboard[path].dateLoad,
      }),
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
        dateLoad: this.props.dateLoad,
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

      componentWillReceiveProps({ dateLoad }) {
        if (dateLoad !== this.state.dateLoad) {
          if (!this.state.inLoadByLocalRefresh) {
            clearTimeout(this.state.timerId);
            clearInterval(this.state.timerId);

            this.setState({
              dateLoad,
              timerId: setInterval(() => (
                this.loadData()
              ), 60 * 1000),
            });
          } else {
            this.setState({
              dateLoad,
            })
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
          <div className="card_container main">
            <div className="card_title">
              <div>
                <div>{title}</div>
                <div className="button_refresh">
                  <Button onClick={this.loadData}>
                    <Glyphicon
                      className={cx({ 'glyphicon-spin': isLoading })}
                      glyph="refresh"
                    />
                  </Button>
                </div>
              </div>
            </div>
            <div className={cx('card_body', { is_loading: isLoading })}>
              <Component {...props} />
            </div>
            {
              InfoComponent ?
              (
                <InfoComponent />
              )
              :
              (
                <div className="none"></div>
              )
            }
          </div>
        )
      }
    }
  )
);

export default withDefaultCard;
