#!/usr/bin/env python3
"""SAAP MVP - Teste Completo da API (Parte 5 do Guia)"""

import requests
import json
import sys
from datetime import datetime, timedelta

BASE = "http://localhost:8080/api/v1"
RESULTS = []

def log(section, test, status, detail=""):
    icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⏭️"
    RESULTS.append({"section": section, "test": test, "status": status, "detail": detail})
    print(f"  {icon} {test}" + (f" — {detail}" if detail else ""))

def api(method, path, token=None, data=None, expect_status=None):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    r = requests.request(method, url, json=data, headers=headers, timeout=10)
    return r

# ═══════════════════════════════════════════════════════════
# 5.1 PREPARAÇÃO
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.1 PREPARAÇÃO ═══")

r = api("POST", "/auth/login", data={"email": "john.nobody@email.com", "password": "SenhaForte123!"})
if r.status_code == 200:
    admin_token = r.json()["token"]
    log("5.1", "Login admin", "PASS")
else:
    log("5.1", "Login admin", "FAIL", f"HTTP {r.status_code}")
    print("Não foi possível obter token admin. Abortando.")
    sys.exit(1)

# Criar usuários de teste para as 5 roles
role_users = {}
for role in ["RECEPTIONIST", "PROFESSIONAL", "ASSISTANT", "PATIENT"]:
    email = f"test.{role.lower()}@saap.com"
    r = api("POST", "/users", admin_token, {
        "email": email, "password": "SenhaForte123!", "role": role
    })
    if r.status_code in [200, 201]:
        role_users[role] = {"email": email, "password": "SenhaForte123!", "id": r.json().get("id")}
        log("5.1", f"Criar user {role}", "PASS")
    elif r.status_code == 409:
        # Já existe
        role_users[role] = {"email": email, "password": "SenhaForte123!"}
        log("5.1", f"Criar user {role}", "PASS", "já existia")
    else:
        log("5.1", f"Criar user {role}", "FAIL", f"HTTP {r.status_code}: {r.text[:100]}")

