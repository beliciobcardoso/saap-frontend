<script setup lang="ts">
import { computed, ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import CheckInForm from '@/components/appointments/CheckInForm.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useConfirmAppointment, useCallNext, useStartAppointment, useCompleteAppointment } from '@/composables/mutations/useAppointmentMutations'
import type { AppointmentResponse } from '@/api/types'

interface Props {
  appointment: AppointmentResponse
}

const props = defineProps<Props>()
const emit = defineEmits<{ cancel: [id: string] }>()

const { canConfirm, canCallNext, canStartAppointment, canComplete } = usePermissions()

const confirmMutation = useConfirmAppointment()
const callNextMutation = useCallNext()
const startMutation = useStartAppointment()
const completeMutation = useCompleteAppointment()

const showCheckIn = ref(false)

const status = computed(() => props.appointment.status)

const showConfirm = computed(() =>
  canConfirm.value && status.value === 'PENDING'
)

const showCheckInBtn = computed(() =>
  canConfirm.value && status.value === 'CONFIRMED'
)

const showCallNext = computed(() =>
  canCallNext.value && status.value === 'ARRIVED'
)

const showStart = computed(() =>
  canStartAppointment.value && status.value === 'CALLING'
)

const showComplete = computed(() =>
  canComplete.value && status.value === 'IN_PROGRESS'
)

const showCancel = computed(() =>
  !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(status.value)
)

function handleConfirm() {
  confirmMutation.mutate(props.appointment.id)
}

function handleCallNext() {
  callNextMutation.mutate(props.appointment.id)
}

function handleStart() {
  startMutation.mutate(props.appointment.id)
}

function handleComplete() {
  completeMutation.mutate(props.appointment.id)
}
</script>

<template>
  <div class="appointment-actions">
    <AppButton v-if="showConfirm" size="sm" variant="success" @click="handleConfirm" :loading="confirmMutation.isPending.value">
      Confirmar
    </AppButton>
    <AppButton v-if="showCheckInBtn" size="sm" variant="primary" @click="showCheckIn = true">
      Check-in
    </AppButton>
    <AppButton v-if="showCallNext" size="sm" variant="warning" @click="handleCallNext" :loading="callNextMutation.isPending.value">
      Chamar
    </AppButton>
    <AppButton v-if="showStart" size="sm" variant="primary" @click="handleStart" :loading="startMutation.isPending.value">
      Iniciar
    </AppButton>
    <AppButton v-if="showComplete" size="sm" variant="success" @click="handleComplete" :loading="completeMutation.isPending.value">
      Finalizar
    </AppButton>
    <AppButton v-if="showCancel" size="sm" variant="ghost" @click="emit('cancel', appointment.id)">
      Cancelar
    </AppButton>

    <CheckInForm v-model="showCheckIn" :appointment-id="appointment.id" />
  </div>
</template>

<style scoped>
.appointment-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
</style>
