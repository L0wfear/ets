import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';

describe('Проверка проверки разрешений validatePermissions', () => {
  test('Если разрешение не определено', () => {
    const permissionsSet = new Set(
      ['permission'],
    );
    expect(validatePermissions(null, permissionsSet)).toBeTruthy();
    expect(validatePermissions(undefined, permissionsSet)).toBeTruthy();
  });

  test('Если разрешение boolean', () => {
    const permissionsSet = new Set(
      ['permission'],
    );
    expect(validatePermissions(true, permissionsSet)).toBeTruthy();
    expect(validatePermissions(false, permissionsSet)).toBeFalsy();
  });

  test('Если разрешение string', () => {
    const permissionsSet = new Set(
      ['permission'],
    );
    expect(validatePermissions('permission', permissionsSet)).toBeTruthy();
    expect(validatePermissions('not', permissionsSet)).toBeFalsy();
  });
  
  test('Если разрешение Array<string | boolean>', () => {
    const permissionsSet = new Set(
      ['permission'],
    );
    expect(validatePermissions(['permission'], permissionsSet)).toBeTruthy();
    expect(validatePermissions(['not'], permissionsSet)).toBeFalsy();
    expect(validatePermissions([true, 'not'], permissionsSet)).toBeTruthy();
    expect(validatePermissions([false, 'permission'], permissionsSet)).toBeTruthy();
    expect(validatePermissions([false, 'not'], permissionsSet)).toBeFalsy();
  });
});
