import Model from './Model.js';

const MAP_INITIAL_CENTER = [-399.43090337943863, -8521.192605428025];
const MAP_INITIAL_ZOOM = 3;

/**
 * Пользователь
 * @extends Model
 */
export default class User extends Model {

  static get schema() {
    return {
      company_id: 'integer',
      company_name: 'string',
      companies: 'array',
      first_name: 'string',
      last_name: 'string',
      middle_name: 'string',
      login: 'string',
      role: 'string',
      permissions: 'array',
      user_id: 'integer',
      structures: 'array',
      structure_id: 'integer',
      map_config: 'object',
      fio: 'string',
      okrug_id: 'integer',
      okrug_name: 'string',
      stableRedirect: 'string',
    };
  }

  constructor(user = {}) {
    super();

    if (user === null) {
      user = {};
    }

    this.company_id = user.company_id;
    this.company_name = user.company_name;
    this.companies = user.companies || [];
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.middle_name = user.middle_name;
    this.login = user.login;
    this.role = user.role;
    this.user_id = user.user_id;
    this.structure_id = user.structure_id;
    this.structures = user.structures || [];
    this.map_config = user.map_config || {};
    this.fio = user.fio;
    this.permissions = user.permissions || [];
    this.okrug_id = user.okrug_id;
    this.okrug_name = user.okrug_name;
    this.stableRedirect = user.stableRedirect || '/login';
  }

  getCompanyMapConfig = () => {
    if (this.map_config && this.map_config.zoom && this.map_config.coordinates) {
      return this.map_config;
    }
    return {
      coordinates: MAP_INITIAL_CENTER,
      zoom: MAP_INITIAL_ZOOM,
    };
  }
}
