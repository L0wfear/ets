import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import { connectToStores, FluxContext, HistoryContext, exportable } from 'utils/decorators';
import Datepicker from 'components/ui/DatePicker.jsx';

const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Организация',
      display: props.isOkrug,
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'func_type',
      displayName: 'Тип техники',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'total_cars_count',
      displayName: 'Кол-во техники указанного типа',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'technical_operation',
      displayName: 'Технологическая операция',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'cars_count',
      displayName: 'Задействованная техника',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
  ],
});


const ReportTable = (props) => {
  const renderers = {

  };

  return (
    <Table
      title="Статистика выхода техники за период"
      tableMeta={tableMeta(props)}
      results={props.data}
      renderers={renderers}
      {...props}
    />
  );
};


@connectToStores(['reports', 'session'])
@exportable({ entity: 'car_usage_by_func_type' })
@FluxContext
@HistoryContext
export default class CarFuncTypeUsageReport extends Component {

  state = {
    coords: null,
  }

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('reports').getCarFuncTypeUsageDetailReport(this.props.location.query);
  }

  printReport() {
    this.props.export(this.props.location.query);
  }

  pushBack() {
    this.context.history.pushState(null, '/car_func_type_usage_reports', this.props.location.query);
  }

  handleGoBackClick = () => {
    this.pushBack();
  }

  handlePrintReportClick = () => {
    this.printReport();
  }

  renderHeader() {
    return (
      <Div>
        <Row>
          <Col md={4} />
          <Col md={5}>
            <Div><label htmlFor=" ">Период формирования</label></Div>
            <Div className="inline-block reports-date">
              <Datepicker disabled time={false} date={this.props.location.query.date_start} />
            </Div>
            <Div className="inline-block reports-date">
              <Datepicker disabled time={false} date={this.props.location.query.date_end} />
            </Div>
          </Col>
          <Col md={3}>
            <Button style={{ position: 'relative', top: 30 }} bsSize="small" onClick={this.handleGoBackClick}>Назад</Button>
          </Col>
        </Row>
      </Div>
    );
  }

  render() {
    const { carFuncTypeUsageDetailReportList = [] } = this.props;

    return (
      <div className="ets-page-wrap">
        {this.renderHeader()}
        <ReportTable data={carFuncTypeUsageDetailReportList} isOkrug={this.props.isOkrug}>
          <Button bsSize="small" onClick={this.handlePrintReportClick}><Glyphicon glyph="download-alt" /></Button>
        </ReportTable>
      </div>
    );
  }
}

CarFuncTypeUsageReport.propTypes = {
  carFuncTypeUsageDetailReportList: React.PropTypes.arrayOf({}),
  routeParams: React.PropTypes.shape({
    company_id: React.PropTypes.number,
    geozone_type: React.PropTypes.string,
    date_start: React.PropTypes.instanceOf(Date),
    date_end: React.PropTypes.instanceOf(Date),
  }),
  export: React.PropTypes.func,
};
