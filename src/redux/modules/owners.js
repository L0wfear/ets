import { OwnersService } from 'api/Services';

const GET = 'ets/owners/GET';

const initialState = {
  list: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET:
      const { count } = state;
      return {
        list: [12]
      };
    default:
      return state;
  }
}

export function getOwners() {
  return {
    type: GET,
    payload: OwnersService.get()
  };
}
