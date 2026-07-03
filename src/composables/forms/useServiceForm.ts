import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { ServiceRequest } from '@/api/types'

const serviceSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(2, 'Mínimo 2 caracteres'),
  description: yup.string().nullable(),
  durationMinutes: yup
    .number()
    .required('Duração é obrigatória')
    .min(5, 'Mínimo 5 minutos')
    .max(480, 'Máximo 8 horas'),
  price: yup
    .number()
    .required('Preço é obrigatório')
    .min(0, 'Preço não pode ser negativo'),
})

export function useServiceForm(initialValues?: Partial<ServiceRequest>) {
  return useForm<ServiceRequest>({
    validationSchema: serviceSchema,
    initialValues: {
      name: '',
      description: '',
      durationMinutes: 30,
      price: 0,
      ...initialValues,
    },
  })
}
