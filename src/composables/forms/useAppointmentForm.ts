import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { BookAppointmentRequest, PaymentMethod, PriorityLevel } from '@/api/types'

const bookAppointmentSchema = yup.object({
  patientId: yup.string().required('Paciente é obrigatório'),
  professionalId: yup.string().required('Profissional é obrigatório'),
  serviceId: yup.string().required('Serviço é obrigatório'),
  dateTime: yup
    .string()
    .required('Data e hora são obrigatórios')
    .test('future', 'Data deve ser futura', v => {
      if (!v) return false
      return new Date(v) > new Date()
    }),
  paymentMethod: yup.mixed<PaymentMethod>().required('Forma de pagamento é obrigatória'),
  declaredPriority: yup.mixed<PriorityLevel>().nullable(),
})

export function useAppointmentForm() {
  return useForm<BookAppointmentRequest>({
    validationSchema: bookAppointmentSchema,
    initialValues: {
      patientId: '',
      professionalId: '',
      serviceId: '',
      dateTime: '',
      paymentMethod: 'PIX',
      declaredPriority: null,
    },
  })
}
