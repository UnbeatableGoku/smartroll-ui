import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import { PAGE_USER_MANAGEMENT } from '@constants/page'

import BackButton from '@components/common/backButton'
import FormLayout from '@components/common/formLayout'

export type CreateUserFields = {
  firstName: string
  lastName: string
  email: string
  password: string
  isActive?: boolean
  isEditor?: boolean
  role?: string
  pageAccess?: (string | undefined)[] | undefined
}

const CreateUserPage = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(PAGE_USER_MANAGEMENT.path)
  }

  return (
    <>
      <Helmet>
        <title>Smart Roll | Create User </title>
      </Helmet>

      <BackButton handleBack={handleBack} />

      <FormLayout>
        <form></form>
      </FormLayout>
    </>
  )
}

export default CreateUserPage
