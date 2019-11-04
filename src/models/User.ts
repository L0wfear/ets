import Model from './Model';

/**
 * Пользователь
 * @extends Model
 */
export default class User extends Model {
  company_id: number;
  company_name: string;
  companies: string;
  default_path: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  login: string;
  role: string;
  user_id: number;
  structure_id: number;
  structure_name: string;
  structures: string;
  map_config: any;
  fio: string;
  permissions: Array<string>;
  permissionsSet: Set<string>;
  okrug_id: number;
  okrug_name: string;
  stableRedirect: string;
  isGlavControl: boolean;
  isOkrug: boolean;
  isKgh: boolean;

  static get schema() {
    return {
      company_id: 'integer',
      company_name: 'string',
      companies: 'array',
      default_path: 'string',
      first_name: 'string',
      last_name: 'string',
      middle_name: 'string',
      login: 'string',
      role: 'string',
      permissions: 'array',
      permissionsSet: 'set',
      user_id: 'integer',
      structures: 'array',
      structure_id: 'integer',
      structure_name: 'string',
      map_config: 'object',
      fio: 'string',
      okrug_id: 'integer',
      okrug_name: 'string',
      stableRedirect: 'string',
      isGlavControl: 'boolean',
      isOkrug: 'boolean',
      isKgh: 'boolean',
    };
  }

  constructor(user: any = {}) {
    super();

    this.company_id = user.company_id;
    this.company_name = user.company_name;
    this.companies = user.companies || [];
    this.default_path = user.default_path || 'monitor';
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.middle_name = user.middle_name;
    this.login = user.login;
    this.role = user.role;
    this.user_id = user.user_id;
    this.structure_id = user.structure_id;
    this.structure_name = user.structure_name || '';
    this.structures = user.structures || [];
    this.map_config = user.map_config || {};
    this.fio = user.fio;
    this.permissions = user.permissions || [];
    this.permissionsSet = user.permissionsSet || new Set();
    this.okrug_id = user.okrug_id;
    this.okrug_name = user.okrug_name;
    this.stableRedirect = user.stableRedirect || '/login';
    this.isGlavControl = user.isGlavControl || false;
    this.isOkrug = user.isOkrug || false;
    this.isKgh = user.isKgh || false;
  }
}
