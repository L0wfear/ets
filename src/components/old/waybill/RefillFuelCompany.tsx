import * as React from 'react';
import Table from 'components/old/waybill/Table';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { BorderDash } from 'global-styled/global-styled';
import styled from 'styled-components';
import { OneRefillFuelCompanyData } from 'redux-main/reducers/modules/some_uniq/refill_fuel_company/@types';
import { createValidDateTimeDots } from 'components/@next/@utils/dates/dates';

type Props = {
  refills: OneRefillFuelCompanyData['refills'];
};

const RefillFuelCompanyStyled = styled.div`
  ${BorderDash} {
    padding: 15px;
  }
`;

const tableOptions = {
  tableCaptions: [
    {
      value: 'Топливная карта',
      width: 250,
    },
    {
      value: 'Тип топлива',
      width: 100,
    },
    {
      value: 'Дата',
      width: 75,
    },
    {
      value: 'Выдано, л',
      width: 125,
    },
  ],
  tableCols: [
    'number',
    'fuel_type_text',
    'refill_at',
    'fuel_given',
  ],
  tableCellRenderers: {
    number: (number) => number || '-',
    fuel_type_text: (fuel_type_text) => fuel_type_text || '-',
    refill_at: (refill_at) => createValidDateTimeDots(refill_at) || '-',
    fuel_given: (fuel_given) => fuel_given || '-',
  }
};

const RefillFuelCompany: React.FC<Props> = React.memo(
  (props) => {
    return (
      <RefillFuelCompanyStyled>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <h3>Заправка по данным топливной компании</h3>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <BorderDash
              width={1}
              borderStyle="solid"
              color={UiConstants.colorGrey}>
              <EtsBootstrap.Row>
                <EtsBootstrap.Col md={12}>
                  {
                    Boolean(props.refills?.length)
                      ? <Table
                        id={'refills'}
                        title="Заправка по данным топливной компании"
                        columnCaptions={tableOptions.tableCaptions}
                        data={props.refills}
                        tableCols={tableOptions.tableCols}
                        pageSize={10}
                        cellRenderers={tableOptions.tableCellRenderers}
                        onRowSelected={undefined}
                      />
                      : 'В рамках действия путевого листа на текущий момент данных по заправкам получено не было'
                  }
                </EtsBootstrap.Col>
              </EtsBootstrap.Row>
            </BorderDash>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </RefillFuelCompanyStyled>
    );
  },
);

export default RefillFuelCompany;
