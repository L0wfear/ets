import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';

const payload = { operation: 'material_consumption' };

const useMeasureUnitMaterialConsumptionOptions = (meta: LoadingMeta) => {
  return useMeasureUnitOptions(payload, meta);
};

export default useMeasureUnitMaterialConsumptionOptions;
