#!/usr/bin/env python3
"""SAAP MVP - Teste Completo da API (Guia Atualizado)"""

import requests
import json
import sys
from datetime import datetime, timedelta
import random

BASE = "http://localhost:8080/api/v1"
RESULTS = []

def log(section, test, status, detail=""):
    icon = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⏭️"
    RESULTS.append({"section": section, "test": test, "status": status, "detail": detail})
    print(f"  {icon} {test}" + (f" — {detail}" if detail else ""))

def api(method, path, token=None, data=None):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.request(method, url, json=data, headers=headers, timeout=10)

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
    sys.exit(1)

# Criar users de teste + vincular profissional
role_tokens = {}
prof_user_id = None
for role in ["RECEPTIONIST", "PROFESSIONAL", "ASSISTANT", "PATIENT"]:
    email = f"test.{role.lower()}@saap.com"
    r = api("POST", "/users", admin_token, {"email": email, "password": "SenhaForte123!", "role": role})
    uid = r.json().get("id") if r.status_code in [200, 201] else None
    if not uid:
        r2 = api("GET", "/users", admin_token)
        for u in r2.json():
            if u.get("role") == role:
                uid = u["id"]
                break
    if uid:
        if role == "PROFESSIONAL":
            prof_user_id = uid
        r_login = api("POST", "/auth/login", data={"email": email, "password": "SenhaForte123!"})
        if r_login.status_code == 200:
            role_tokens[role] = r_login.json()["token"]
            log("5.1", f"Setup {role}", "PASS")
        else:
            log("5.1", f"Setup {role}", "FAIL", f"login HTTP {r_login.status_code}")
    else:
        log("5.1", f"Setup {role}", "FAIL", "sem user id")

# Criar profissional vinculado ao user PROFESSIONAL
r = api("POST", "/professionals", admin_token, {
    "name": "Dr. Teste Vinculado", "email": f"dr.vinculado.{random.randint(1000,9999)}@saap.com",
    "phone": "11999998888", "registrationNumber": f"CRM/SP {random.randint(100000,999999)}",
    "role": "PROFESSIONAL", "userId": prof_user_id
})
if r.status_code in [200, 201]:
    linked_prof_id = r.json()["id"]
    log("5.1", "Profissional vinculado ao user", "PASS", f"id={linked_prof_id[:8]}...")
