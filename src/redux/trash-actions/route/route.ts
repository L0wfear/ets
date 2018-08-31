import {
  getRouteDataById
} from 'redux/trash-actions/route/promise';

export const loadRouteDataById = (type, id) => ({
  type,
  payload: getRouteDataById(id).then(({ route_data }) => ({
      route_data,
    })
  )
});
