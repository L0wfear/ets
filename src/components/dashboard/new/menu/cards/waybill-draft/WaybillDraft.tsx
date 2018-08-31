import * as React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import List from 'components/dashboard/new/menu/cards/waybill-draft/list/List';
import {
  dashboardLoadWaybillDraft,
  dashboardSetInfoDataInWaybillDraft,
 } from 'components/dashboard/new/redux/modules/dashboard/actions-dashboard';
import WaybillDraftInfo from 'components/dashboard/new/menu/cards/waybill-draft/info/WaybillDraftInfo';

require('components/dashboard/new/menu/cards/waybill-draft/WaybillDraft.scss');

type PropsWaybillDraft = {
  title: string;
  items: any[];
  isLoading: boolean;
  loadData: Function;
  setInfoData: Function;
  timeDelay?: number;
};

type StateWaybillDraft = {
  timerId: any;
}
class WaybillDraft extends React.Component<PropsWaybillDraft, StateWaybillDraft> {
  state = {
    timerId: 0,
  }
  componentDidMount() {
    this.loadData();
    this.setState({
      timerId: setTimeout(() => (
        this.setState({
          timerId: setInterval(() => (
            this.loadData()
          ), 60 * 1000)
        })
      ), this.props.timeDelay || 0),
    })
  }

  componentWillUnMount() {
    clearTimeout(this.state.timerId);
    clearInterval(this.state.timerId);
  }
  loadData = () => (
    this.props.loadData()
  );

  handleClick: any = ({ currentTarget: { dataset: { path } } }) => {
    const index = Number.parseInt((path as string).split('/').slice(-1)[0])

    this.props.setInfoData(this.props.items[index].subItems);
  }

  render() {
    const { items, isLoading } = this.props;

    return (
      <div className="card_container main number">
        <div className="card_title">
          <div>
            <div>{this.props.title}</div>
            <div>
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
          <List items={items} handleClick={this.handleClick} classNameContainer="line_data number" />
        </div>
        <WaybillDraftInfo />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.dashboard.waybill_draft.isLoading,
  title: state.dashboard.waybill_draft.data.title,
  items: state.dashboard.waybill_draft.data.items,
});

const mapDispatchToProps = (dispatch) => ({
  loadData: () => (
    dispatch(
      dashboardLoadWaybillDraft(),
    )
  ),
  setInfoData: (infoData) => (
    dispatch(
      dashboardSetInfoDataInWaybillDraft(infoData)
    )
  ),
});

export default hocAll(
  withRequirePermissionsNew({
    permissions: 'dashboard.waybill_draft',
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaybillDraft);