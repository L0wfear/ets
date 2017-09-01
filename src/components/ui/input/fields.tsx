import { flow } from 'lodash/fp';
import { withProps } from 'recompose';

import {
  dateTimeFormatter,
  onChangeWithKeys,
  multiSelectFormatter,
} from 'components/compositions/hoc';

import {
  fileFormatter,
  fileCountLimiter,
} from 'components/compositions/file-input';

import BaseField from 'components/ui/Field';

const BaseDataTimeField = withProps({
  type: 'date',
})(BaseField);

const BaseFileField = withProps({
  type: 'file',
})(BaseField);

const BaseMultiSelectField = withProps({
  type: 'select',
  multi: true,
})(BaseField);

export const DataTimeField = flow(
  dateTimeFormatter,
  onChangeWithKeys,
)(BaseDataTimeField);

export const MultiSelectField = flow(
  multiSelectFormatter,
  onChangeWithKeys,
)(BaseMultiSelectField);

export const FileField = flow(
  fileCountLimiter,
  fileFormatter,
  onChangeWithKeys,
)(BaseFileField);

export const Field = onChangeWithKeys(BaseField);
