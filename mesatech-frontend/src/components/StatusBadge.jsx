import React from "react";
import { CircleDot, CheckCircle2, Clock, PlayCircle, AlertCircle, XCircle } from "lucide-react";

export const StatusBadge = ({ estado }) => {
  const getBadgeDetails = () => {
    switch (estado) {
      case "CREADA":
        return {
          label: "Creada",
          className: "status-badge status-creada",
          icon: <CircleDot size={13} />
        };
      case "ASIGNADA":
        return {
          label: "Asignada",
          className: "status-badge status-asignada",
          icon: <Clock size={13} />
        };
      case "EN_PROCESO":
        return {
          label: "En Proceso",
          className: "status-badge status-en_proceso",
          icon: <PlayCircle size={13} />
        };
      case "RESUELTA":
        return {
          label: "Resuelta",
          className: "status-badge status-resuelta",
          icon: <CheckCircle2 size={13} />
        };
      case "CERRADA":
        return {
          label: "Cerrada",
          className: "status-badge status-cerrada",
          icon: <CheckCircle2 size={13} />
        };
      case "CANCELADA":
        return {
          label: "Cancelada",
          className: "status-badge status-cancelada",
          icon: <XCircle size={13} />
        };
      default:
        return {
          label: estado || "Desconocido",
          className: "status-badge status-creada",
          icon: <AlertCircle size={13} />
        };
    }
  };

  const { label, className, icon } = getBadgeDetails();

  return (
    <span className={className}>
      {icon}
      {label}
    </span>
  );
};
