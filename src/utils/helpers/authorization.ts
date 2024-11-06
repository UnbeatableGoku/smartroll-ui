import { PROTECTED_PAGES } from '@constants'

/**
 * Verifies the user have access to page or not
 */
const checkPageAccess = (
  pageId: string,
  permissoionsList: string[],
): boolean => {
  const access = false

  if (!permissoionsList || !pageId) return access

  return permissoionsList.includes(pageId)
}

/**
 * Give the page inof by passing path name
 */
const getPageInfoByPathName = (path: string) => {
  const parentPath = `/${path.split('/')[1] || ''}`

  return PROTECTED_PAGES.filter((page) => page.path === parentPath)[0]
}

export { checkPageAccess, getPageInfoByPathName }
