import * as React from 'react';
import { Row, Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';
import { isNullOrUndefined } from 'util';
import ButtonCreateFuelCard from './fuel_card/ButtonCreateFuelCard';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { SpanRed } from 'global-styled/global-styled';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';

type CarRefillTableHeaderProps = {
  selectedRowIndex: number;
  onChange: any;
  array: any[];

  meta: any[];
  addName?: string;
  removeName?: string;
  visibleButtons?: boolean;
  disabled?: boolean;
  page: string;
  structure_id: Waybill['structure_id'];
  fuel_type: Waybill['fuel_type'];
  handleUpdateFuelCards: any;
  canEditIfClose: boolean;
  title: string;
  noHasFuelCardIdOptions: boolean;
  buttonWidth: number;
};

const popover = (
  <Popover>
    Необходимо добавить топливную карту в справочнике "НСИ-Транспортные средства-Реестр топливных карт" или по кнопке "Создать топл.карту"
  </Popover>
);

const CarRefillTableHeader: React.FC<CarRefillTableHeaderProps> = React.memo(
  (props) => {
    const handleAddRow = React.useCallback(
      () => {
        props.onChange([
          ...props.array,
          props.meta.reduce((emptyRow, { key }) => {
            emptyRow[key] = null;

            return emptyRow;
          }, {}),
        ]);
      },
      [props.array, props.onChange],
    );

    const handleRemoveRow = React.useCallback(
      () => {
        props.onChange(
          props.array.filter((_, index) => index !== props.selectedRowIndex),
        );
      },
      [props.selectedRowIndex, props.onChange, props.array],
    );

    return (
      <Row>
        <EtsHeaderContainer>
          <EtsHeaderTitle>
            <span>
              {props.title}&nbsp;
            </span>
            {
              props.noHasFuelCardIdOptions && (
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  overlay={popover}
                  placement="top"
                >
                  <SpanRed>
                    <Glyphicon glyph="exclamation-sign" />
                  </SpanRed>
                </OverlayTrigger>
              )
            }
          </EtsHeaderTitle>
          <EtsButtonsContainer>
            {
              props.visibleButtons
                && (
                  <ButtonTableInput block width={props.buttonWidth} onClick={handleAddRow} disabled={props.disabled}>Добавить заправку</ButtonTableInput>
                )
            }
            {
              props.visibleButtons
                && (
                  <ButtonTableInput block width={props.buttonWidth} onClick={handleRemoveRow}  disabled={isNullOrUndefined(props.selectedRowIndex) || props.disabled}>Удалить заправку</ButtonTableInput>
                )
            }
            {
              (props.visibleButtons || props.canEditIfClose) && (
                <ButtonCreateFuelCard
                  handleUpdateFuelCards={props.handleUpdateFuelCards}
                  structure_id={props.structure_id}
                  fuel_type={props.fuel_type}
                  disabled={props.disabled && !props.canEditIfClose}
                  buttonWidth={props.buttonWidth}
                  page={props.page}
                />
              )
            }
          </EtsButtonsContainer>
        </EtsHeaderContainer>
      </Row>
    );
  },
);

export default CarRefillTableHeader;