else:
    # Usar profissional existente vinculado ao user PROFESSIONAL
    r2 = api("GET", "/professionals", admin_token)
    linked_prof_id = None
    for p in r2.json():
        if p.get("userId") == prof_user_id:
            linked_prof_id = p["id"]
            break
    if linked_prof_id:
        log("5.1", "Profissional vinculado", "PASS", "usando existente")
    else:
        log("5.1", "Profissional vinculado", "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.2 USUÁRIOS
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.2 USUÁRIOS ═══")

r = api("POST", "/users", admin_token, {"email": f"crud.{random.randint(1000,9999)}@saap.com", "password": "SenhaForte123!", "role": "RECEPTIONIST"})
user_id = r.json().get("id") if r.status_code in [200, 201] else None
log("5.2", "CREATE", "PASS" if user_id else "FAIL", f"HTTP {r.status_code}")

if user_id:
    log("5.2", "READ", "PASS" if api("GET", f"/users/{user_id}", admin_token).status_code == 200 else "FAIL")
log("5.2", "LIST", "PASS" if api("GET", "/users", admin_token).status_code == 200 else "FAIL")
if user_id:
    r = api("PUT", f"/users/{user_id}", admin_token, {"email": f"upd.{user_id[:8]}@saap.com", "password": "SenhaForte123!", "role": "RECEPTIONIST"})
    log("5.2", "UPDATE", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")
    log("5.2", "DELETE", "PASS" if api("DELETE", f"/users/{user_id}", admin_token).status_code in [200, 204] else "FAIL")

# ═══════════════════════════════════════════════════════════
# 5.3 PACIENTES
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.3 PACIENTES ═══")

r = api("GET", "/patients", admin_token)
existing_patients = r.json() if r.status_code == 200 else []
patient_id = existing_patients[0]["id"] if existing_patients else None
log("5.3", "READ/LIST (existentes)", "PASS" if patient_id else "FAIL", f"{len(existing_patients)} pacientes")

if patient_id:
    log("5.3", "READ por ID", "PASS" if api("GET", f"/patients/{patient_id}", admin_token).status_code == 200 else "FAIL")

    current = api("GET", f"/patients/{patient_id}", admin_token).json()
    r = api("PUT", f"/patients/{patient_id}", admin_token, {"name": current["name"], "cpf": current["cpf"], "phone": current["phone"], "birthDate": current["birthDate"]})
    log("5.3", "UPDATE", "PASS" if r.status_code == 200 else "FAIL", f"HTTP {r.status_code}")

log("5.3", "CPF inválido → 400", "PASS" if api("POST", "/patients", admin_token, {"name": "Teste", "cpf": "00000000000", "phone": "11999999999", "birthDate": "1990-01-01"}).status_code == 400 else "FAIL")
log("5.3", "SUS inválido → 400", "PASS" if api("POST", "/patients", admin_token, {"name": "Teste", "cpf": "44444444438", "susNumber": "123", "phone": "11999999999", "birthDate": "1990-01-01"}).status_code == 400 else "FAIL")

# ═══════════════════════════════════════════════════════════
# 5.4 PROFISSIONAIS
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.4 PROFISSIONAIS ═══")

r = api("GET", "/professionals", admin_token)
log("5.4", "LIST", "PASS" if r.status_code == 200 else "FAIL", f"{len(r.json())} profissionais")

profs = r.json()
if profs:
    pid = profs[0]["id"]
    log("5.4", "READ por ID", "PASS" if api("GET", f"/professionals/{pid}", admin_token).status_code == 200 else "FAIL")

# ═══════════════════════════════════════════════════════════
# 5.5 SERVIÇOS
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.5 SERVIÇOS ═══")

r = api("POST", "/services", admin_token, {"name": f"Consulta {random.randint(1000,9999)}", "durationMinutes": 30, "price": 200.00})
svc_id = r.json().get("id") if r.status_code in [200, 201] else None
log("5.5", "CREATE", "PASS" if svc_id else "FAIL", f"HTTP {r.status_code}")

if svc_id:
    log("5.5", "READ", "PASS" if api("GET", f"/services/{svc_id}", admin_token).status_code == 200 else "FAIL")
    log("5.5", "UPDATE", "PASS" if api("PUT", f"/services/{svc_id}", admin_token, {"name": "Consulta Atualizada", "durationMinutes": 45, "price": 250}).status_code == 200 else "FAIL")
    log("5.5", "DELETE", "PASS" if api("DELETE", f"/services/{svc_id}", admin_token).status_code in [200, 204] else "FAIL")

log("5.5", "LIST", "PASS" if api("GET", "/services", admin_token).status_code == 200 else "FAIL")

# ═══════════════════════════════════════════════════════════
# 5.6 AGENDAMENTOS (State Machine Completa)
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.6 AGENDAMENTOS ═══")

apt_patient = existing_patients[0]["id"] if existing_patients else None
apt_prof = linked_prof_id
r = api("GET", "/services", admin_token)
apt_svc = r.json()[0]["id"] if r.json() else None

if all([apt_patient, apt_prof, apt_svc]):
    log("5.6", "Setup dados", "PASS")

    # Criar agendamento HOJE com horário único
    unique_min = (datetime.now().minute + random.randint(5, 55)) % 60
    h = datetime.now().hour + 1
    if h > 23: h = 8
    future_date = datetime.now().strftime("%Y-%m-%dT") + f"{h:02d}:{unique_min:02d}:00"

    # CREATE → PENDING (ou reusar ARRIVED existente)
    r = api("POST", "/appointments", admin_token, {"patientId": apt_patient, "professionalId": apt_prof, "serviceId": apt_svc, "dateTime": future_date, "paymentMethod": "PIX"})
    if r.status_code == 409:
        r2 = api("GET", f"/appointments?professionalId={apt_prof}", admin_token)
        existing = [a for a in r2.json() if a["status"] == "ARRIVED"]
        if existing:
            apt_id = existing[0]["id"]
            log("5.6", f"CREATE → 409, reusando ARRIVED existente", "PASS", f"id={apt_id[:8]}...")
        else:
            apt_id = None
            log("5.6", "CREATE", "FAIL", "409 sem ARRIVED existente")
    else:
        apt_id = r.json().get("id") if r.status_code in [200, 201] else None
        log("5.6", f"CREATE → {r.json().get('status','?') if r.status_code in [200,201] else r.status_code}", "PASS" if apt_id else "FAIL")

    if apt_id:
        log("5.6", "READ", "PASS" if api("GET", f"/appointments/{apt_id}", admin_token).status_code == 200 else "FAIL")
        log("5.6", "LIST com filtro", "PASS" if api("GET", f"/appointments?professionalId={apt_prof}", admin_token).status_code == 200 else "FAIL")

        # CONFIRM → CONFIRMED
        r = api("PUT", f"/appointments/{apt_id}/confirm", admin_token)
        log("5.6", f"CONFIRM → {r.json().get('status','?') if r.status_code == 200 else r.status_code}", "PASS" if r.status_code == 200 else "FAIL")

        # CHECK-IN → ARRIVED
        r = api("PUT", f"/appointments/{apt_id}/check-in", admin_token, {"verifiedLevel": "P5"})
        log("5.6", f"CHECK-IN → {r.json().get('status','?') if r.status_code == 200 else r.status_code}", "PASS" if r.status_code == 200 else "FAIL")

        # NEXT → CALLING (requer PROFESSIONAL)
        prof_tok = role_tokens.get("PROFESSIONAL", admin_token)
        r = api("POST", "/appointments/next", prof_tok)
        log("5.6", f"NEXT → {r.status_code}", "PASS" if r.status_code == 200 else "FAIL", r.json().get("appointmentId", "")[:8] if r.status_code == 200 else r.text[:80])

        # START → IN_PROGRESS (requer CALLING antes)
        r = api("PUT", f"/appointments/{apt_id}/start", prof_tok)
        log("5.6", f"START → {r.json().get('status','?') if r.status_code == 200 else r.status_code}", "PASS" if r.status_code == 200 else "FAIL")

        # COMPLETE → COMPLETED (requer clinicalEvolution + prontuário já registrado)
        if r.status_code == 200:
            # Registrar prontuário primeiro (backend requer ordem: prontuário → complete)
            r_pront = api("POST", "/medical-records/entries", prof_tok, {"appointmentId": apt_id, "evolution": "Evolução antes de complete"})
            r = api("PUT", f"/appointments/{apt_id}/complete", prof_tok, {"clinicalEvolution": "Paciente atendido. Sem intercorrências."})
            log("5.6", f"COMPLETE → {r.json().get('status','?') if r.status_code == 200 else r.status_code}", "PASS" if r.status_code == 200 else "FAIL")
        else:
            log("5.6", "COMPLETE", "SKIP", "START não completou")

    # CANCEL (fluxo alternativo)
    r = api("POST", "/appointments", admin_token, {"patientId": apt_patient, "professionalId": apt_prof, "serviceId": apt_svc, "dateTime": (datetime.now() + timedelta(days=70)).strftime("%Y-%m-%dT09:00:00"), "paymentMethod": "DINHEIRO"})
    if r.status_code in [200, 201]:
        cid = r.json()["id"]
        r2 = api("PUT", f"/appointments/{cid}/cancel", admin_token, {"reason": "Teste cancelamento"})
        log("5.6", f"CANCEL → {r2.json().get('status','?') if r2.status_code == 200 else r2.status_code}", "PASS" if r2.status_code == 200 else "FAIL")
else:
    log("5.6", "Setup dados", "FAIL", f"patient={apt_patient}, prof={apt_prof}, svc={apt_svc}")

# ═══════════════════════════════════════════════════════════
# 5.7 PRONTUÁRIO
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.7 PRONTUÁRIO ═══")

prof_tok = role_tokens.get("PROFESSIONAL", admin_token)
if apt_patient:
    r = api("GET", f"/medical-records/patients/{apt_patient}", prof_tok)
    log("5.7", "GET prontuário", "PASS" if r.status_code in [200, 404] else "FAIL", f"HTTP {r.status_code}")

    if apt_id:
        # CREATE entrada (precisa agendamento IN_PROGRESS)
        r = api("POST", "/medical-records/entries", prof_tok, {"appointmentId": apt_id, "evolution": "Evolução clínica de teste"})
        log("5.7", "CREATE entrada", "PASS" if r.status_code in [200, 201, 409] else "FAIL", f"HTTP {r.status_code}: {r.text[:80]}")

        if r.status_code in [200, 201]:
            entry_id = r.json().get("id")
            if entry_id:
                # UPDATE entrada
                r2 = api("PUT", f"/medical-records/entries/{entry_id}", prof_tok, {"evolution": "Evolução atualizada"})
                log("5.7", "UPDATE entrada", "PASS" if r2.status_code == 200 else "FAIL", f"HTTP {r2.status_code}")
else:
    log("5.7", "GET prontuário", "SKIP", "sem patient_id")

# ═══════════════════════════════════════════════════════════
# 5.8 AUDITORIA
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.8 AUDITORIA ═══")

r = api("GET", "/audit-logs", admin_token)
if r.status_code == 200:
    logs = r.json()
    log("5.8", "LIST", "PASS", f"{len(logs)} logs")
    if logs:
        log("5.8", "Logs com action+timestamp", "PASS" if all("action" in l and "timestamp" in l for l in logs[:5]) else "FAIL")
else:
    log("5.8", "LIST", "FAIL", f"HTTP {r.status_code}")

# ═══════════════════════════════════════════════════════════
# 5.9 RBAC
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.9 RBAC ═══")

log("5.9", "ADMIN → GET /users", "PASS" if api("GET", "/users", admin_token).status_code == 200 else "FAIL")
log("5.9", "ADMIN → GET /audit-logs", "PASS" if api("GET", "/audit-logs", admin_token).status_code == 200 else "FAIL")

if "RECEPTIONIST" in role_tokens:
    log("5.9", "RECEPTIONIST → POST /users → 403/400", "PASS" if api("POST", "/users", role_tokens["RECEPTIONIST"], {"email": "x@x.com", "password": "123", "role": "PATIENT"}).status_code in [403, 400] else "FAIL")
    log("5.9", "RECEPTIONIST → GET /patients", "PASS" if api("GET", "/patients", role_tokens["RECEPTIONIST"]).status_code == 200 else "FAIL")
    log("5.9", "RECEPTIONIST → GET /audit-logs → 403", "PASS" if api("GET", "/audit-logs", role_tokens["RECEPTIONIST"]).status_code == 403 else "FAIL")

if "PROFESSIONAL" in role_tokens:
    log("5.9", "PROFESSIONAL → GET prontuário", "PASS" if api("GET", f"/medical-records/patients/{apt_patient}", role_tokens["PROFESSIONAL"]).status_code in [200, 404] else "FAIL")

if "ASSISTANT" in role_tokens:
    log("5.9", "ASSISTANT → GET /professionals → 403", "PASS" if api("GET", "/professionals", role_tokens["ASSISTANT"]).status_code == 403 else "FAIL")

log("5.9", "Sem token → 401", "PASS" if api("GET", "/users").status_code == 401 else "FAIL")

# ═══════════════════════════════════════════════════════════
# 5.10 VALIDAÇÕES
# ═══════════════════════════════════════════════════════════
print("\n═══ 5.10 VALIDAÇÕES ═══")

log("5.10", "Email inválido → 400", "PASS" if api("POST", "/users", admin_token, {"email": "invalid", "password": "123456", "role": "PATIENT"}).status_code == 400 else "FAIL")
log("5.10", "Campo obrigatório → 400", "PASS" if api("POST", "/services", admin_token, {"name": "", "durationMinutes": 30, "price": 100}).status_code == 400 else "FAIL")
log("5.10", "Duração 0 → 400", "PASS" if api("POST", "/services", admin_token, {"name": "T", "durationMinutes": 0, "price": 100}).status_code == 400 else "FAIL")
log("5.10", "Preço negativo → 400", "PASS" if api("POST", "/services", admin_token, {"name": "T", "durationMinutes": 30, "price": -10}).status_code == 400 else "FAIL")

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
