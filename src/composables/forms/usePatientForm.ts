import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { validateCpf } from '@/lib/formatters'
import type { PatientRequest } from '@/api/types'

const patientSchema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  cpf: yup
    .string()
    .required('CPF é obrigatório')
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido')
    .test('cpf-valid', 'CPF inválido', value => validateCpf(value ?? '')),
  susNumber: yup
    .string()
    .nullable()
    .transform(v => (v === '' ? null : v))
    .matches(/^\d{15}$/, 'Cartão SUS deve ter 15 dígitos'),
  email: yup.string().nullable().email('Email inválido'),
  phone: yup.string().required('Telefone é obrigatório'),
  birthDate: yup
    .string()
    .required('Data de nascimento é obrigatória')
    .test('past-date', 'Data deve ser no passado', value => {
      if (!value) return false
      return new Date(value) < new Date()
    }),
})

export function usePatientForm(initialValues?: Partial<PatientRequest>) {
  return useForm<PatientRequest>({
    validationSchema: patientSchema,
    initialValues: {
      name: '',
      cpf: '',
      susNumber: '',
      email: '',
      phone: '',
      birthDate: '',
      ...initialValues,
    },
  })
}
