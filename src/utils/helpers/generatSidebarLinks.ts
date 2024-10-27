import size from 'lodash/size'

import { SIDEBAR_LINKS } from '@constants'

import { SidebarLink } from 'types/common'

import { checkPageAccess } from './authorization'

const generateSidebarLinks = (permissoionsList: string[]): SidebarLink[] => {
  if (!size(permissoionsList)) return []

  const validLinks: SidebarLink[] = []

  SIDEBAR_LINKS.forEach((page) => {
    const hasPermissionForParent = checkPageAccess(page.id, permissoionsList)

    //checking permission for 'parent' links which dont have child link
    if (hasPermissionForParent) validLinks.push(page)
    //checking permissions for 'child' links
    else if (page.children && page.children.length > 0) {
      //checking whether sub links have access

      //filtering all sub links
      const validChildPages = page.children.filter((subPage) =>
        checkPageAccess(subPage.id, permissoionsList),
      )

      if (validChildPages && validChildPages.length > 0) {
        validLinks.push({ ...page, children: validChildPages })
      }
    }
  })
  return validLinks
}
export { generateSidebarLinks }
