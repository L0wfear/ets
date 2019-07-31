import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { BlockCarInfoProps } from '../../../../@types/BlockCarInfo';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import useLoadModelOptionsByTitle from './useLoadModelOptionsByTitle';
import { actionGetModelList } from 'redux-main/reducers/modules/some_uniq/modelList/actions';

type FieldCarsConditionsCarMarkaStateProps = {};
type FieldCarsConditionsCarMarkaDispatchProps = {
  actionGetModelList: HandleThunkActionCreator<typeof actionGetModelList>;
};
type FieldCarsConditionsCarMarkaOwnProps = {
  value: CarsConditionCars['marka'];
  error: string;
  handleChange: BlockCarInfoProps['handleChange'];
  isPermitted: boolean;
  page: string;
  path?: string;
};
type FieldCarsConditionsCarMarkaMergedProps = (
  FieldCarsConditionsCarMarkaStateProps
  & FieldCarsConditionsCarMarkaDispatchProps
  & FieldCarsConditionsCarMarkaOwnProps
);

type FieldCarsConditionsCarMarkaProps = FieldCarsConditionsCarMarkaMergedProps;

const FieldCarsConditionsCarMarka: React.FC<FieldCarsConditionsCarMarkaProps> = (props) => {
  const {
    modelOptions,
  } = useLoadModelOptionsByTitle(
    props.actionGetModelList,
    props.page, props.path,
  );

  return (
    <ExtField
      type="select"
      label="Марка:"
      value={props.value}
      onChange={props.handleChange}
      options={modelOptions}
      error={props.error}
      clearable={false}
      boundKeys="marka"
      disabled={!props.isPermitted}
    />
  );
};

export default compose<FieldCarsConditionsCarMarkaProps, FieldCarsConditionsCarMarkaOwnProps>(
  connect<FieldCarsConditionsCarMarkaStateProps, FieldCarsConditionsCarMarkaDispatchProps, FieldCarsConditionsCarMarkaOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetModelList: (...arg) => (
        dispatch(
          actionGetModelList(...arg),
        )
      ),
    }),
  ),
)(FieldCarsConditionsCarMarka);
