import * as React from 'react';
import styled from 'styled-components';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import Div from 'components/old/ui/Div';
import { UiConstants } from 'components/@next/@ui/renderFields/UiConstants';
import { ColorSpan } from 'global-styled/global-styled';
import { SensorDut } from 'redux-main/reducers/modules/some_uniq/sensor_dut/@types';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';
import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

const meta = [
  {
    name: 'dut',
    displayName: 'ДУТ',
    type: 'string',
  },
  {
    name: 'status',
    displayName: 'Статус',
    type: 'string',
  },
  {
    name: 'period',
    displayName: 'Период тарировки',
    type: 'string',
  },
];

const DutBlock = styled(Div)`
  display: flex;
  align-items: center;
  padding: 0 0 12px 0;
`;

const InfoPopover = styled(EtsBootstrap.Glyphicon)`
  font-size: large;
  padding: 0 10px;
`;

const RefreshButton = styled(EtsBootstrap.Button)`
  background: transparent!important;
  color: #4c4c4c!important;
  padding: 0px!important;
  min-height: 0px!important;
  &:hover {
    color: ${UiConstants.colorError}!important;
  }
`;

const BrokenDutBlock = styled(ColorSpan)`
  margin-left: 15px;
`;

const NoDataParagraph = styled.p`
  margin: 14px 0;
`;

type Props = {
  dutData: Array<SensorDut>;
  status: string;
  refresh(): void;
  isLoading: boolean;
};

const DutSensor: React.FC<Props> = React.memo(
  (props) => {
    const isBroken = props.dutData.length > 0 && props.dutData.filter((sensor) => sensor.is_broken === true);
    const data = props.dutData.map((sensor) => {
      return {
        dut: `${sensor.type_name} - ${sensor.sensor_number} - ${sensor.sensor_protocol_id}`,
        status: `${sensor.is_broken ? 'Неисправен' : 'Исправен'}`,
        period: `${makeDateFormated(sensor.tar_start_date, false)} - ${makeDateFormated(sensor.tar_end_date, false)}`,
      };
    });

    if (props.isLoading) {
      return (
        <Div>
          <label>ДУТ </label>
          <br/>
          <PreloadNew typePreloader="field" />
        </Div>
      );
    } else {
      return <>
        {props.dutData.length ? (
          <>
            <DutBlock>
              <label>ДУТ </label>
              <EtsBootstrap.OverlayTrigger
                trigger={['hover', 'focus']}
                overlay={(
                  <EtsBootstrap.Popover
                    id="popover-dut"
                    title="Информация по ДУТ">
                    <EtsBootstrap.TableOld striped bordered width="500px">
                      <EtsBootstrap.Grid.GridBootstrapThead.Thead>
                        <EtsBootstrap.Grid.GridBootstrapThead.Tr>
                          {meta.map((col) => {
                            return (
                              <EtsBootstrap.Grid.GridBootstrapThead.Th
                                alignCenter>{col.displayName}</EtsBootstrap.Grid.GridBootstrapThead.Th>
                            );
                          })}
                        </EtsBootstrap.Grid.GridBootstrapThead.Tr>
                      </EtsBootstrap.Grid.GridBootstrapThead.Thead>
                      <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
                        {data.map((row, indexRow) => (
                          <EtsBootstrap.Grid.GridBootstrapTbody.Tr borderedTd key={indexRow} registryKey="dut_table">
                            <EtsBootstrap.Grid.GridBootstrapTbody.Td>{row.dut}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                            <EtsBootstrap.Grid.GridBootstrapTbody.Td>{row.status}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                            <EtsBootstrap.Grid.GridBootstrapTbody.Td>{row.period}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
                          </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
                        ))
                        }
                      </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
                    </EtsBootstrap.TableOld>
                  </EtsBootstrap.Popover>
                )}
                placement="top"
              >
                <InfoPopover glyph="info-sign"/>
              </EtsBootstrap.OverlayTrigger>
              {(props.status !== 'deleted' && props.status !== 'closed') && (
                <RefreshButton id="dut-refresh" onClick={props.refresh}>
                  <EtsBootstrap.Glyphicon
                    glyph="refresh"
                  />
                </RefreshButton>
              )}
            </DutBlock>
            <div>
              Количество установленных ДУТ: {props.dutData.length}
              <BrokenDutBlock
                color={isBroken.length > 0 ? 'red' : 'black'}>Неисправно: {isBroken.length ? isBroken.length : '0'}</BrokenDutBlock>
            </div>
          </>
        ) : (
          <>
            <label>ДУТ </label>
            <NoDataParagraph>Нет данных</NoDataParagraph>
          </>
        )}
      </>;
    }
  }
);

export default DutSensor;
