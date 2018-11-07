import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { withRouter } from 'react-router-dom';
import * as queryString from 'query-string';
import {
  difference,
  identity,
  isEmpty,
  isEqual,
  omit,
  pick,
  uniqBy,
} from 'lodash';

import Title from './Title';
import { filterFunction } from 'components/ui/tableNew/utils';
import { IDataTableColSchema, IDataTableSelectedRow, IDataTableColFilter } from 'components/ui/table/@types/schema.h';
import { IReactSelectOption } from 'components/ui/@types/ReactSelect.h';
import { IPropsReportContainer, IStateReportContainer } from './@types/ReportContainer.h';
import { IPropsReportHeaderCommon } from './@types/ReportHeaderWrapper.h';
import { ReportDataPromise, IReportTableMeta } from 'components/reports/redux-main/modules/@types/report.h';

import Preloader from 'components/ui/new/preloader/Preloader';
import { getServerErrorNotification, noItemsInfoNotification } from 'utils/notifications';
import * as reportActionCreators from 'components/reports/redux-main/modules/report';
import DataTable from 'components/ui/table/DataTable';
import DataTableNew from 'components/ui/tableNew/DataTable';

import {
  EtsPageWrap,
} from 'global-styled/global-styled';
import { compose } from 'recompose';

// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.
const Table: any = DataTable;

class ReportContainer extends React.Component<IPropsReportContainer, IStateReportContainer> {
  constructor(props) {
    super(props);
    this.state = {
      filterResetting: false,
      fetchedBySubmitButton: false,
      fetchedByMoveDownButton: false,
      exportFetching: false,
      selectedRow: null,
      filterValues: {},
      uniqName: props.uniqName || '_uniq_field',
      lastSearchObject: queryString.parse(this.props.location.search),
    };
  }

  componentDidMount() {
    // Так как стор один на все отчёты, необходимо его чистить в начале.
    this.props.setInitialState();
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (Object.keys(searchObject).length > 0) {
      this.getReportData(searchObject);
    } else {
      this.getTableMetaInfo();
    }
  }

