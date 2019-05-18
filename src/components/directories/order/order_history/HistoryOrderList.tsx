import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import * as moment from 'moment';
import { connect } from 'react-redux';

import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import Div from 'components/ui/Div';

import OrdeHistoryTable from 'components/directories/order/order_history/OrdeHistoryTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';
import {
  HistoryOrderListPanelTitleCol,
  HistoryOrderListPanelTitleH4,
  HistoryOrderListPanelTitleColSelect,
} from 'components/directories/order/order_history/styled/HistoryOrderList';

class HistoryOrderList extends React.Component<any, any> {
  state: any = {
    activeData: {},
    data: {},
  };
  constructor(props) {
    super(props);
    const { data = [] } = props;

    const [activeData] = data;

    this.state = {
      data,
      haveData: !!activeData,
      activeList: !!activeData ? 1 : null,
      activeData: activeData || this.state.activeData,
      VERSION_OPTIONS: data.map((d, i) => ({
        value: i + 1,
        label: `Версия ${moment(d.synced_timestamp).format(
          `${global.APP_DATE_FORMAT} HH:mm`,
        )}`,
      })),
      historytableIsOpen: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data !== nextProps.data) {
      const changedState: any = {};

      changedState.data = nextProps.data;
      const [activeData] = changedState.data;

      changedState.haveData = !!activeData;
      changedState.activeList = !!activeData ? 1 : null;
      changedState.activeData = activeData || prevState.activeData;
      changedState.VERSION_OPTIONS = changedState.data.map((d, i) => ({
        value: i + 1,
        label: `Версия ${moment(d.synced_timestamp).format(
          `${global.APP_DATE_FORMAT} HH:mm`,
        )}`,
      }));
      changedState.historytableIsOpen = false;

      return changedState;
    }

    return null;
  }

  handleChangeVersion = (num) => {
    const { data } = this.props;

    this.setState({
      ...this.state,
      activeData: data.slice(num - 1, num)[0],
      activeList: num,
    });
  }

  toggleHistoryTable = () => {
    const { historytableIsOpen } = this.state;

    this.setState({ historytableIsOpen: !historytableIsOpen });
  };

  render() {
    const {
      haveData,
      activeList,
      VERSION_OPTIONS,
      historytableIsOpen,
      activeData,
    } = this.state;

    return (
      <Div hidden={this.props.hidden}>
        <EtsBootstrap.Row>
          <EtsBootstrap.Panel>
            <HistoryOrderListPanelTitleCol
              md={12}
              onClick={this.toggleHistoryTable}>
              <HistoryOrderListPanelTitleH4>
                <span>Версионность централизованного задания</span>
                <EtsBootstrap.Glyphicon
                  glyph={historytableIsOpen ? 'menu-up' : 'menu-down'}
                />
              </HistoryOrderListPanelTitleH4>
            </HistoryOrderListPanelTitleCol>
            <Div hidden={!historytableIsOpen}>
              <HistoryOrderListPanelTitleColSelect md={12}>
                <div>Версия централизованного задания</div>
                <EtsBootstrap.Col md={3}>
                  <ReactSelect
                    type="select"
                    options={VERSION_OPTIONS}
                    value={activeList}
                    clearable={false}
                    onChange={this.handleChangeVersion}
                  />
                </EtsBootstrap.Col>
              </HistoryOrderListPanelTitleColSelect>
              <Div hidden={!haveData}>
                <div>
                  <EtsBootstrap.Col md={8}>
                    <OrdeHistoryTable
                      noHeader
                      preventNoDataMessage
                      withNormInitialData
                      data={activeData.technical_operations}
                    />
                  </EtsBootstrap.Col>
                  <EtsBootstrap.Col md={4}>
                    <OrderInfoTable
                      noHeader
                      preventNoDataMessage
                      withNormInitialData
                      data={[{ id: 0, order_info: activeData.order_info }]}
                    />
                  </EtsBootstrap.Col>
                </div>
              </Div>
              <Div hidden={haveData}>
                <div>
                  <EtsBootstrap.Col md={12} style={{ marginTop: 20 }}>
                    <span>
                      Для выбранного централизованного задания предыдущих версий
                      нет.
                    </span>
                  </EtsBootstrap.Col>
                </div>
              </Div>
            </Div>
          </EtsBootstrap.Panel>
        </EtsBootstrap.Row>
      </Div>
    );
  }
}

const mapStateToProps = (state) => ({
  hidden:
    !state.order.showHistoryComponent || !state.order.selectedElementOrder,
  data: state.order.HistoryOrderDataList,
});

export default connect(mapStateToProps)(HistoryOrderList);
