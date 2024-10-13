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

export { checkPageAccess }
