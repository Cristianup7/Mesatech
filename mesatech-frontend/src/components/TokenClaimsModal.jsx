import React, { useState } from "react";
import { X, ShieldCheck, KeyRound, Copy, Check } from "lucide-react";

export const TokenClaimsModal = ({ isOpen, onClose, claims, rawToken }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (claims) {
      navigator.clipboard.writeText(JSON.stringify(claims, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={24} color="#0284c7" />
            <h2 className="modal-title">Inspector de Token JWT (Microsoft Entra ID)</h2>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
          Este panel demuestra la decodificación de los <strong>claims</strong> incluidos en el token JWT emitido por Entra ID (v2.0) y validados por el <strong>JWT Authorizer de AWS API Gateway</strong> y el <strong>BFF Spring Boot</strong>.
        </p>

        {/* Resumen de Claims Clave */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>AUDIENCE (aud)</span>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0284c7" }}>
              {claims?.aud || "api://api-cloud-native"}
            </div>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>ROLES ASIGNADOS (roles)</span>
            <div style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: claims?.roles && claims.roles.length > 0 ? "#16a34a" : "#dc2626"
            }}>
              {claims?.roles && Array.isArray(claims.roles) && claims.roles.length > 0
                ? `Rol: ${claims.roles.join(", ")}`
                : "Sin rol asignado en JWT"}
            </div>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>SUBJECT (sub)</span>
            <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#334155" }}>
              {claims?.sub || "N/A"}
            </div>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>EXPIRACIÓN (exp)</span>
            <div style={{ fontSize: "0.8rem", color: "#334155" }}>
              {claims?.exp ? new Date(claims.exp * 1000).toLocaleTimeString() : "N/A"}
            </div>
          </div>
        </div>

        {/* Banner explicativo del estado del claim roles */}
        {claims?.roles && claims.roles.length > 0 ? (
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "0.5rem",
            padding: "0.65rem 0.9rem",
            marginBottom: "1.25rem",
            fontSize: "0.83rem",
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Check size={18} color="#16a34a" />
            <div>
              <strong>Rol {Array.isArray(claims.roles) ? claims.roles.join(", ") : claims.roles} asignado en JWT:</strong> El token decodificado contiene el claim <code>"roles": {JSON.stringify(claims.roles)}</code> verificado por Microsoft Entra ID.
            </div>
          </div>
        ) : (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "0.5rem",
            padding: "0.65rem 0.9rem",
            marginBottom: "1.25rem",
            fontSize: "0.83rem",
            color: "#991b1b",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span style={{ fontSize: "1.1rem" }}>⚠️</span>
            <div>
              <strong>Sin rol asignado en el JWT:</strong> Este usuario no tiene el claim <code>roles</code> en el token. El BFF autoriza sus operaciones según su identidad de dominio (@curzua1.onmicrosoft.com).
            </div>
          </div>
        )}

        {/* Payload JSON Completo */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <KeyRound size={16} /> Payload Completo de Claims:
          </span>
          <button className="btn btn-outline btn-sm" onClick={handleCopy}>
            {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            {copied ? "Copiado" : "Copiar JSON"}
          </button>
        </div>

        <pre className="code-block">
          {JSON.stringify(claims, null, 2)}
        </pre>

        {rawToken && (
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ fontSize: "0.8rem", color: "var(--text-muted)", cursor: "pointer" }}>
              Ver Token JWT Crudo (Compacto Base64)
            </summary>
            <div className="code-block" style={{ wordBreak: "break-all", fontSize: "0.72rem" }}>
              {rawToken}
            </div>
          </details>
        )}

        <div style={{ textAlign: "right", marginTop: "1.5rem" }}>
          <button className="btn btn-primary" onClick={onClose}>
            Cerrar Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
