import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import * as sparePart from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part/actions';
import * as sparePartGroup from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/actions';
import * as measureUnit from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/actions';

export default {
  autobaseSetNewData,
  ...sparePart,
  ...sparePartGroup,
  ...measureUnit,
};
