import { Actions } from 'flummox';
import { logout } from '../adapter.js';
import _ from 'lodash';
import { TechnicalOperationObjectsService } from 'api/Services';

export default class TechnicalOperationsActions extends Actions {

  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }

}
