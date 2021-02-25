import { InsurancePolicyArchiveService } from 'api/Services';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const promiseChangeArchiveStatus = async (id: InsurancePolicy['id'], is_archive: boolean) => {
  await InsurancePolicyArchiveService.path(id).put({ is_archive }, false, 'json');

  return;
};
