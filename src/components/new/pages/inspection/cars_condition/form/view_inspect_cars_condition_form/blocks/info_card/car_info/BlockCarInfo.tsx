import * as React from 'react';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import withForm from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { getDefaultCarsConditionCarElement } from './utils';
import { BlockCarInfoOwnProps, BlockCarInfoProps } from './@types/BlockCarInfo';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { carsConditionCarFormSchema } from './schema';
import BlockCarInfoMainData from './blocks/main_data/BlockCarInfoMainData';

const BlockCarInfo: React.FC<BlockCarInfoProps> = React.memo(
  (props) => {
    const {
      formState: state,
      IS_CREATING,
    } = props;

    return (
      <div>
        <h4>Карточка выбранного ТС</h4>
        <BlockCarInfoMainData
          IS_CREATING={IS_CREATING}
          formState={state}
          handleChange={props.handleChange}
        />
      </div>
    );
  },
);

export default withForm<BlockCarInfoOwnProps, CarsConditionCars>({
  uniqField: 'id',
  mergeElement: (props) => {
    return getDefaultCarsConditionCarElement(props.element);
  },
  schema: carsConditionCarFormSchema,
  permissions: inspectCarsConditionPermissions,
})(BlockCarInfo);
