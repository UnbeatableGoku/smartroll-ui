import UserManagement from '@pages/user'
import CreateUserPage from '@pages/user/createUser'
import EditUserPage from '@pages/user/editUser'
import { RouteObject, redirect } from 'react-router-dom'

import {
  PAGE_ADD_USER,
  PAGE_EDIT_USER,
  PAGE_NOT_FOUND,
  PAGE_USER_MANAGEMENT,
} from '@constants'

const VIEW_ONLY_ROUTES: RouteObject[] = [
  // ----------------- User management -----------------
  {
    path: PAGE_USER_MANAGEMENT.path,
    element: <UserManagement />,
  },
]
const EDITOR_ROUTES: RouteObject[] = [
  {
    path: PAGE_ADD_USER.path,
    element: <CreateUserPage />,
  },
  {
    path: `${PAGE_EDIT_USER.path}/:userId`,
    element: <EditUserPage />,
    loader: async ({}) => {
      try {
        

        // const { data } = await getUser(params.userId!)
        // return data
      } catch {
        return redirect(PAGE_NOT_FOUND.path)
      }
    },
  },
]

export { VIEW_ONLY_ROUTES, EDITOR_ROUTES }
