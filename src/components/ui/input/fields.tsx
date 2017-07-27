import { flow } from 'lodash/fp';

import { dateTimeFormatter, onChangeWithKeys, multiSelectFormatter } from 'components/compositions/hoc';
import BaseField from 'components/ui/Field';

export const DataTimeField = flow(
  dateTimeFormatter,
  onChangeWithKeys,
)(BaseField);

export const MultiSelectField = flow(
  multiSelectFormatter,
  onChangeWithKeys,
)(BaseField);

export const Field = onChangeWithKeys(BaseField);
