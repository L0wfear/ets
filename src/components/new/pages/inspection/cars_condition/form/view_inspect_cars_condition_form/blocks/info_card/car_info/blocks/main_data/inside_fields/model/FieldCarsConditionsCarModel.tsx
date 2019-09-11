import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { BlockCarInfoProps } from '../../../../@types/BlockCarInfo';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import useSpecialModelOptionsByName from './useSpecialModelOptionsByName';
import { actionLoadSpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/actions';

type FieldCarsConditionsCarModelStateProps = {};
type FieldCarsConditionsCarModelDispatchProps = {
  actionLoadSpecialModel: HandleThunkActionCreator<typeof actionLoadSpecialModel>;
};
type FieldCarsConditionsCarModelOwnProps = {
  value: CarsConditionCars['model'];
  error: string;
  handleChange: BlockCarInfoProps['handleChange'];
  isPermitted: boolean;
  page: string;
  path?: string;
};
type FieldCarsConditionsCarModelMergedProps = (
  FieldCarsConditionsCarModelStateProps
  & FieldCarsConditionsCarModelDispatchProps
  & FieldCarsConditionsCarModelOwnProps
);

type FieldCarsConditionsCarModelProps = FieldCarsConditionsCarModelMergedProps;

const FieldCarsConditionsCarModel: React.FC<FieldCarsConditionsCarModelProps> = (props) => {
  const {
    specialModelOptions,
  } = useSpecialModelOptionsByName(
    props.actionLoadSpecialModel,
    props.page, props.path,
  );

  return (
    <ExtField
      type="select"
      label="Модель:"
      value={props.value}
      onChange={props.handleChange}
      options={specialModelOptions}
      error={props.error}
      clearable={false}
      boundKeys="model"
      disabled={!props.isPermitted}
    />
  );
};

export default compose<FieldCarsConditionsCarModelProps, FieldCarsConditionsCarModelOwnProps>(
  connect<FieldCarsConditionsCarModelStateProps, FieldCarsConditionsCarModelDispatchProps, FieldCarsConditionsCarModelOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionLoadSpecialModel: (...arg) => (
        dispatch(
          actionLoadSpecialModel(...arg),
        )
      ),
    }),
  ),
)(FieldCarsConditionsCarModel);
