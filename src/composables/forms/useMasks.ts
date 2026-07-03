import { ref, computed } from 'vue'

export function useCpfMask() {
  const raw = ref('')

  const masked = computed({
    get: () => raw.value,
    set: (val: string) => {
      const digits = val.replace(/\D/g, '').slice(0, 11)
      const parts = [
        digits.slice(0, 3),
        digits.slice(3, 6),
        digits.slice(6, 9),
        digits.slice(9, 11),
      ]
      let result = parts[0]
      if (parts[1]) result += '.' + parts[1]
      if (parts[2]) result += '.' + parts[2]
      if (parts[3]) result += '-' + parts[3]
      raw.value = result
    },
  })

  const rawDigits = computed(() => raw.value.replace(/\D/g, ''))

  function setRaw(value: string) {
    masked.value = value.replace(/\D/g, '')
  }

  return { masked, rawDigits, setRaw }
}

export function usePhoneMask() {
  const raw = ref('')

  const masked = computed({
    get: () => raw.value,
    set: (val: string) => {
      const digits = val.replace(/\D/g, '').slice(0, 11)
      if (digits.length <= 10) {
        const ddd = digits.slice(0, 2)
        const part1 = digits.slice(2, 6)
        const part2 = digits.slice(6, 10)
        let result = ''
        if (ddd) result += '(' + ddd
        if (part1) result += ') ' + part1
        if (part2) result += '-' + part2
        raw.value = result
      } else {
        const ddd = digits.slice(0, 2)
        const nine = digits[2]
        const part1 = digits.slice(3, 7)
        const part2 = digits.slice(7, 11)
        let result = `(${ddd}) ${nine}`
        if (part1) result += ' ' + part1
        if (part2) result += '-' + part2
        raw.value = result
      }
    },
  })

  const rawDigits = computed(() => raw.value.replace(/\D/g, ''))

  function setRaw(value: string) {
    masked.value = value.replace(/\D/g, '')
  }

  return { masked, rawDigits, setRaw }
}
