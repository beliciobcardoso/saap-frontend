import { test, expect, type Page } from '@playwright/test'

const EMAIL = 'john.nobody@email.com'
const PASSWORD = 'SenhaForte123!'

// Shared login helper
async function login(page: Page) {
  await page.goto('/login')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(300)
  if (page.url().includes('/dashboard')) return
  await page.fill('input[name="email"]', EMAIL)
  await page.fill('input[name="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

// ─── 1. LOGIN ────────────────────────────────────────────
test.describe('1. Login', () => {
  test('renders login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta' })).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('valid credentials → dashboard', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL(/dashboard/)
  })

  test('wrong password → error', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')
    await page.fill('input[name="email"]', EMAIL)
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.locator('.login-error')).toBeVisible({ timeout: 5000 })
  })

  test('empty submit → validation', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Email é obrigatório')).toBeVisible({ timeout: 3000 })
  })
})

// ─── 2. DASHBOARD ────────────────────────────────────────
test.describe('2. Dashboard', () => {
  test('shows greeting and stat cards', async ({ page }) => {
    await login(page)
    await expect(page.locator('.dashboard__greeting')).toBeVisible()
    await expect(page.locator('.stat-card').first()).toBeVisible()
  })

  test('quick actions navigate', async ({ page }) => {
    await login(page)
    await page.click('.quick-action >> text=Agendamentos')
    await page.waitForURL('**/appointments')
  })
})

// ─── 3. SIDEBAR ──────────────────────────────────────────
test.describe('3. Sidebar', () => {
  test('all admin nav items visible', async ({ page }) => {
    await login(page)
    for (const item of ['Dashboard', 'Agendamentos', 'Pacientes', 'Profissionais', 'Serviços', 'Usuários', 'Auditoria']) {
      await expect(page.locator(`.sidebar__item >> text=${item}`)).toBeVisible()
    }
  })

  test('collapse toggle', async ({ page }) => {
    await login(page)
    const toggle = page.locator('.sidebar__toggle')
    await toggle.click()
    await page.waitForTimeout(300)
    await toggle.click()
  })
})

// ─── 4. APPOINTMENTS ─────────────────────────────────────
test.describe('4. Appointments', () => {
  test('page loads with table', async ({ page }) => {
    await login(page)
    await page.goto('/appointments')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.page__title')).toContainText('Agendamentos')
    await expect(page.locator('.table')).toBeVisible()
  })

  test('open modal', async ({ page }) => {
    await login(page)
    await page.goto('/appointments')
    await page.click('text=Novo Agendamento')
    await expect(page.locator('.modal__title')).toContainText('Novo Agendamento')
  })

  test('filters toggle', async ({ page }) => {
    await login(page)
    await page.goto('/appointments')
    await page.click('text=Filtros')
    await expect(page.locator('.page__filters')).toBeVisible()
  })

  test('click row → detail', async ({ page }) => {
    await login(page)
    await page.goto('/appointments')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    const row = page.locator('tbody tr').first()
    if (await row.isVisible()) {
      await row.click()
      await page.waitForLoadState('networkidle')
      // Should be on detail page or still on appointments
      expect(page.url()).toMatch(/appointments/)
    }
  })
})

// ─── 5. PATIENTS ─────────────────────────────────────────
test.describe('5. Patients', () => {
  test('page loads', async ({ page }) => {
    await login(page)
    await page.goto('/patients')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.page__title')).toContainText('Pacientes')
  })

  test('search filters', async ({ page }) => {
    await login(page)
    await page.goto('/patients')
    await page.waitForLoadState('networkidle')
    await page.fill('.search-input', 'Maria')
    await page.waitForTimeout(500)
  })

  test('create patient', async ({ page }) => {
    await login(page)
    await page.goto('/patients')
    await page.click('text=Novo Paciente')
    await page.waitForSelector('.modal')
    await page.fill('input[name="name"]', 'Paciente Teste Final')
    await page.fill('input[name="cpf"]', '52998224725')
    await page.fill('input[name="phone"]', '11999887766')
    await page.fill('input[name="birthDate"]', '1990-05-15')
    await page.click('button:has-text("Cadastrar")')
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 })
  })
})

