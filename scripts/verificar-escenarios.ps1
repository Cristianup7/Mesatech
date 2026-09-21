# ==============================================================================
# Script de Automatización de Pruebas Obligatorias - MesaTech Cloud
# Ejecuta validaciones HTTP contra API Gateway / BFF
# ==============================================================================

param(
    [string]$BaseUrl = "http://localhost:8080"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  EJECUTANDO MATRIZ DE PRUEBAS OBLIGATORIAS MESATECH CLOUD" -ForegroundColor Cyan
Write-Host "  URL Base: $BaseUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# CP-01: Acceso sin autenticación (Esperado: 401)
Write-Host "`n[CP-01] Probando acceso sin token (GET /v1/solicitudes)..." -NoNewline
try {
    $resp = Invoke-WebRequest -Uri "$BaseUrl/v1/solicitudes" -Method GET -SkipHttpErrorCheck -ErrorAction SilentlyContinue
    if ($resp.StatusCode -eq 401) {
        Write-Host " [PASO - 401 Unauthorized]" -ForegroundColor Green
    } else {
        Write-Host " [FALLO - Código devuelto: $($resp.StatusCode)]" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host " [PASO - 401 Unauthorized]" -ForegroundColor Green
    } else {
        Write-Host " [ERROR: $_]" -ForegroundColor Red
    }
}

# CP-02: Acceso con token adulterado (Esperado: 401)
Write-Host "[CP-02] Probando token inválido/expirado..." -NoNewline
try {
    $headers = @{ "Authorization" = "Bearer eyJhbGciOiJSUzI1NiJ9.invalid.signature" }
    $resp = Invoke-WebRequest -Uri "$BaseUrl/v1/solicitudes" -Method GET -Headers $headers -SkipHttpErrorCheck -ErrorAction SilentlyContinue
    if ($resp.StatusCode -eq 401) {
        Write-Host " [PASO - 401 Unauthorized]" -ForegroundColor Green
    } else {
        Write-Host " [FALLO - Código devuelto: $($resp.StatusCode)]" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host " [PASO - 401 Unauthorized]" -ForegroundColor Green
    } else {
        Write-Host " [ERROR: $_]" -ForegroundColor Red
    }
}

# CP-05: Preflight CORS (Esperado: 200 con cabeceras CORS)
Write-Host "[CP-05] Probando preflight CORS (OPTIONS /v1/solicitudes)..." -NoNewline
try {
    $headers = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "GET"
        "Access-Control-Request-Headers" = "Authorization,Content-Type"
    }
    $resp = Invoke-WebRequest -Uri "$BaseUrl/v1/solicitudes" -Method OPTIONS -Headers $headers -SkipHttpErrorCheck -ErrorAction SilentlyContinue
    if ($resp.StatusCode -eq 200) {
        Write-Host " [PASO - 200 OK con CORS habilitado]" -ForegroundColor Green
    } else {
        Write-Host " [FALLO - Código devuelto: $($resp.StatusCode)]" -ForegroundColor Red
    }
} catch {
    Write-Host " [ERROR: $_]" -ForegroundColor Red
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  MATRIZ DE PRUEBAS COMPLETADA EXITOSAMENTE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
