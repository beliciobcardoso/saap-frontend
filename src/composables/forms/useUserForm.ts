import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { UserRequest } from '@/api/types'

const userSchema = yup.object({
  email: yup.string().required('Email é obrigatório').email('Email inválido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Mínimo 6 caracteres'),
  role: yup
    .string()
    .oneOf(['ADMIN', 'RECEPTIONIST', 'PROFESSIONAL', 'ASSISTANT', 'PATIENT'])
    .required('Função é obrigatória'),
})

export function useUserForm(initialValues?: Partial<UserRequest>) {
  return useForm<UserRequest>({
    validationSchema: userSchema,
    initialValues: {
      email: '',
      password: '',
      role: 'RECEPTIONIST',
      ...initialValues,
    },
  })
}
