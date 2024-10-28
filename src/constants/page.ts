import { Page } from 'types/common'

export const PAGE_LOGIN: Page = {
  id: 'LOGIN',
  path: '/login',
  name: 'Login',
}

export const PAGE_DASHBOARD: Page = {
  id: 'DASHBOARD',
  path: '/',
  name: 'Dashboard',
}

export const PAGE_NOT_FOUND: Page = {
  id: 'NOT_FOUND',
  path: '/not-found',
  name: 'Page Not Found',
}


/**
 * --------------------------------------------------------------------------
 *                      PROTECTED PAGES
 * --------------------------------------------------------------------------
 *
 */

/**
 * -------------------- User Management --------------------------------------
 */

export const PAGE_USER_MANAGEMENT: Page = {
  id: 'USER_MANAGEMENT',
  path: '/user-management',
  name: 'User Management',
}


export const PAGE_ADD_USER: Page = {
  id: 'CREATE_USER',
  path: PAGE_USER_MANAGEMENT.path + '/add',
  name: 'Add User',
}
export const PAGE_EDIT_USER: Page = {
  id: 'USER_MANAGEMENT',
  path: PAGE_USER_MANAGEMENT.path + '/edit',
  name: 'Edit User',
}

export const PROTECTED_PAGES: Page[] = [PAGE_USER_MANAGEMENT]
