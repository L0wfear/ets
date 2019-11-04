import { flow as flow_fp } from 'lodash/fp';
import { withProps } from 'recompose';

import {
  fileFormatter,
  fileCountLimiter,
} from 'components/old/compositions/file-input';

import BaseField from 'components/@next/@ui/renderFields/Field';

// что-то не зашло
const flow: any = flow_fp;

const BaseFileField = withProps<{type: string;}, any>({
  type: 'file',
})(BaseField);

export const FileField: React.ComponentType<{ boundKeys: string; } & Record<string, any>> = flow(
  fileCountLimiter,
  fileFormatter,
)(BaseFileField);
