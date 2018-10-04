import * as React from 'react';
import { Row, Col, Panel, Glyphicon } from 'react-bootstrap';
import * as moment from 'moment';
import { connect } from 'react-redux';

import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import Div from 'components/ui/Div.jsx';

import OrdeHistoryTable from 'components/directories/order/order_history/OrdeHistoryTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

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
      VERSION_OPTIONS: data.map((d, i) => ({ value: i + 1, label: `Версия ${moment(d.synced_timestamp).format(`${global.APP_DATE_FORMAT} HH:mm`)}`})),
      historytableIsOpen: false,
    };
  }

  componentWillReceiveProps(props) {
    const changedState: any = {};

    if (this.state.data !== props.data) {
      changedState.data = props.data;
      const [activeData] = changedState.data;
      
      changedState.haveData = !!activeData;
      changedState.activeList = !!activeData ? 1 : null;
      changedState.activeData = activeData || this.state.activeData;
      changedState.VERSION_OPTIONS = changedState.data.map((d, i) => ({ value: i + 1, label: `Версия ${moment(d.synced_timestamp).format(`${global.APP_DATE_FORMAT} HH:mm`)}`}));
      changedState.historytableIsOpen = false;
    }

    this.setState(changedState);
  }

  handleChangeVersion = num => {
    const {
      data,
    } = this.props;

    this.setState({
      ...this.state,
      activeData: data.slice(num - 1, num)[0],
      activeList: num,
    });
  }
  toggleHistoryTable = () => {
    const { historytableIsOpen } = this.state;

    this.setState({ historytableIsOpen: !historytableIsOpen });
  }

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
        <Row>
          <Panel>
            <Col md={12} onClick={this.toggleHistoryTable} style={{ marginBottom: historytableIsOpen ? 20 : 0, cursor: 'pointer' }}>
              <h4 style={{ display: 'flex', justifyContent: 'space-between', margin: 0 }}>
                <span>Версионность централизованного задания</span>
                <Glyphicon glyph={historytableIsOpen ? 'menu-up' : 'menu-down'} />
              </h4>
            </Col>
            <Div hidden={!historytableIsOpen} >
              <Col style={{ marginBottom: -15, display: 'flex' }} md={12}>
                <div>Версия централизованного задания</div>
                <Col md={3}>
                  <ReactSelect
                    type="select"
                    options={VERSION_OPTIONS}
                    value={activeList}
                    clearable={false}
                    onChange={this.handleChangeVersion}
                  />
                </Col>
              </Col>
              <Div hidden={!haveData}>
              < div>
                  <Col md={8}>
                    <OrdeHistoryTable
                      noHeader
                      preventNoDataMessage
                      withNormInitialData
                      data={activeData.technical_operations}
                    />
                  </Col>
                  <Col md={4}>
                    <OrderInfoTable
                      noHeader
                      preventNoDataMessage
                      withNormInitialData
                      data={[{ id: 0, order_info: activeData.order_info }]}
                    />
                  </Col>
                </div>
              </Div>
              <Div hidden={haveData}>
                <div>
                  <Col md={12} style={{ marginTop: 20 }}>
                    <span>Для выбранного централизованного задания предыдущих версий нет.</span>
                  </Col>
                </div>
              </Div>
            </Div>
          </Panel>
        </Row>
      </Div>
    );
  }
}

const mapStateToProps = (state) => ({
  hidden: !state.order.showHistoryComponent || !state.order.selectedElementOrder,
  data: state.order.HistoryOrderDataList,
});

export default connect(
  mapStateToProps,
)(HistoryOrderList);
