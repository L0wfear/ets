import { Actions } from 'flummox';
import { TechnicalOperationObjectsService } from 'api/Services';

export default class TechnicalOperationsActions extends Actions {
  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }
}
