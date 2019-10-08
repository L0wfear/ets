import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { DivNone } from 'global-styled/global-styled';
import { CarsConditionCars, InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import BlockCarInfoWrap from './car_info';
import PreparePlan from './prepare_plan';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
// import { Switch } from 'react-router-dom';

type BlockInfoCardOwnProps = {
  carsConditionCarsList: CarsConditionCars[];
  type: keyof typeof INSPECT_TYPE_FORM;
  callBackToLoadCars: () => Promise<void>;
  page: string;
  isHasPeriod: boolean;
  isPermitted: boolean;

  types_cars: InspectCarsCondition['data']['types_cars'];
  types_harvesting_unit: InspectCarsCondition['data']['types_harvesting_unit'];
  canSavePreparePlanHandler: (value: boolean) => any;
  handleChangeData: (ownObj: Partial<InspectCarsCondition['data']>) => any;
};
type BlockInfoCardProps = (
  BlockInfoCardOwnProps
  & WithSearchProps
);

const BlockInfoCard: React.FC<BlockInfoCardProps> = React.memo(
  (props) => {
    const {
      isHasPeriod,
    } = props;
    const typeRightView = props.match.params.typeRightView;

    React.useEffect(
      () => {
        const triggerOnNotMatchCheckPeriod = (
          !isHasPeriod
          && typeRightView === 'prepare_plan'
        );

        const triggerOnWrongPath = (
          typeRightView
          && typeRightView !== 'prepare_plan'
          && typeRightView !== 'car_info'
        );

        if (triggerOnNotMatchCheckPeriod || triggerOnWrongPath) {
          props.setParams({
            typeRightView: null,
          });
        }
      },
      [isHasPeriod, typeRightView, props.setParams, props.match.params],
    );

    const handleHide = React.useCallback(
      () => {
        props.setParams({
          typeRightView: null,
        });
      },
      [props.setParams],
    );

    const handleHideCarInfo = React.useCallback(
      (isSubmitted) => {
        handleHide();
        if (isSubmitted) {
          props.callBackToLoadCars();
        }
      },
      [handleHide, props.callBackToLoadCars],
    );

    if (typeRightView === 'car_info') {
      return (
        <BlockCarInfoWrap
          handleHide={handleHideCarInfo}
          carsConditionCarsList={props.carsConditionCarsList}
          handleChangeData={props.handleChangeData}
          type={props.type}
          page={props.page}
        />
      );
    }

    if (typeRightView === 'prepare_plan') {
      // @todo
      return (
        <PreparePlan
          types_cars={props.types_cars}
          types_harvesting_unit={props.types_harvesting_unit}
          canSavePreparePlanHandler={props.canSavePreparePlanHandler}
          handleChangeData={props.handleChangeData}
          inspectType={props.type}
          isPermitted={props.isPermitted}

          page={props.page}
        />
      );
    }

    return (
      <DivNone />
    );
  },
);

export default withSearch<BlockInfoCardOwnProps>(BlockInfoCard);
