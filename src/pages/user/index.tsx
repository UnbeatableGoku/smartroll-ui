import { PlusIcon } from '@icons'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { PAGE_ADD_USER } from '@constants'

import { Button } from '@components/common/form'

const UserManagement = () => {
  const user = { isEditor: true }

  const navigate = useNavigate()
  return (
    <>
      <Helmet>
        <title>Smart Roll | User Management </title>
      </Helmet>

      {user.isEditor && (
        <Button
          label="Create New user"
          startIcon={<PlusIcon />}
          className="mb-5"
          onClick={() => navigate(PAGE_ADD_USER.path)}
        />
      )}
    </>
  )
}

export default UserManagement
