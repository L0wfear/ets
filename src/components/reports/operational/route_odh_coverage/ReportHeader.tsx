import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { omit } from 'lodash';

import { ColorForTable } from 'components/reports/operational/route_odh_coverage/styled';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/reports/common/@types/ReportHeaderWrapper.h';
import { ITechnicalOperationType } from 'api/@types/services/index.h';

import { FluxContext, connectToStores } from 'utils/decorators';

import ReportHeaderWrapper from 'components/reports/common/ReportHeaderWrapper';
import { ExtField } from 'components/ui/new/field/ExtField';

interface IPropsReportHeader
  extends IPropsReportHeaderCommon,
    IPropsReportHeaderWrapper {
  technical_operations_ids: any;
  technicalOperationsList: Array<ITechnicalOperationType>;
}

@connectToStores(['objects'])
@FluxContext
class ReportHeader extends React.Component<IPropsReportHeader, any> {
  context!: ETSCore.LegacyContext;

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperations();
  }
  getState() {
    const { technical_operations_ids = '' } = this.props;

    return {
      technical_operations_ids,
    };
  }
  handleSubmit = () => {
    const { technical_operations_ids } = this.getState();

    const techOpIdsArray =
      typeof technical_operations_ids === 'string'
        ? [technical_operations_ids]
        : technical_operations_ids;

    const requestBody = {
      technical_operations_ids: `[${[...techOpIdsArray].join(',')}]`,
    };

    this.props.onClick(
      technical_operations_ids !== ''
        ? requestBody
        : omit(requestBody, 'technical_operations_ids'),
    );
  };
  render() {
    const { technical_operations_ids } = this.getState();

    const { technicalOperationsList = [], readOnly } = this.props;

    const TECH_OPERATION_TYPES = technicalOperationsList
      .filter((route) => route.objects_text.includes('ОДХ'))
      .map((t) => ({ value: t.id, label: t.name }));

    return (
      <EtsBootstrap.Row className="headerRow">
        <ColorForTable />
        <EtsBootstrap.Col lg={10} md={9}>
          <ExtField
            type="select"
            label="Технологическая операция"
            multi
            options={TECH_OPERATION_TYPES}
            value={technical_operations_ids}
            onChange={this.props.handleChange}
            boundKeys={'technical_operations_ids'}
            disabled={readOnly}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col lg={2} md={3} style={{ marginTop: 25 }}>
          <EtsBootstrap.Button block onClick={this.handleSubmit} disabled={readOnly}>
            Сформировать отчет
          </EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
