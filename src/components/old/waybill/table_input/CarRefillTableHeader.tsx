import * as React from 'react';
import { isNullOrUndefined } from 'util';

import ButtonCreateFuelCard from './fuel_card/ButtonCreateFuelCard';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { EtsHeaderContainer, EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsButtonsContainer } from 'components/new/ui/registry/components/data/header/buttons/styled/styled';
import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';

export const CarRefillTableHeaderStyled = styled(EtsBootstrap.Row)`
  ${EtsHeaderContainerWrap} {
    padding: 0px 11px 0px 11px;
  }
`;

type CarRefillTableHeaderProps = {
  id: string;
  selectedRowIndex: number;
  onChange: any;
  array: Array<any>;

  meta: Array<any>;
  addName?: string;
  removeName?: string;
  visibleButtons?: boolean;
  page: string;
  structure_id: Waybill['structure_id'];
  fuel_type: Waybill['fuel_type'];
  handleUpdateFuelCard: any;
  title: string;
  noHasFuelCardIdOptions: boolean;
  buttonWidth: number;

  disabled: boolean;
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
      <CarRefillTableHeaderStyled>
        <EtsHeaderContainerWrap>
          <EtsHeaderContainer>
            <EtsHeaderTitle>
              {props.title}
            </EtsHeaderTitle>
            <EtsButtonsContainer>
              {
                props.visibleButtons
                  && (
                    <ButtonTableInput id={`${props.page}_${props.id}_refill_add_row`} block width={props.buttonWidth} onClick={handleAddRow} disabled={props.disabled}>Добавить заправку</ButtonTableInput>
                  )
              }
              {
                props.visibleButtons
                  && (
                    <ButtonTableInput id={`${props.page}_${props.id}_remove_row`} block width={props.buttonWidth} onClick={handleRemoveRow} disabled={props.disabled || isNullOrUndefined(props.selectedRowIndex)}>Удалить заправку</ButtonTableInput>
                  )
              }
              {
                props.visibleButtons && (
                  <ButtonCreateFuelCard
                    id={props.id}
                    handleUpdateFuelCard={props.handleUpdateFuelCard}
                    structure_id={props.structure_id}
                    fuel_type={props.fuel_type}
                    buttonWidth={props.buttonWidth}

                    disabled={props.disabled}
                    page={props.page}
                  />
                )
              }
            </EtsButtonsContainer>
          </EtsHeaderContainer>
        </EtsHeaderContainerWrap>
      </CarRefillTableHeaderStyled>
    );
  },
);

export default CarRefillTableHeader;