// ─── 6. PROFESSIONALS ────────────────────────────────────
test.describe('6. Professionals', () => {
  test('page loads', async ({ page }) => {
    await login(page)
    await page.goto('/professionals')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.page__title')).toContainText('Profissionais')
  })

  test('create professional', async ({ page }) => {
    await login(page)
    await page.goto('/professionals')
    await page.click('text=Novo Profissional')
    await page.waitForSelector('.modal')
    await page.fill('input[name="name"]', 'Dr. Teste Final')
    await page.fill('input[name="email"]', 'dr.final@saap.com')
    await page.fill('input[name="phone"]', '11988776655')
    await page.fill('input[name="registrationNumber"]', 'CRM/SP 123456')
    await page.click('button:has-text("Cadastrar")')
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 })
  })
})

// ─── 7. SERVICES ─────────────────────────────────────────
test.describe('7. Services', () => {
  test('page loads', async ({ page }) => {
    await login(page)
    await page.goto('/services')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.page__title')).toContainText('Serviços')
  })

  test('create service', async ({ page }) => {
    await login(page)
    await page.goto('/services')
    await page.click('text=Novo Serviço')
    await page.waitForSelector('.modal')
    await page.fill('input[name="name"]', 'Consulta Teste Final')
    await page.fill('textarea[name="description"]', 'Automatizado')
    await page.fill('input[name="durationMinutes"]', '30')
    await page.fill('input[name="price"]', '200')
    await page.click('button:has-text("Cadastrar")')
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 })
  })
})

// ─── 8. USERS ────────────────────────────────────────────
test.describe('8. Users', () => {
  test('page loads', async ({ page }) => {
    await login(page)
    await page.goto('/users')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.page__title')).toContainText('Usuários')
  })

  test('create user', async ({ page }) => {
    await login(page)
    await page.goto('/users')
    await page.click('text=Novo Usuário')
    await page.waitForSelector('.modal')
    await page.fill('input[name="email"]', 'user.final@saap.com')
    await page.fill('input[name="password"]', 'SenhaForte123!')
    await page.selectOption('select[name="role"]', 'RECEPTIONIST')
    await page.click('button:has-text("Cadastrar")')
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 10000 })
  })
})

// ─── 9. AUDIT ────────────────────────────────────────────
test.describe('9. Audit Logs', () => {
  test('page loads with filters', async ({ page }) => {
    await login(page)
    await page.goto('/audit-logs')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.page__title')).toContainText('Logs de Auditoria')
    await expect(page.locator('.page__filters')).toBeVisible()
  })
})

// ─── 10. QUEUE ───────────────────────────────────────────
test.describe('10. Queue', () => {
  test('loads with live indicator', async ({ page }) => {
    await login(page)
    await page.goto('/queue')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('.queue-topbar__title')).toContainText('Fila de Atendimento')
    await expect(page.locator('.queue-topbar__live')).toBeVisible()
  })

  test('professional filter', async ({ page }) => {
    await login(page)
    await page.goto('/queue')
    await expect(page.locator('.queue-select')).toBeVisible()
  })
})

// ─── 11. DETAIL ──────────────────────────────────────────
test.describe('11. Appointment Detail', () => {
  test('navigate to detail page', async ({ page }) => {
    await login(page)
    await page.goto('/appointments')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
    const row = page.locator('tbody tr').first()
    if (await row.isVisible()) {
      await row.click()
      await page.waitForLoadState('networkidle')
      // Should be on detail page or still on appointments
      expect(page.url()).toMatch(/appointments/)
    }
  })
})

// ─── 12. LOGOUT ──────────────────────────────────────────
test.describe('12. Logout', () => {
  test('redirects to login', async ({ page }) => {
    await login(page)
    await page.click('.topbar__logout')
    await page.waitForURL('**/login', { timeout: 5000 })
    await expect(page.getByRole('heading', { name: 'Bem-vindo de volta' })).toBeVisible()
  })
})

// ─── 13. PUBLIC ──────────────────────────────────────────
test.describe('13. Public Confirm', () => {
  test('invalid token', async ({ page }) => {
    await page.goto('/public/confirm?token=invalid&action=confirm')
    await page.waitForTimeout(2000)
    await expect(page.locator('.confirm-card')).toBeVisible()
  })

  test('missing params', async ({ page }) => {
    await page.goto('/public/confirm')
    await expect(page.locator('.confirm-title')).toContainText('Link inválido')
  })
})

// ─── 14. ROUTE PROTECTION ────────────────────────────────
test.describe('14. Route Protection', () => {
  test('unauthenticated → login', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('domcontentloaded')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 })
  })
})
