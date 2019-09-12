import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  IPropsReportHeaderCommon,
  IPropsReportHeaderWrapper,
} from 'components/old/reports/common/@types/ReportHeaderWrapper.h';

import { getYesterday0am, createValidDate } from 'components/@next/@utils/dates/dates';
import { GEOZONE_OBJECTS } from 'constants/dictionary';

import ReportHeaderWrapper from 'components/old/reports/common/ReportHeaderWrapper';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';

interface IPropsReportHeader extends IPropsReportHeaderCommon, IPropsReportHeaderWrapper {
  report_date: Date;
  geozone_type: string;
}

class ReportHeader extends React.Component<IPropsReportHeader, any> {
  componentDidUpdate() {
    if (this.props.tableMeta.level !== 'company') {
      const { show_gov_numbers } = this.getState();
      if (show_gov_numbers) {
        this.handleChangeShowGovNumber(false);
      }
    }
  }
  getState() {
    const {
      report_date = createValidDate(getYesterday0am()),
      geozone_type = 'all',
      localState: {
        show_gov_numbers = false,
      },
    } = this.props;

    return {
      report_date,
      geozone_type,
      show_gov_numbers,
    };
  }
  handleSubmit = () => {
    const {
      report_date,
      geozone_type,
    } = this.getState();

    this.props.onClick({
      geozone_type,
      report_date,
    });
  }

  handleChangeShowGovNumber = (event: object | boolean) => {
    this.props.setLocalState({ show_gov_numbers: get(event, 'target.checked', event) });
  }

  render() {
    const { readOnly } = this.props;
    const {
      show_gov_numbers,
      report_date,
      geozone_type,
    } = this.getState();

    return (
      <EtsBootstrap.Row className="report-page__header">
        <EtsBootstrap.Col md={3}>
          <ExtField
            type="select"
            label="Объекты"
            options={GEOZONE_OBJECTS}
            value={geozone_type}
            boundKeys="object_type"
            onChange={this.props.handleChange}
            clearable={false}
            disabled={readOnly}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <ExtField
            type="date"
            time={false}
            label="Дата формирования"
            value={report_date}
            boundKeys="report_date"
            onChange={this.props.handleChange}
            disabled={readOnly}
            makeGoodFormat
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          {
            this.props.queryState.level === 'company' && (
              <React.Fragment>
                <FieldLabel>
                  &nbsp;
                </FieldLabel>
                <ExtField
                  type="boolean"
                  label={"Вывести с рег.номерами"}
                  value={show_gov_numbers}
                  className="checkbox-input flex-reverse"
                  onChange={this.handleChangeShowGovNumber}
                  disabled={readOnly}
                />
              </React.Fragment>
            )
          }
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={3}>
          <FieldLabel>
            &nbsp;
          </FieldLabel>
          <EtsBootstrap.Button
            block
            bsSize="small"
            onClick={this.handleSubmit}
            disabled={readOnly}
          >Сформировать отчет</EtsBootstrap.Button>
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default ReportHeaderWrapper(ReportHeader);