  static getDerivedStateFromProps(nextProps: IPropsReportContainer, prevState: IStateReportContainer) {
    const { lastSearchObject } = prevState;
    const { location: { search: search_next } } = nextProps;

    const searchNextxObject = queryString.parse(search_next);

    // Если урл поменялся и он не пустой, то делаем запрос данных.
    if (!isEqual(lastSearchObject, searchNextxObject)) {
      return {
        filterValues: {},
        lastSearchObject: searchNextxObject,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    const { location: { search } } = prevProps;
    const { location: { search: search_next } } = this.props;

    const searchObject = queryString.parse(search);
    const searchNextxObject = queryString.parse(search_next);

    // Если урл поменялся и он не пустой, то делаем запрос данных.
    if (!isEqual(searchObject, searchNextxObject)) {
      if (Object.keys(searchNextxObject).length > 0) {
        this.getReportData(searchNextxObject);
      } else {
        this.getTableMetaInfo();
        this.props.setInitialState();
      }
    }
  }

  getReportData(query): ReportDataPromise {
    const payload: any = { ...query };

    return new Promise(async (resolve, reject) => {
      try {
        const { notUseServerSummerTable } = this.props;

        const data = await this.props.getReportData(this.props.serviceName, payload, '', { ...this.state, notUseServerSummerTable });
        const hasSummaryLevel = 'summary' in data.result.meta.levels;

        if (this.state.fetchedByMoveDownButton && !notUseServerSummerTable) {
          this.props.setSummaryTableData({
            summaryList: [this.state.selectedRow],
            summaryMeta: {...this.props.prevMeta},
            summaryTableMetaInfo: [...this.props.prevTableMetaInfo.fields],
          });
          this.setState({
            fetchedByMoveDownButton: false,
              selectedRow: null,
          });
        } else if (hasSummaryLevel && !notUseServerSummerTable) {
          const summaryQuery = {
            ...payload,
            level: data.result.meta.levels.summary.level,
          };

          await this.props.getReportData(
            this.props.serviceName,
            summaryQuery,
            'summary',
          );
        }

        if (data.result.rows.length === 0) {
          noItemsInfoNotification();
        }

        resolve(data);
      } catch (errorData) {
        !errorData.errorIsShow && global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${errorData.error_text}`));
        reject({ ...errorData, errorIsShow: true });
      }
    });
  }

  getTableMetaInfo() {
    try {
      this.props.getTableMetaInfo(this.props.serviceName);
    } catch (errorData) {
      !errorData.errorIsShow && global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${errorData.error_text}`));
    }
  }

  handleReportSubmit = async (headerData: object) => {
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    try {
      // Если урл пустой, то делаем запрос на основе параметров из хедера.
      if (Object.keys(searchObject).length === 0) {
        const payload: any = { ...headerData };

        const data = await this.getReportData(payload);

        if (data.result.rows.length === 0) {
          return;
        }

        const query = {
          ...headerData,
          level: data.result.meta.levels.current.level,
        };

        /**
         * Сделано синхронно, чтобы на момент изменения просов с урлом стейт был уже обновлён.
         */
        this.setState(prevState => {
          this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(query)}`);

          return {
            fetchedBySubmitButton: true,
          };
        });

        return;
      }

      /**
       * Если урл не пустой, то берём из него только мета-информацию.
       */
      const newQuery = {
        ...headerData,
        ...pick(searchObject, this.props.meta.levels.current.filter),
        level: this.props.meta.levels.current.level,
      };

      /**
       * Не пишем историю при одинаковых запросах.
       * Соотвественно новый запрос на сервер будет игнорирован.
       */
      if (isEqual(searchObject, newQuery)) {
        return;
      }

      this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(newQuery)}`);
    } catch (errorData) {
      !errorData.errorIsShow && global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${errorData.error_text}`));
    }
  }

  externalFilter = (filterValues: any) => {
    this.setState({ filterValues });

    if (this.props.notUseServerSummerTable) {
      const { data: old_data } = this.props;
      const list = filterFunction(old_data.result.rows, { filterValues });

      const data = {
        ...old_data,
        result: {
          ...old_data.result,
          rows: [...list],
        },
      };

      this.props.setReportDataWithSummerData({
        data,
        props: { ...this.state },
      });
    }
  }

  handleMoveDown = (selectedRow: IDataTableSelectedRow) => {
    const moveDownIsPermitted = 'lower' in this.props.meta.levels;
    if (!moveDownIsPermitted) {
      return;
    }

    const lowerLevel = this.props.meta.levels.lower.level;
    const lowerLevelFilters = this.props.meta.levels.lower.filter;
    const lowerLevelSelectors = this.props.meta.levels.lower.filter
      .map(selector => ({[selector]: selectedRow.props.data[selector] }))
      .reduce((prev, next) => ({ ...prev, ...next }));

    const currentLevelFilters = this.props.meta.levels.current.filter;
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    const query = {
      ...searchObject,
      level: lowerLevel,
      ...lowerLevelSelectors,
    };

    const filterDifference = difference(currentLevelFilters, lowerLevelFilters);
    const filteredQuery = omit(query, filterDifference);

    this.setState(prevState => {
      this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(filteredQuery)}`);

      return {
        fetchedByMoveDownButton: true,
        selectedRow: selectedRow.props.data,
      };
    });

  }

  handleMoveUp = () => {
    const higherLevel = this.props.meta.levels.higher.level;
    const currentLevelSelectors = this.props.meta.levels.current.filter;
    const {
      location: {
        search,
      },
    } = this.props;
    const searchObject = queryString.parse(search);

    const query = {
      ...searchObject,
      level: higherLevel,
    };

    const filteredQuery = omit(query, currentLevelSelectors);

    this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(filteredQuery)}`);
  }

  handleReportPrint = async () => {
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);
    this.setState({ exportFetching: true });

    await this.props.exportByPostData(
      {
        rows: [
          ...this.props.list,
        ],
      },
      searchObject,
    );

    this.setState({ exportFetching: false });
  }

  makeTableSchema(schemaMakers = {}, additionalSchemaMakers, tableMetaInfo: IReportTableMeta, forWhat) {
    const cols = tableMetaInfo.fields.reduce((tableMeta, field) => {
      const [[fieldName, { name: displayName, is_row }]] = Object.entries(field);

      if (!is_row) {
        let initialSchema: IDataTableColSchema;

        initialSchema = {
          name: fieldName,
          displayName,
          filter: {
            type: 'multiselect',
            options: undefined,
          },
        };
        if (forWhat === 'mainList' && this.props.data.result) {
          (initialSchema.filter as IDataTableColFilter).options = uniqBy<IReactSelectOption>(this.props.data.result.rows.map(({ [fieldName]: value }) => ({ value, label: value })), 'value');
        }

        const renderer = schemaMakers[fieldName] || identity;
        tableMeta.push(renderer(initialSchema, this.props));
      }

      return tableMeta;
    }, []).concat(...additionalSchemaMakers);

    return { cols };
  }

  render() {
    const {
      enumerated = false,
      enableSort = true,
      initialSort = false,
      schemaMakers,
      tableMetaInfo,
      summaryTableMetaInfo,
      additionalSchemaMakers = [],
      location: { search },
    } = this.props;

    const Header: React.ComponentClass<IPropsReportHeaderCommon> = this.props.headerComponent;

    const tableMeta = this.makeTableSchema(schemaMakers, additionalSchemaMakers, tableMetaInfo, 'mainList');
    const summaryTableMeta = this.makeTableSchema({}, [], { fields: summaryTableMetaInfo }, 'summaryList');

    const moveUpIsPermitted = 'higher' in this.props.meta.levels;
    const isListEmpty = this.props.list.length === 0;

    const preloader = (
      (
        this.props.reportMetaFetching ||
        this.props.reportDataFetching ||
        this.state.exportFetching
      ) &&
      <Preloader typePreloader="mainpage"/>
    );
    const moveUpButton = (
      moveUpIsPermitted &&
      <Button bsSize="small" onClick={this.handleMoveUp}>На уровень выше</Button>
    );

    const isSummaryEnable = (
      'summary' in this.props.meta.levels &&
      this.props.summaryList.length > 0
    );

    const summaryTable = (isSummaryEnable && (
      this.props.notUseServerSummerTable ?
      <DataTableNew
        title={'Итого'}
        tableMeta={summaryTableMeta}
        data={this.props.summaryList}
        enableSort={false}
        enumerated={enumerated}
        uniqName={this.state.uniqName}
        noFilter
      />
      :
      <Table
        className="data-other"
        title={'Итого'}
        tableMeta={summaryTableMeta}
        results={this.props.summaryList}
        renderers={this.props.summaryRenderes || {}}
        onRowSelected={undefined}
        enumerated={enumerated}
        enableSort={false}
        noFilter
      />
    )
    );

    /**
     * Через специальный для каждого хедера колбэк обрабатываются параметры урла,
     * которые должны быть в специальном для каждого элемента ввода формате.
     */
    const stateMaker = this.props.headerStateMaker || identity;
    const queryObject = queryString.parse(search);
    const queryState = stateMaker(queryObject);

    const mergedTableMetaInfo = {
      ...tableMetaInfo,
      ...this.props.meta,
    };

    const title = isEmpty(mergedTableMetaInfo.name) ?
      this.props.title
      :
      <Title
        text={mergedTableMetaInfo.name}
        hint={mergedTableMetaInfo.description}
      />;

    return (
      <EtsPageWrap inheritDisplay>
        <Header
          tableMeta={mergedTableMetaInfo}
          queryState={queryState}
          onClick={this.handleReportSubmit}
          readOnly={false}
        />
        <Table
          title={title}
          tableMeta={tableMeta}
          results={this.props.list}
          renderers={this.props.renderers || {}}
          onRowSelected={this.handleMoveDown}
          enumerated={enumerated}
          enableSort={enableSort}
          filterResetting={this.state.filterResetting}
          initialSort={initialSort || ''}
          externalFilter={this.externalFilter}
          needMyFilter={!this.props.notUseServerSummerTable}
          filterValues={this.state.filterValues}
          useServerFilter
          {...this.props.tableProps}
        >
          <Button
            bsSize="small"
            disabled={isListEmpty}
            onClick={this.handleReportPrint}
          ><Glyphicon glyph="download-alt" /></Button>
          {moveUpButton}
        </ Table>
        {summaryTable}
        {preloader}
      </EtsPageWrap>
    );
  }
}

const mapStateToProps = state => ({
  ...state.reports,
});
const mapDispatchToProps = dispatch => bindActionCreators<any, any>(reportActionCreators, dispatch);

export default compose<IPropsReportContainer,any>(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ReportContainer);
