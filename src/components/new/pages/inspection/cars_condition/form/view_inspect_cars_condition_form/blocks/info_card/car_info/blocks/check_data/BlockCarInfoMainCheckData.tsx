import * as React from 'react';
import { BlockCarInfoProps } from '../../@types/BlockCarInfo';
import ExtField from 'components/@next/@ui/renderFields/Field';
// import { stateExploitationOptions } from './options';
import { get } from 'lodash';
import { filedToCheckDefectDataDocs, filedToCheckDefectDataOtherSecond } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/blocks/check_data/filedToCheckCarInfoMainCheckData';
import BlockCarsConditionCarSelectPhotoDefect from './photo_defect/BlockCarsConditionCarSelectPhotoDefect';
import IAVisibleWarningContainer from 'components/new/pages/inspection/container/filed_to_check/IAVisibleWarningContainer';

type BlockCarInfoMainCheckDataProps = (
  {
    isPermitted: boolean;
  }
) & Pick<BlockCarInfoProps, 'IS_CREATING' | 'formState' | 'formErrors' | 'handleChange'>;

const BlockCarInfoMainCheckData: React.FC<BlockCarInfoMainCheckDataProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      isPermitted,
    } = props;

    const handleChangeDataForIA = React.useCallback(
      (data) => {
        props.handleChange({
          data: {
            ...props.formState.data,
            ...data,
          },
        });
      },
      [state.data, props.handleChange],
    );

    const handleChangeData = React.useCallback(
      (key, event) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [state.data, props.handleChange],
    );

    // const handleChangeDataBoolean = React.useCallback(
    //   (key, event) => {
    //     handleChangeData(key, get(event, 'target.checked', false));
    //   },
    //   [handleChangeData],
    // );

    return (
      <React.Fragment>
        <h4>Проверка документации</h4>
        <IAVisibleWarningContainer
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataDocs}
        />
        <h5>Прочее:</h5>
        <IAVisibleWarningContainer
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataOtherSecond}
        />
        <ExtField
          id="data-comments"
          type="text"
          label="Замечания:"
          value={state.data.comments}
          error={errors.data.comments}
          onChange={handleChangeData}
          boundKeys="comments"
          disabled={!props.isPermitted}
        />
        <BlockCarsConditionCarSelectPhotoDefect
          files={state.files}
          onChange={props.handleChange}
          isPermitted={isPermitted}
        />
      </React.Fragment>
    );
  },
);

export default BlockCarInfoMainCheckData;
