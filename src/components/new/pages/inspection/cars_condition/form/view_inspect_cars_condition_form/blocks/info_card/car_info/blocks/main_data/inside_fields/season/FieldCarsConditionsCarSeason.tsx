import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { BlockCarInfoProps } from '../../../../@types/BlockCarInfo';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { autobaseGetSetCarFuncTypes } from 'redux-main/reducers/modules/autobase/car_func_types/actions';

type FieldCarsConditionsCarSeasonStateProps = {};
type FieldCarsConditionsCarSeasonDispatchProps = {
  autobaseGetSetCarFuncTypes: HandleThunkActionCreator<typeof autobaseGetSetCarFuncTypes>;
};
type FieldCarsConditionsCarSeasonOwnProps = {
  value: CarsConditionCars['season'];
  error: string;
  handleChange: BlockCarInfoProps['handleChange'];
  isPermitted: boolean;
  page: string;
  path?: string;
};
type FieldCarsConditionsCarSeasonMergedProps = (
  FieldCarsConditionsCarSeasonStateProps
  & FieldCarsConditionsCarSeasonDispatchProps
  & FieldCarsConditionsCarSeasonOwnProps
);

type FieldCarsConditionsCarSeasonProps = FieldCarsConditionsCarSeasonMergedProps;

const seasonOptions = [
  { value: 'Лето', label: 'Лето' },
  { value: 'Зима', label: 'Зима' },
  { value: 'Всесезон', label: 'Всесезон' },
];

const FieldCarsConditionsCarSeason: React.FC<FieldCarsConditionsCarSeasonProps> = (props) => {
  return (
    <ExtField
      type="select"
      label="Сезон:"
      value={props.value}
      onChange={props.handleChange}
      options={seasonOptions}
      error={props.error}
      boundKeys="season"
      clearable={false}
      disabled={!props.isPermitted}
    />
  );
};

export default compose<FieldCarsConditionsCarSeasonProps, FieldCarsConditionsCarSeasonOwnProps>(
  connect<FieldCarsConditionsCarSeasonStateProps, FieldCarsConditionsCarSeasonDispatchProps, FieldCarsConditionsCarSeasonOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      autobaseGetSetCarFuncTypes: (...arg) => (
        dispatch(
          autobaseGetSetCarFuncTypes(...arg),
        )
      ),
    }),
  ),
)(FieldCarsConditionsCarSeason);
