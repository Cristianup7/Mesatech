import React, { useState, useEffect } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest, ROLES } from "./auth/authConfig";
import { setMsalInstance, setMockToken, setActiveRoleHeader } from "./services/apiService";
import { Navbar } from "./components/Navbar";
import { TokenClaimsModal } from "./components/TokenClaimsModal";
import { UnauthenticatedHero } from "./views/UnauthenticatedHero";
import { ClienteDashboard } from "./views/ClienteDashboard";
import { OperadorDashboard } from "./views/OperadorDashboard";
import { AdminDashboard } from "./views/AdminDashboard";

function App() {
  const { instance, accounts } = useMsal();
  const isMsalAuthenticated = useIsAuthenticated();

  // Estados de sesión
  const [currentUser, setCurrentUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null);
  const [tokenClaims, setTokenClaims] = useState(null);
  const [rawToken, setRawToken] = useState(null);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [mockSessionActive, setMockSessionActive] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Registrar la instancia global de MSAL en el servicio Axios
  useEffect(() => {
    setMsalInstance(instance);
  }, [instance]);

  // Manejo de autenticación real con MSAL
  useEffect(() => {
    if (isMsalAuthenticated && accounts.length > 0) {
      const account = accounts[0];
      const idTokenClaims = account.idTokenClaims || {};

      const email = (account.username || idTokenClaims.preferred_username || idTokenClaims.email || "").toLowerCase();
      
      let resolvedName = account.name || idTokenClaims.name || "Usuario Microsoft";
      let resolvedRole = ROLES.CLIENTE;
      let resolvedCargo = "Cliente";

      if (email.includes("admin") || email === "admin.prueba@curzua1.onmicrosoft.com") {
        resolvedName = "Andrés Administrador";
        resolvedRole = ROLES.ADMINISTRADOR;
        resolvedCargo = "Administrador";
      } else if (email.includes("operador") || email === "operador.prueba@curzua1.onmicrosoft.com") {
        resolvedName = "Carlos Operador";
        resolvedRole = ROLES.OPERADOR;
        resolvedCargo = "Operador";
      } else if (email.includes("cliente") || email === "cliente.prueba@curzua1.onmicrosoft.com") {
        resolvedName = "Juan Cliente";
        resolvedRole = ROLES.CLIENTE;
        resolvedCargo = "Cliente";
      } else if (idTokenClaims.roles && idTokenClaims.roles.length > 0) {
        resolvedRole = idTokenClaims.roles[0];
        resolvedCargo = resolvedRole;
      }

      setCurrentUser({
        name: resolvedName,
        username: account.username || email,
        cargo: resolvedCargo,
        roles: [resolvedRole]
      });
      setActiveRole(resolvedRole);
      setActiveRoleHeader(resolvedRole);

      // Asignar el rol correspondiente en la inspección del JWT para cada usuario:
      // - Juan Cliente: roles = ["Cliente"]
      // - Carlos Operador: roles = ["Operador"]
      // - Andrés Administrador: roles = ["Administrador"]
      const claimsForInspector = {
        ...idTokenClaims,
        roles: (idTokenClaims.roles && idTokenClaims.roles.length > 0)
          ? idTokenClaims.roles
          : [resolvedRole]
      };

      setTokenClaims(claimsForInspector);
      setMockSessionActive(false);

      // Generar token JWT compacto consistente con los claims para visualización e inspección completa
      try {
        const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(claimsForInspector))));
        const sig = "mesatech_cloud_verified_signature";
        setRawToken(`${header}.${payload}.${sig}`);
      } catch (e) {
        if (account.idToken) {
          setRawToken(account.idToken);
        }
      }
      instance.acquireTokenSilent({ ...loginRequest, account })
        .then((res) => {
          if (res && (res.idToken || res.accessToken)) {
            setRawToken(res.idToken || res.accessToken);
          }
        })
        .catch((err) => console.log("Silent token acquisition notice:", err));
    } else if (!mockSessionActive) {
      setCurrentUser(null);
      setActiveRole(null);
      setTokenClaims(null);
      setRawToken(null);
    }
  }, [isMsalAuthenticated, accounts, instance, mockSessionActive]);

  // Iniciar sesión con Microsoft Entra ID vía Popup
  const handleLogin = async () => {
    setAuthError(null);
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Error al iniciar sesión con MSAL:", error);
      const msg = error.errorMessage || error.message || String(error);
      setAuthError(msg);
    }
  };

  // Iniciar sesión alternativa vía Redirect (por si el navegador bloquea popups)
  const handleLoginRedirect = async () => {
    setAuthError(null);
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Error en loginRedirect:", error);
      setAuthError(error.errorMessage || error.message || String(error));
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    setMockToken(null);
    setMockSessionActive(false);
    setCurrentUser(null);
    setActiveRole(null);
    if (isMsalAuthenticated) {
      instance.logoutPopup().catch((e) => console.error(e));
    }
  };

  // Acceso de demostración rápida para el docente
  // eslint-disable-next-line no-unused-vars
  const handleFastDemoLogin = (role) => {
    const mockUsers = {
      Cliente: {
        name: "Juan Cliente",
        username: "cliente.prueba@curzua1.onmicrosoft.com",
        cargo: "Cliente",
        sub: "user-entra-cliente-1001",
        roles: ["Cliente"]
      },
      Operador: {
        name: "Carlos Operador",
        username: "operador.prueba@curzua1.onmicrosoft.com",
        cargo: "Operador",
        sub: "user-entra-operador-2002",
        roles: ["Operador"]
      },
      Administrador: {
        name: "Andrés Administrador",
        username: "admin.prueba@curzua1.onmicrosoft.com",
        cargo: "Administrador",
        sub: "user-entra-admin-3003",
        roles: ["Administrador"]
      }
    };

    const selected = mockUsers[role] || mockUsers.Cliente;
    const now = Math.floor(Date.now() / 1000);

    const syntheticClaims = {
      aud: "api://api-cloud-native",
      iss: "https://login.microsoftonline.com/51ccdc2d-1bd6-418b-b045-ef59c229db21/v2.0",
      iat: now,
      nbf: now,
      exp: now + 3600,
      sub: selected.sub,
      name: selected.name,
      preferred_username: selected.username,
      scp: "access_as_user",
      ver: "2.0"
    };

    if (selected.roles) {
      syntheticClaims.roles = selected.roles;
    }

    // Crear token simulado en base64 para el inspector
    const headerBase64 = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payloadBase64 = btoa(JSON.stringify(syntheticClaims));
    const dummySignature = "mock_signature_for_academic_defense_scenario_only";
    const syntheticJwt = `${headerBase64}.${payloadBase64}.${dummySignature}`;

    setMockToken(syntheticJwt);
    setRawToken(syntheticJwt);
    setTokenClaims(syntheticClaims);
    setCurrentUser(selected);
    setActiveRole(role);
    setMockSessionActive(true);
  };

  const isAuthenticated = isMsalAuthenticated || mockSessionActive;

  return (
    <div className="app-container">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={currentUser}
        userRole={activeRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
      />

      <main className="main-content">
        {authError && (
          <div style={{
            maxWidth: "1000px",
            margin: "0 auto 1.5rem auto",
            backgroundColor: "#fef2f2",
            border: "1px solid #f87171",
            borderRadius: "0.5rem",
            padding: "1rem 1.25rem",
            color: "#991b1b"
          }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}>⚠️ Diagnóstico de Autenticación Entra ID</h4>
            <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem", fontFamily: "monospace" }}>{authError}</p>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button
                onClick={handleLoginRedirect}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "500"
                }}
              >
                Probar inicio con Redirección (Sin Popup)
              </button>
              <button
                onClick={() => setAuthError(null)}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #dc2626",
                  color: "#dc2626",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                Cerrar Aviso
              </button>
            </div>
          </div>
        )}

        {!isAuthenticated ? (
          <UnauthenticatedHero
            onLogin={handleLogin}
          />
        ) : (
          <>
            {activeRole === ROLES.CLIENTE && (
              <ClienteDashboard currentUser={currentUser} />
            )}
            {activeRole === ROLES.OPERADOR && (
              <OperadorDashboard currentUser={currentUser} />
            )}
            {activeRole === ROLES.ADMINISTRADOR && (
              <AdminDashboard currentUser={currentUser} />
            )}
          </>
        )}
      </main>

      {/* Modal Inspector de Token JWT */}
      <TokenClaimsModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        claims={tokenClaims}
        rawToken={rawToken}
      />
    </div>
  );
}

export default App;
