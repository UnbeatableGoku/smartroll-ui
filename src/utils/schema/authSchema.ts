import * as yup from 'yup'

import { EMAIL_REGEX, PASSWORD_REGEX } from '@constants'

const PASSWORD_MESSAGE =
  'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'

export const addUserSchema = yup
  .object()
  .shape({
    firstName: yup.string().trim().required('First Name is required field'),
    lastName: yup.string().trim().required('Last Name is required field'),
    email: yup
      .string()
      .trim()
      .matches(EMAIL_REGEX, 'Please Enter a valid email.')
      .required('Email is required field'),
    password: yup.string().matches(PASSWORD_REGEX, PASSWORD_MESSAGE).required(),
    pageAccess: yup
      .array()
      .of(yup.string())
      .min(1, 'Please Select atleast one Page access.'),
    isEditor: yup.boolean(),
    isActive: yup.boolean(),
    role: yup.string(),
  })
  .required()
