import { Shield, Key, Server, Database, LogIn } from "lucide-react";

export const UnauthenticatedHero = ({ onLogin }) => {
  return (
    <div className="hero-section">
      <div className="hero-badge">
        <Shield size={16} /> Estado: No Autenticado
      </div>

      <h1 className="hero-title">
        Plataforma de Soporte Técnico <span style={{ color: "var(--primary)" }}>MesaTech Cloud</span>
      </h1>

      <p className="hero-subtitle">
        Solución Full Stack Cloud-Native protegida de extremo a extremo mediante <strong>Microsoft Entra ID</strong>, enrutada por <strong>AWS API Gateway</strong> con JWT Authorizer y respaldada por microservicios en <strong>Spring Boot</strong> sobre <strong>Amazon EC2</strong>.
      </p>

      {/* Botones de acción principales */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
        <button className="btn btn-primary" style={{ padding: "0.85rem 1.75rem", fontSize: "1rem" }} onClick={onLogin}>
          <LogIn size={20} />
          Iniciar Sesión con Microsoft Entra ID
        </button>
      </div>


      {/* Arquitectura de 4 Pilares */}
      <div className="hero-features">
        <div className="feature-box">
          <div className="feature-icon">
            <Key size={22} />
          </div>
          <h3 className="feature-title">1. Microsoft Entra ID</h3>
          <p className="feature-desc">
            Proveedor de identidad centralizado. Emisión de tokens JWT v2.0 con App Roles (Cliente, Operador, Administrador) y scopes delegados.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <Server size={22} />
          </div>
          <h3 className="feature-title">2. AWS API Gateway</h3>
          <p className="feature-desc">
            Único punto de entrada consumido por la SPA. Valida en el borde los tokens con un JWT Authorizer y gestiona políticas CORS.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <Shield size={22} />
          </div>
          <h3 className="feature-title">3. BFF & Microservicios</h3>
          <p className="feature-desc">
            Backend for Frontend en Spring Boot para autorización RBAC sin acceso a BD, enrutando a Gestión de Solicitudes y Catálogo.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon">
            <Database size={22} />
          </div>
          <h3 className="feature-title">4. Persistencia en AWS</h3>
          <p className="feature-desc">
            Base de datos relacional MySQL (Amazon RDS vs EC2 Engine) con esquema normalizado e historial auditable de transiciones.
          </p>
        </div>
      </div>
    </div>
  );
};
