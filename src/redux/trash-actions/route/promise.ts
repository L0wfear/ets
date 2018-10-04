import {
  RouteService,
} from 'api/Services';


export const getRouteDataById = (id) => (
  RouteService.get({ id })
    .then(({ result: [route_data = null] }) => {
      if (route_data) {
        // Что здесь происходит???
        // Надо ли это ?!
        if (route_data.type === 'points') {
          route_data.object_list.forEach((el) => {
            if (!el.shape && el.coordinates) {
              el.shape = {
                type: 'Point',
                coordinates: el.coordinates,
              };
            }
            return el;
          });
        } else if (route_data.type === 'mixed') {
          route_data.draw_odh_list = [];
  
          if (route_data.input_lines && route_data.input_lines.length) {
            route_data.input_lines.forEach((object) => {
              const start = [object.begin.x_msk, object.begin.y_msk];
              const end = [object.end.x_msk, object.end.y_msk];
              object.shape = {
                type: 'LineString',
                coordinates: [start, end],
              };
              return object;
            });
          } else {
            route_data.input_lines = [];
          }
          route_data.draw_object_list.forEach((object) => {
            const start = [object.begin.x_msk, object.begin.y_msk];
            const end = [object.end.x_msk, object.end.y_msk];
            object.shape = {
              type: 'LineString',
              coordinates: [start, end],
            };
            return object;
          });
  
          route_data.object_list.forEach((object, i) => {
            if (object.from_vectors) {
              route_data.draw_odh_list.push(object);
              route_data.input_lines.push(object);
              route_data.object_list.splice(i, 1);
            }
          });
        }
      }

      return {
        route_data,
      };
    })
    .catch((error) => {
      console.warn(error);

      return {
        route_data: null,
      };
    })
)