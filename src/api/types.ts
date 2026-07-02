// Espelha exatamente os DTOs da API Spring Boot

// ─── ENUMS ─────────────────────────────────────────────

export type AppointmentStatus =
  | 'PENDING'
  | 'PENDING_RESPONSE'
  | 'CONFIRMED'
  | 'ARRIVED'
  | 'CALLING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'

export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4' | 'P5'

export type WaitlistStatus = 'WAITING' | 'OFFERED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED'

export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'PROFESSIONAL' | 'ASSISTANT' | 'PATIENT'

export type ProfessionalRole = 'PROFESSIONAL' | 'ASSISTANT'

export type PaymentMethod = 'PIX' | 'DINHEIRO' | 'CARTAO' | 'CHEQUE'

// ─── ENTIDADES (Response DTOs) ─────────────────────────

export interface PatientResponse {
  id: string
  name: string
  cpf: string
  susNumber: string | null
  email: string | null
  phone: string
  birthDate: string  // ISO date "YYYY-MM-DD"
  active: boolean
}

export interface ProfessionalResponse {
  id: string
  name: string
  email: string
  phone: string
  registrationNumber: string
  role: ProfessionalRole
  active: boolean
}

export interface ServiceResponse {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: number
  active: boolean
}

export interface UserResponse {
  id: string
  email: string
  role: UserRole
  active: boolean
}

export interface AppointmentResponse {
  id: string
  patient: PatientResponse
  professional: ProfessionalResponse
  service: ServiceResponse
  dateTime: string
  status: AppointmentStatus
  paymentMethod: PaymentMethod
  declaredPriority: PriorityLevel | null
  verifiedPriority: PriorityLevel | null
  priorityScore: number | null
  cancellationReason: string | null
  followUpRequired: boolean
  followUpSent: boolean
  checkInAt: string | null
  checkInNotes: string | null
  verifiedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface WaitlistEntryResponse {
  id: string
  patient: PatientResponse
  professional: ProfessionalResponse
  service: ServiceResponse
  preferredDate: string
  status: WaitlistStatus
  position: number
  active: boolean
  offerExpiresAt: string | null
  createdAt: string
}

export interface AuditLogResponse {
  id: string
  timestamp: string
  userId: string
  action: string
  appointmentId: string | null
  recursoId: string
  recursoTipo: string
  ipAddress: string
}

// ─── TOKENS AUTH ───────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokenResponse {
  token: string
  type: 'Bearer'
  expiresIn: number
}

// ─── REQUEST DTOs ──────────────────────────────────────

export interface PatientRequest {
  name: string
  cpf: string
  susNumber?: string
  email?: string
  phone: string
  birthDate: string
}

export interface ProfessionalRequest {
  name: string
  email: string
  phone: string
  registrationNumber: string
  role: ProfessionalRole
}

export interface ServiceRequest {
  name: string
  description?: string
  durationMinutes: number
  price: number
}

export interface UserRequest {
  email: string
  password: string
  role: UserRole
}

export interface BookAppointmentRequest {
  patientId: string
  professionalId: string
  serviceId: string
  dateTime: string
  paymentMethod: PaymentMethod
  declaredPriority?: PriorityLevel
}

export interface CancelAppointmentRequest {
  reason: string
}

export interface CheckInRequest {
  verifiedLevel: PriorityLevel
  verifiedBy: string
  notes?: string
}

// ─── FILTROS DE QUERY ──────────────────────────────────

export interface AppointmentFilters {
  professionalId?: string
  patientId?: string
  startDate?: string
  endDate?: string
  status?: AppointmentStatus
}

export interface AuditLogFilters {
  userId?: string
  action?: string
  recursoTipo?: string
  startDate?: string
  endDate?: string
}

// ─── PAGINAÇÃO (futuro) ────────────────────────────────

export interface PageRequest {
  page?: number
  size?: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}
