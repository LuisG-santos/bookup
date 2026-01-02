"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";

type Props = {
  children: React.ReactNode;
};

export function MuiLocalizationProvider({ children }: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      {children}
    </LocalizationProvider>
  );
}
