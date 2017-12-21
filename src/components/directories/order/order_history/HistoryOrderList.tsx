import * as React from 'react';
import { Row, Col, Panel, Glyphicon } from 'react-bootstrap';
import * as moment from 'moment';

import EtsSelect from 'components/ui/input/EtsSelect';
import Div from 'components/ui/Div.jsx';

import OrdeHistoryTable from 'components/directories/order/order_history/OrdeHistoryTable';
import OrderInfoTable from 'components/directories/order/order_assignment/OrderInfoTable';

const EtsSelectTSX: any = EtsSelect;

class HistoryOrder extends React.Component<any, any> {
  state: any = {
    activeData: {},
  };
  componentDidMount() {
    const {
      data,
    } = this.props;

    const [activeData] = data;

    this.setState({
      haveData: !!activeData,
      activeList: !!activeData ? 1 : null,
      activeData,
      VERSION_OPTIONS: data.map((d, i) => ({ value: i + 1, label: `Версия ${moment(d.create_date).format(`${global.APP_DATE_FORMAT} HH:mm`)}`})),
      historytableIsOpen: false,
    });
  }

  getEmptyMes() {
    return (
    <div>
      <Col md={12} style={{ marginTop: 20 }}>
        <span>Для выбранного централизованного задания предыдущих версий нет.</span>
      </Col>
    </div>
    );
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
  getTables() {
    const {
      activeData: {
        technical_operations: data = [],
        order_info,
      },
    } = this.state;
    return (
      <div>
        <Col md={8}>
          <OrdeHistoryTable
            noHeader
            preventNoDataMessage
            data={data}
          />
        </Col>
        <Col md={4}>
          <OrderInfoTable
            noHeader
            preventNoDataMessage
            data={[{ id: 0, order_info }]}
          />
        </Col>
      </div>
    );
  }
  render() {
    const {
      haveData,
      activeList,
      VERSION_OPTIONS,
      historytableIsOpen,
    } = this.state;

    return (
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
                <EtsSelectTSX
                  type="select"
                  options={VERSION_OPTIONS}
                  value={activeList}
                  clearable={false}
                  onChange={this.handleChangeVersion}
                />
              </Col>
            </Col>
            {
              haveData ?
              this.getTables()
              :
              this.getEmptyMes()
            }
          </Div>
        </Panel>
      </Row>
    );
  }
}

export default HistoryOrder;
