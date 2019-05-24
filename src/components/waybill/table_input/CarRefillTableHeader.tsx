import * as React from 'react';
import ButtonCreateFuelCard from './fuel_card/ButtonCreateFuelCard';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { EtsHeaderContainer } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { isNullOrUndefined } from 'util';

type CarRefillTableHeaderProps = {
  selectedRowIndex: number;
  onChange: any;
  array: any[];

  meta: any[];
  addName?: string;
  removeName?: string;
  visibleButtons?: boolean;
  page: string;
  structure_id: Waybill['structure_id'];
  fuel_type: Waybill['fuel_type'];
  handleUpdateFuelCards: any;
  title: string;
  noHasFuelCardIdOptions: boolean;
  buttonWidth: number;
};

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
      <EtsBootstrap.Row>
        <EtsHeaderContainer>
          <EtsHeaderTitle>
            {props.title}
          </EtsHeaderTitle>
          <EtsButtonsContainer>
            {
              props.visibleButtons
                && (
                  <ButtonTableInput block width={props.buttonWidth} onClick={handleAddRow}>Добавить заправку</ButtonTableInput>
                )
            }
            {
              props.visibleButtons
                && (
                  <ButtonTableInput block width={props.buttonWidth} onClick={handleRemoveRow} disabled={isNullOrUndefined(props.selectedRowIndex)}>Удалить заправку</ButtonTableInput>
                )
            }
            {
              props.visibleButtons && (
                <ButtonCreateFuelCard
                  handleUpdateFuelCards={props.handleUpdateFuelCards}
                  structure_id={props.structure_id}
                  fuel_type={props.fuel_type}
                  buttonWidth={props.buttonWidth}
                  page={props.page}
                />
              )
            }
          </EtsButtonsContainer>
        </EtsHeaderContainer>
      </EtsBootstrap.Row>
    );
  },
);

export default CarRefillTableHeader;
