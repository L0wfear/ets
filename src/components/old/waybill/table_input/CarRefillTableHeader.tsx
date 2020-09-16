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
import { FuelCardOnCars } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import ExtField from 'components/@next/@ui/renderFields/Field';

export const CarRefillTableHeaderStyled = styled(EtsBootstrap.Row as any)`
  ${EtsHeaderContainerWrap} {
    padding: 0px 11px 0px 11px;
  }
`;

const StyledTest = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 3px;
`;

type CarRefillTableHeaderProps = {
  id: string;
  selectedRowIndex: number;
  onChange: any;
  array: Array<any>;
  errors: Array<any>;
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
  is_refill: boolean;
  is_refill_error: any;
  defaultHandleChange: any;
  disabled: boolean;
  fuel_card_on_cars?: Array<FuelCardOnCars>;
};

const CarRefillTableHeader: React.FC<CarRefillTableHeaderProps> = React.memo(
  (props) => {

    const handleChangeIsRefill = React.useCallback(() => {
      props.defaultHandleChange(isRefillKeys.boundKeys, !props.is_refill);
    }, [props.is_refill]);

    React.useEffect(() => {
      if(props.array.length && props.is_refill) {
        handleChangeIsRefill();
      }
    }, [props.array]);
    
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

    const isRefillKeys = React.useMemo(() => {
      const boundKeys
      = props.id === 'car_refill'
        ? 'is_fuel_refill'
        : props.id === 'gas_refill'
          ? 'is_gas_refill'
          : 'is_equipment_refill';

      return {
        boundKeys,
        id: boundKeys.replace('_', '-'), 
      };
    }, [props.is_refill]);

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
                    fuel_card_on_cars={props.fuel_card_on_cars}
                    disabled={props.disabled}
                    page={props.page}
                  />
                )
              }
            </EtsButtonsContainer>
          </EtsHeaderContainer>
          <StyledTest>
            <ExtField
              id={isRefillKeys.id}
              type='boolean'
              label={'Заправок не было'}
              value={props.is_refill}
              onChange={handleChangeIsRefill}
              disabled={Boolean(props.array.length)}
              boundKeys={isRefillKeys.boundKeys}
              error={props.is_refill_error}
            />
          </StyledTest>
        </EtsHeaderContainerWrap>
      </CarRefillTableHeaderStyled>
    );
  },
);

export default CarRefillTableHeader;
