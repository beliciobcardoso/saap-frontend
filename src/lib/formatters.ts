import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { PaymentMethod } from '@/api/types'

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd/MM/yyyy', { locale: ptBR })
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'HH:mm', { locale: ptBR })
}

export function formatDateTimeRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { locale: ptBR, addSuffix: true })
}

export function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPaymentMethod(method: PaymentMethod): string {
  const map: Record<PaymentMethod, string> = {
    PIX: 'Pix',
    DINHEIRO: 'Dinheiro',
    CARTAO: 'Cartão',
    CHEQUE: 'Cheque',
  }
  return map[method]
}

export function validateCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const calc = (d: string, len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) {
      sum += parseInt(d[i]) * (len + 1 - i)
    }
    const rem = (sum * 10) % 11
    return rem >= 10 ? 0 : rem
  }

  return (
    calc(digits, 9) === parseInt(digits[9]) &&
    calc(digits, 10) === parseInt(digits[10])
  )
}
