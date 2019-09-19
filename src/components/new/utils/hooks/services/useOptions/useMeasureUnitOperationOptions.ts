import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';

const payload = { type: 'operation' };

const useMeasureUnitOperationOptions = (meta: LoadingMeta) => {
  return useMeasureUnitOptions(payload, meta);
};

export default useMeasureUnitOperationOptions;
