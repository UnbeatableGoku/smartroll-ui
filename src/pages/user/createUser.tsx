import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { PAGE_USER_MANAGEMENT, ROLES } from '@constants'

import { addUserSchema } from '@utils/schema/authSchema'

import BackButton from '@components/common/backButton'
import { Button } from '@components/common/form'
import FormLayout from '@components/common/formLayout'
import { UserDetailsForm } from '@components/common/userManagement'

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

  // const {user} = useAuth()

  const user = {
    role: 'ADMIN',
  }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUserSchema),
  })

  const handleBack = () => {
    navigate(PAGE_USER_MANAGEMENT.path)
  }

  const handleCreateUser = (data: CreateUserFields) => {
    console.log(data)
  }

  return (
    <>
      <Helmet>
        <title>Smart Roll | Create User </title>
      </Helmet>

      <BackButton handleBack={handleBack} />

      <FormLayout>
        <form
          className="w-full max-w-3xl 2xl:max-w-4xl"
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <UserDetailsForm
            isAdmin={user.role === ROLES.ADMIN}
            register={register}
            control={control}
            errors={errors}
          />
          {/* Actions : update | cancle */}
          <div className="mt-6 flex w-72 gap-x-4">
            <Button label="Create user" className="w-full" />
            <Button
              type="button"
              className="w-full"
              variant="outline"
              label={'Cancel'}
              onClick={handleBack}
            />
          </div>
        </form>
      </FormLayout>
    </>
  )
}

export default CreateUserPage
