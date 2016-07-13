import ExtendableError from './ExtendableError.js';

class RequestWarningError extends ExtendableError {
  constructor(m) {
    super(m);
  }
}

export default RequestWarningError;
