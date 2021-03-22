import { flow as flow_fp } from 'lodash/fp';
import { withProps } from 'recompose';

import {
  fileFormatter,
  fileCountLimiter,
} from 'components/old/compositions/file-input';

import BaseField from 'components/@next/@ui/renderFields/Field';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

// что-то не зашло
const flow: any = flow_fp;

const BaseFileField = withProps<{type: string;}, any>({
  type: 'file',
})(BaseField);

type OwnProps = {

} & (
  | {
    showPrintBtn?: never;
    getFileAction?: never;
    allowedFormats?: never;
    }
  | {
    showPrintBtn: boolean;
    getFileAction: (url: string, meta: LoadingMeta) => EtsAction<Promise<{blob: Blob; fileName: string;}>>;
    allowedFormats: Array<string>;
  }
);

export const FileField: React.ComponentType<OwnProps & { boundKeys: string; } & Record<string, any>> = flow(
  fileCountLimiter,
  fileFormatter,
)(BaseFileField);