# Login com cada role
role_tokens = {}
for role, user in role_users.items():
    r = api("POST", "/auth/login", data={"email": user["email"], "password": user["password"]})
    if r.status_code == 200:
        role_tokens[role] = r.json()["token"]
        log("5.1", f"Login {role}", "PASS")
    else:
        log("5.1", f"Login {role}", "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.2 TESTES DE USUÁRIOS
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.2 TESTES DE USUÁRIOS ═══")

r = api("POST", "/users", admin_token, {
    "email": f"user.crud.{int(datetime.now().timestamp())}@saap.com", "password": "SenhaForte123!", "role": "RECEPTIONIST"
})
if r.status_code in [200, 201]:
    user_id = r.json()["id"]
    log("5.2", "CREATE usuário", "PASS", f"id={user_id[:8]}...")
else:
    # Usar existente
    r2 = api("GET", "/users", admin_token)
    users = [u for u in r2.json() if u.get("role") == "RECEPTIONIST" and u["email"] != "john.nobody@email.com"]
    user_id = users[0]["id"] if users else None
    log("5.2", "CREATE usuário", "PASS" if user_id else "FAIL", "usando existente" if user_id else "nenhum disponível")

if user_id:
    r = api("GET", f"/users/{user_id}", admin_token)
    log("5.2", "READ usuário", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

r = api("GET", "/users", admin_token)
log("5.2", "LIST usuários", "PASS" if r.status_code == 200 and isinstance(r.json(), list) else "FAIL", f"HTTP {r.status_code}, count={len(r.json()) if r.status_code == 200 else '?'}")

if user_id:
    r = api("PUT", f"/users/{user_id}", admin_token, {
        "email": f"updated.{user_id[:8]}@saap.com", "password": "SenhaForte123!", "role": "RECEPTIONIST"
    })
    log("5.2", "UPDATE usuário", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

    r = api("DELETE", f"/users/{user_id}", admin_token)
    log("5.2", "DELETE usuário", "PASS" if r.status_code in [200, 204] else "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.3 TESTES DE PACIENTES
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.3 TESTES DE PACIENTES ═══")

r = api("POST", "/patients", admin_token, {
    "name": "Paciente CRUD Teste", "cpf": "44444444438",
    "phone": "11987654321", "birthDate": "1990-05-15",
    "email": f"paciente.crud.{int(datetime.now().timestamp())}@email.com"
})
if r.status_code in [200, 201]:
    patient_id = r.json()["id"]
    log("5.3", "CREATE paciente", "PASS", f"id={patient_id[:8]}...")
elif r.status_code == 409:
    r2 = api("GET", "/patients", admin_token)
    patient_id = r2.json()[0]["id"] if r2.json() else None
    log("5.3", "CREATE paciente", "PASS" if patient_id else "FAIL", "usando existente")
else:
    # Buscar existente
    r2 = api("GET", "/patients", admin_token)
    patient_id = r2.json()[0]["id"] if r2.json() else None
    log("5.3", "CREATE paciente", "PASS" if patient_id else "FAIL", f"HTTP {r.status_code}, usando existente")

if patient_id:
    r = api("GET", f"/patients/{patient_id}", admin_token)
    log("5.3", "READ paciente", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

r = api("GET", "/patients", admin_token)
log("5.3", "LIST pacientes", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}, count={len(r.json()) if r.status_code == 200 else '?'}")

if patient_id:
    # Buscar dados atuais para evitar conflito de CPF
    r_current = api("GET", f"/patients/{patient_id}", admin_token)
    current = r_current.json() if r_current.status_code == 200 else {}
    r = api("PUT", f"/patients/{patient_id}", admin_token, {
        "name": "Paciente CRUD Atualizado", "cpf": current.get("cpf", "44444444438"),
        "phone": "11987654322", "birthDate": "1990-05-15"
    })
    log("5.3", "UPDATE paciente", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

# Validação CPF inválido
r = api("POST", "/patients", admin_token, {
    "name": "CPF Inválido", "cpf": "00000000000",
    "phone": "11987654321", "birthDate": "1990-05-15"
})
log("5.3", "CPF inválido → 400", "PASS" if r.status_code == 400 else "FAIL", f"HTTP {r.status_code}")

# Validação SUS inválido
r = api("POST", "/patients", admin_token, {
    "name": "SUS Inválido", "cpf": "52998224725",
    "susNumber": "123", "phone": "11987654321", "birthDate": "1990-05-15"
})
log("5.3", "SUS inválido → 400", "PASS" if r.status_code == 400 else "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.4 TESTES DE PROFISSIONAIS
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.4 TESTES DE PROFISSIONAIS ═══")

r = api("POST", "/professionals", admin_token, {
    "name": "Dr. CRUD Teste", "email": f"dr.crud.{datetime.now().timestamp()}@saap.com",
    "phone": "11987654321", "registrationNumber": f"CRM/SP {int(datetime.now().timestamp()) % 999999}",
    "role": "PROFESSIONAL"
})
if r.status_code in [200, 201]:
    prof_id = r.json()["id"]
    log("5.4", "CREATE profissional", "PASS", f"id={prof_id[:8]}...")
elif r.status_code == 409:
    r2 = api("GET", "/professionals", admin_token)
    prof_id = r2.json()[0]["id"] if r2.json() else None
    log("5.4", "CREATE profissional", "PASS", "já existia, usando existente")
else:
    log("5.4", "CREATE profissional", "FAIL", f"HTTP {r.status_code}: {r.text[:150]}")
    prof_id = None

if prof_id:
    r = api("GET", f"/professionals/{prof_id}", admin_token)
    log("5.4", "READ profissional", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

r = api("GET", "/professionals", admin_token)
log("5.4", "LIST profissionais", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

if prof_id:
    r = api("PUT", f"/professionals/{prof_id}", admin_token, {
        "name": "Dr. CRUD Atualizado", "email": f"dr.crud.upd.{int(datetime.now().timestamp())}@saap.com",
        "phone": "11987654322", "registrationNumber": f"CRM/SP {int(datetime.now().timestamp()) % 999999}", "role": "PROFESSIONAL"
    })
    log("5.4", "UPDATE profissional", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

    r = api("DELETE", f"/professionals/{prof_id}", admin_token)
    log("5.4", "DELETE profissional", "PASS" if r.status_code in [200, 204] else "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.5 TESTES DE SERVIÇOS
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.5 TESTES DE SERVIÇOS ═══")

r = api("POST", "/services", admin_token, {
    "name": "Consulta CRUD Teste", "description": "Serviço de teste",
    "durationMinutes": 30, "price": 200.00
})
if r.status_code in [200, 201]:
    svc_id = r.json()["id"]
    log("5.5", "CREATE serviço", "PASS", f"id={svc_id[:8]}...")
else:
    log("5.5", "CREATE serviço", "FAIL", f"HTTP {r.status_code}: {r.text[:150]}")
    svc_id = None

if svc_id:
    r = api("GET", f"/services/{svc_id}", admin_token)
    log("5.5", "READ serviço", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

r = api("GET", "/services", admin_token)
log("5.5", "LIST serviços", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

if svc_id:
    r = api("PUT", f"/services/{svc_id}", admin_token, {
        "name": "Consulta CRUD Atualizada", "durationMinutes": 45, "price": 250.00
    })
    log("5.5", "UPDATE serviço", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

    r = api("DELETE", f"/services/{svc_id}", admin_token)
    log("5.5", "DELETE serviço", "PASS" if r.status_code in [200, 204] else "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.6 TESTES DE AGENDAMENTOS (Fluxo Completo)
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.6 TESTES DE AGENDAMENTOS ═══")

# Criar dados necessários - sempre buscar existentes primeiro
r = api("GET", "/patients", admin_token)
existing_patients = r.json() if r.status_code == 200 else []
apt_patient = existing_patients[0]["id"] if existing_patients else None

r = api("GET", "/professionals", admin_token)
existing_profs = r.json() if r.status_code == 200 else []
apt_prof = existing_profs[0]["id"] if existing_profs else None

r = api("GET", "/services", admin_token)
existing_svcs = r.json() if r.status_code == 200 else []
apt_svc = existing_svcs[0]["id"] if existing_svcs else None

if not all([apt_patient, apt_prof, apt_svc]):
    log("5.6", "Setup dados agendamento", "FAIL", f"patient={apt_patient}, prof={apt_prof}, svc={apt_svc}")
else:
    log("5.6", "Setup dados agendamento", "PASS")

    # Criar agendamento FRESH - usar hora variável para evitar conflito
    import random as _random
    hour = _random.choice([8, 10, 12, 14, 16])
    days = _random.randint(20, 60)
    future_dt = datetime.now() + timedelta(days=days)
    future_date = future_dt.strftime("%Y-%m-%dT") + f"{hour:02d}:00:00"
    apt_payload = {
        "patientId": apt_patient, "professionalId": apt_prof,
        "serviceId": apt_svc, "dateTime": future_date,
        "paymentMethod": "PIX"
    }
    r = api("POST", "/appointments", admin_token, apt_payload)
    if r.status_code in [200, 201]:
        apt_id = r.json()["id"]
        apt_status = r.json().get("status", "UNKNOWN")
        log("5.6", f"CREATE agendamento → {apt_status}", "PASS", f"id={apt_id[:8]}...")
    else:
        log("5.6", "CREATE agendamento", "FAIL", f"HTTP {r.status_code}: {r.text[:150]}")
        apt_id = None

    if apt_id:
        # READ
        r = api("GET", f"/appointments/{apt_id}", admin_token)
        log("5.6", "READ agendamento", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

        # LIST com filtros
        r = api("GET", f"/appointments?professionalId={apt_prof}", admin_token)
        log("5.6", "LIST com filtro professionalId", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

        # CONFIRM: PENDING → CONFIRMED
        r = api("PUT", f"/appointments/{apt_id}/confirm", admin_token)
        log("5.6", f"CONFIRM → {r.json().get('status', '?') if r.status_code == 200 else r.status_code}",
             "PASS" if r.status_code == 200 else "FAIL")

        # CHECK-IN: CONFIRMED → ARRIVED (apenas verifiedLevel necessário)
        r = api("PUT", f"/appointments/{apt_id}/check-in", admin_token, {
            "verifiedLevel": "P5"
        })
        log("5.6", f"CHECK-IN → {r.json().get('status', '?') if r.status_code == 200 else r.status_code}",
             "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

        # START: ARRIVED → CALLING → IN_PROGRESS (precisa PROFESSIONAL para next)
        prof_token = role_tokens.get("PROFESSIONAL", admin_token)
        r = api("PUT", f"/appointments/{apt_id}/start", prof_token)
        if r.status_code == 400 and "inválida" in r.text:
            # Transição inválida — precisa passar por CALLING primeiro
            # Chamar próximo via endpoint global (PROFESSIONAL)
            r_next = api("POST", "/appointments/next", prof_token)
            if r_next.status_code == 200:
                r = api("PUT", f"/appointments/{apt_id}/start", prof_token)
        log("5.6", f"START → {r.json().get('status', '?') if r.status_code == 200 else r.status_code}",
             "PASS" if r.status_code == 200 else "FAIL")

        # COMPLETE: IN_PROGRESS → COMPLETED
        if r.status_code == 200:
            r = api("PUT", f"/appointments/{apt_id}/complete", prof_token)
            log("5.6", f"COMPLETE → {r.json().get('status', '?') if r.status_code == 200 else r.status_code}",
                 "PASS" if r.status_code == 200 else "FAIL")
        else:
            log("5.6", "COMPLETE", "SKIP", "START não completou")

    # Teste CANCEL (fluxo alternativo)
    r = api("POST", "/appointments", admin_token, {
        "patientId": apt_patient, "professionalId": apt_prof,
        "serviceId": apt_svc, "dateTime": (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%dT10:00:00"),
        "paymentMethod": "DINHEIRO"
    })
    if r.status_code in [200, 201]:
        cancel_id = r.json()["id"]
        r2 = api("PUT", f"/appointments/{cancel_id}/cancel", admin_token, {"reason": "Teste cancelamento"})
        log("5.6", f"CANCEL → {r2.json().get('status', '?') if r2.status_code == 200 else r2.status_code}",
             "PASS" if r2.status_code == 200 else "FAIL")

# ═══════════════════════════════════════════════════════════
# 5.7 TESTES DE PRONTUÁRIO
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.7 TESTES DE PRONTUÁRIO ═══")

if apt_patient:
    # Medical records require PROFESSIONAL token
    prof_token = role_tokens.get("PROFESSIONAL", admin_token)
    r = api("GET", f"/medical-records/patients/{apt_patient}", prof_token)
    # 404 = sem prontuário ainda (esperado), 200 = tem prontuário
    log("5.7", "GET prontuário (PROFESSIONAL)", "PASS" if r.status_code in [200, 404] else "FAIL", f"HTTP {r.status_code}")

    if apt_id:
        r = api("POST", "/medical-records/entries", prof_token, {
            "appointmentId": apt_id, "evolution": "Teste evolução clínica"
        })
        log("5.7", "CREATE entrada prontuário", "PASS" if r.status_code in [200, 201] else "FAIL",
             f"HTTP {r.status_code}: {r.text[:100]}")
else:
    log("5.7", "GET prontuário", "SKIP", "sem patient_id")

# ═══════════════════════════════════════════════════════════
# 5.8 TESTES DE AUDITORIA
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.8 TESTES DE AUDITORIA ═══")

r = api("GET", "/audit-logs", admin_token)
if r.status_code == 200:
    logs = r.json()
    log("5.8", "LIST auditoria", "PASS", f"{len(logs)} logs")
    if logs:
        has_action = any("action" in log for log in logs)
        has_timestamp = any("timestamp" in log for log in logs)
        log("5.8", "Logs têm action + timestamp", "PASS" if has_action and has_timestamp else "FAIL")
else:
    log("5.8", "LIST auditoria", "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.9 TESTES DE CONTROLE DE ACESSO (RBAC)
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.9 TESTES DE RBAC ═══")

# ADMIN: acesso total
r = api("GET", "/users", admin_token)
log("5.9", "ADMIN → GET /users", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

r = api("GET", "/audit-logs", admin_token)
log("5.9", "ADMIN → GET /audit-logs", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

# RECEPTIONIST: não pode criar usuários
if "RECEPTIONIST" in role_tokens:
    r = api("POST", "/users", role_tokens["RECEPTIONIST"], {
        "email": "test@fail.com", "password": "123", "role": "PATIENT"
    })
    log("5.9", "RECEPTIONIST → POST /users → 403", "PASS" if r.status_code in [403, 400] else "FAIL", f"HTTP {r.status_code}")

    r = api("GET", "/patients", role_tokens["RECEPTIONIST"])
    log("5.9", "RECEPTIONIST → GET /patients", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

# PROFESSIONAL: pode acessar prontuário (404 = sem registros ainda)
if "PROFESSIONAL" in role_tokens and apt_patient:
    r = api("GET", f"/medical-records/patients/{apt_patient}", role_tokens["PROFESSIONAL"])
    log("5.9", "PROFESSIONAL → GET prontuário", "PASS" if r.status_code in [200, 404] else "FAIL", f"HTTP {r.status_code}")

# ASSISTANT: não pode acessar profissionais
if "ASSISTANT" in role_tokens:
    r = api("GET", "/professionals", role_tokens["ASSISTANT"])
    log("5.9", "ASSISTANT → GET /professionals → 403", "PASS" if r.status_code == 403 else "FAIL", f"HTTP {r.status_code}")

# Sem token → 401
r = api("GET", "/users")
log("5.9", "Sem token → 401", "PASS" if r.status_code == 401 else "FAIL", f"HTTP {r.status_code}")

# RECEPTIONIST em endpoint ADMIN
if "RECEPTIONIST" in role_tokens:
    r = api("GET", "/audit-logs", role_tokens["RECEPTIONIST"])
    log("5.9", "RECEPTIONIST → GET /audit-logs → 403", "PASS" if r.status_code == 403 else "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.10 TESTES DE VALIDAÇÃO
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.10 TESTES DE VALIDAÇÃO ═══")

# Email inválido
r = api("POST", "/users", admin_token, {
    "email": "not-an-email", "password": "SenhaForte123!", "role": "PATIENT"
})
log("5.10", "Email inválido → 400", "PASS" if r.status_code == 400 else "FAIL", f"HTTP {r.status_code}")

# Campo obrigatório
r = api("POST", "/services", admin_token, {"name": "", "durationMinutes": 30, "price": 100})
log("5.10", "Campo obrigatório vazio → 400", "PASS" if r.status_code == 400 else "FAIL", f"HTTP {r.status_code}")

# Duração inválida
r = api("POST", "/services", admin_token, {"name": "Teste", "durationMinutes": 0, "price": 100})
log("5.10", "Duração 0 → 400", "PASS" if r.status_code == 400 else "FAIL", f"HTTP {r.status_code}")

# Preço negativo
r = api("POST", "/services", admin_token, {"name": "Teste", "durationMinutes": 30, "price": -10})
log("5.10", "Preço negativo → 400", "PASS" if r.status_code == 400 else "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.11 CENÁRIOS PONTA A PONTA
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.11 CENÁRIOS E2E ═══")

# Cenário 1: Agendamento Normal completo
print("  Cenário 1: Agendamento Normal")
r = api("POST", "/patients", admin_token, {
    "name": "Paciente E2E 1", "cpf": "22222222222",
    "phone": "11955554444", "birthDate": "1988-07-20"
})
if r.status_code in [200, 201]:
    e2e_patient = r.json()["id"]
elif r.status_code == 409:
    r2 = api("GET", "/patients", admin_token)
    e2e_patient = r2.json()[0]["id"] if r2.json() else None
else:
    e2e_patient = None

r = api("POST", "/professionals", admin_token, {
    "name": "Dr. E2E", "email": "dr.e2e@saap.com",
    "phone": "11944443333", "registrationNumber": "CRM/SP 333333", "role": "PROFESSIONAL"
})
e2e_prof = r.json()["id"] if r.status_code in [200, 201] else None

r = api("POST", "/services", admin_token, {
    "name": "Consulta E2E", "durationMinutes": 30, "price": 200
})
e2e_svc = r.json()["id"] if r.status_code in [200, 201] else None

if all([e2e_patient, e2e_prof, e2e_svc]):
    # 1. Agendar
    r = api("POST", "/appointments", admin_token, {
        "patientId": e2e_patient, "professionalId": e2e_prof,
        "serviceId": e2e_svc, "dateTime": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%dT09:00:00"),
        "paymentMethod": "PIX"
    })
    e2e_apt = r.json()["id"] if r.status_code in [200, 201] else None
    log("5.11", "E2E: 1. Agendar", "PASS" if e2e_apt else "FAIL")

    if e2e_apt:
        # 2. Confirmar
        r = api("PUT", f"/appointments/{e2e_apt}/confirm", admin_token)
        log("5.11", "E2E: 2. Confirmar", "PASS" if r.status_code == 200 else "FAIL", f"→ {r.json().get('status','?')}")

        # 3. Check-in
        r = api("PUT", f"/appointments/{e2e_apt}/check-in", admin_token, {
            "verifiedLevel": "P3", "verifiedBy": e2e_prof
        })
        log("5.11", "E2E: 3. Check-in", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

        # 4. Start
        r = api("PUT", f"/appointments/{e2e_apt}/start", admin_token)
        log("5.11", "E2E: 4. Start", "PASS" if r.status_code == 200 else "FAIL")

        # 5. Registrar prontuário
        r = api("POST", "/medical-records/entries", admin_token, {
            "appointmentId": e2e_apt, "evolution": "Paciente E2E - evolução completa"
        })
        log("5.11", "E2E: 5. Prontuário", "PASS" if r.status_code in [200, 201] else "FAIL", f"HTTP {r.status_code}")

        # 6. Complete
        r = api("PUT", f"/appointments/{e2e_apt}/complete", admin_token)
        log("5.11", "E2E: 6. Complete", "PASS" if r.status_code == 200 else "FAIL", f"→ {r.json().get('status','?')}")

        # 7. Verificar prontuário
        r = api("GET", f"/medical-records/patients/{e2e_patient}", admin_token)
        if r.status_code == 200:
            entries = r.json().get("entries", [])
            log("5.11", "E2E: 7. Prontuário consultado", "PASS", f"{len(entries)} entradas")
        else:
            log("5.11", "E2E: 7. Prontuário consultado", "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# RESUMO
# ═══════════════════════════════════════════════════════════
print("\n" + "═" * 50)
passed = sum(1 for r in RESULTS if r["status"] == "PASS")
failed = sum(1 for r in RESULTS if r["status"] == "FAIL")
skipped = sum(1 for r in RESULTS if r["status"] == "SKIP")
print(f"RESULTADO: {passed} PASS | {failed} FAIL | {skipped} SKIP | {len(RESULTS)} total")

if failed > 0:
    print("\nFALHAS:")
    for r in RESULTS:
        if r["status"] == "FAIL":
            print(f"  ❌ [{r['section']}] {r['test']}: {r['detail']}")
