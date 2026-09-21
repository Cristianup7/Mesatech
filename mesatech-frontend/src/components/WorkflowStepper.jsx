import React from "react";
import { ChevronRight } from "lucide-react";

export const WorkflowStepper = ({ estadoActual }) => {
  const steps = ["CREADA", "ASIGNADA", "EN_PROCESO", "RESUELTA", "CERRADA"];

  if (estadoActual === "CANCELADA") {
    return (
      <div className="workflow-stepper">
        <span className="step-node current" style={{ background: "#dc2626" }}>
          CANCELADA
        </span>
      </div>
    );
  }

  const currentIndex = steps.indexOf(estadoActual);

  return (
    <div className="workflow-stepper">
      {steps.map((step, idx) => {
        const isCompleted = currentIndex > idx;
        const isCurrent = currentIndex === idx;

        let nodeClass = "step-node";
        if (isCompleted) nodeClass += " completed";
        if (isCurrent) nodeClass += " current";

        return (
          <React.Fragment key={step}>
            <span className={nodeClass}>
              {step.replace("_", " ")}
            </span>
            {idx < steps.length - 1 && (
              <ChevronRight size={12} className="step-arrow" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
