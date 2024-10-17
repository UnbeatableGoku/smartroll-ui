import { TextField } from '../form'
import { CreateUserFields } from '@pages/user/createUser'
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  useWatch,
} from 'react-hook-form'

import { userFormFields as UFF } from './fields'

interface UserDetailsFormProps<T extends FieldValues = CreateUserFields> {
  isUpdatePage?: boolean
  isAdmin?: boolean
  control: Control<T | CreateUserFields>
  errors: FieldErrors<CreateUserFields>
  register: UseFormRegister<T | CreateUserFields>
}

const UserDetailsForm = <T extends FieldValues = CreateUserFields>({
  control,
  register,
  errors,
  isUpdatePage = false,
  isAdmin = false,
}: UserDetailsFormProps<T>) => {
  const role = useWatch({
    control,
    name: UFF.ROLE.key,
  })

  return (
    <div>
      <TextField
        required={isUpdatePage}
        label={UFF.FIRST_NAME.label}
        name={UFF.FIRST_NAME.key}
        error={errors?.[UFF.FIRST_NAME.key]?.message}
        register={register}
      />
    </div>
  )
}

export default UserDetailsForm
