import { TechInspectionArchiveService } from 'api/Services';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const promiseChangeArchiveStatus = async (id: TechInspection['id'], is_archive: boolean) => {
  await TechInspectionArchiveService.path(id).put({ is_archive }, false, 'json');

  return;
};