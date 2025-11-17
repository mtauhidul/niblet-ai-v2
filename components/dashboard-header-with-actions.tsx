"use client";

import { ReactNode } from "react";

interface DashboardHeaderWithActionsProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function DashboardHeaderWithActions({ 
  title, 
  description, 
  actions 
}: DashboardHeaderWithActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}