import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { ProfessionalRequest } from '@/api/types'

const professionalSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('Email é obrigatório').email('Email inválido'),
  phone: yup.string().required('Telefone é obrigatório'),
  registrationNumber: yup.string().required('Registro profissional é obrigatório'),
  role: yup.string().oneOf(['PROFESSIONAL', 'ASSISTANT']).required('Função é obrigatória'),
})

export function useProfessionalForm(initialValues?: Partial<ProfessionalRequest>) {
  return useForm<ProfessionalRequest>({
    validationSchema: professionalSchema,
    initialValues: {
      name: '',
      email: '',
      phone: '',
      registrationNumber: '',
      role: 'PROFESSIONAL',
      ...initialValues,
    },
  })
}
