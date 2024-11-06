import { useMemo } from 'react'

import { TextField } from '../form'
import CheckboxGroup from '../form/checkboxGroup'
import Dropdown from '../form/dropdown'
import { CreateUserFields } from '@pages/user/createUser'
import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  useWatch,
} from 'react-hook-form'

import { PAGE_USER_MANAGEMENT, PROTECTED_PAGES, ROLES } from '@constants'

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

  // options for Page access Permissions
  const pageAccessPermissionOptions = useMemo(() => {
    // initial all options
    let options = PROTECTED_PAGES

    // Excluding User management access for other users rather than ADMINS
    if (!isAdmin || role !== ROLES.ADMIN) {
      options = PROTECTED_PAGES.filter(
        (page) => page.id !== PAGE_USER_MANAGEMENT.id,
      )
    }

    return options.map((page) => ({
      label: page.name,
      value: page.id,
      disabled: false,
    }))
  }, [isAdmin, role])
  return (
    <div className="2xl:grid-col-3 grid w-full gap-x-16 gap-y-5 md:grid-cols-2">
      {/* First Name */}
      <TextField
        required={isUpdatePage}
        label={UFF.FIRST_NAME.label}
        name={UFF.FIRST_NAME.key}
        error={errors?.[UFF.FIRST_NAME.key]?.message}
        register={register}
      />

      {/* Last Name */}
      <TextField
        required={!isUpdatePage}
        label={UFF.LAST_NAME.label}
        name={UFF.LAST_NAME.key}
        error={errors?.[UFF.LAST_NAME.key]?.message}
        register={register}
      />

      {/* Email */}
      <TextField
        required={!isUpdatePage}
        disabled={isUpdatePage}
        label={UFF.EMAIL.label}
        name={UFF.EMAIL.key}
        error={errors?.[UFF.EMAIL.key]?.message}
        register={register}
      />

      {/* Password */}
      {isAdmin && (
        <TextField
          type="password"
          required={!isUpdatePage}
          label={UFF.PASSWORD.label}
          name={UFF.PASSWORD.key}
          error={errors?.[UFF.PASSWORD.key]?.message}
          hintText="Atleast 8 characters, capital letter, small letter and symbol"
          register={register}
        />
      )}

      {/* Role */}
      <Dropdown
        defaultValue={ROLES.USER}
        control={control}
        label={UFF.ROLE.label}
        name={UFF.ROLE.key}
        error={errors?.[UFF.ROLE.key]?.message}
        options={[
          { label: 'User', value: ROLES.USER, disabled: !isAdmin },
          {
            label: 'Admin',
            value: ROLES.ADMIN,
            disabled: !isAdmin,
          },
        ]}
      />

      {/* Page Access Permission */}
      <div className="row-span-4 w-full pt-1">
        <CheckboxGroup
          required={!isUpdatePage}
          control={control}
          label={UFF.PAGE_ACCESS.label}
          name={UFF.PAGE_ACCESS.key}
          error={errors?.[UFF.PAGE_ACCESS.key]?.message}
          options={pageAccessPermissionOptions}
          columns={2}
          includeSelectAll
        />
      </div>

      {/* Account Status */}
      <Dropdown
        defaultValue={true}
        control={control}
        label={UFF.IS_ACTIVE.label}
        name={UFF.IS_ACTIVE.key}
        error={errors?.[UFF.IS_ACTIVE.key]?.message}
        options={[
          { label: 'Active', value: true, disabled: false },
          { label: 'Inactive', value: false, disabled: false },
        ]}
      />

      {/* Permission */}
      <Dropdown
        defaultValue={false}
        control={control}
        label={UFF.IS_EDITOR.label}
        name={UFF.IS_EDITOR.key}
        error={errors?.[UFF.IS_EDITOR.key]?.message}
        options={[
          { label: 'Viewer', value: false, disabled: false },
          { label: 'Editor', value: true, disabled: false },
        ]}
      />
    </div>
  )
}

export default UserDetailsForm
