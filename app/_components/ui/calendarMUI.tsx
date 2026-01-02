"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import Box from "@mui/material/Box";

type MuiCalendarProps = {
    value: Date;
    onSelect: (date: Date) => void;
    minDate?: Date;
};

export function MuiCalendar({ value, onSelect, minDate }: MuiCalendarProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <Box 
                sx={{ 
                    height: "100%",
                    width: "100%", 
                    maxWidth: "100%",
                    mx: "auto",

                 }}
            >
                <DateCalendar
                    value={value}
                    minDate={minDate}
                    onChange={(newValue) => {
                        if (!newValue) return;
                        onSelect(newValue); // newValue já é Date
                    }}

                    sx={{
                        height: "100%",
                        width: "100%",
                        maxWidth: "100%",
                        bgcolor: "hsl(var(--primary))",
                        color: "hsl(var(--primary-foreground))",
                        borderRadius: "24px",
                        p: 2,
                        border: "1px solid hsl(var(--border))",

                        /* Cabeçalho mês/ano */
                        "& .MuiPickersCalendarHeader-label": {
                            color: "hsl(var(--primary-foreground))",
                            fontWeight: 600,
                        },

                        /* Dias da semana (Seg, Ter, Qua…) */
                        "& .MuiDayCalendar-weekDayLabel": {
                            color: "hsl(var(--primary-foreground))",
                            opacity: 0.7,
                        },

                        /* Dias normais */
                        "& .MuiPickersDay-root": {
                            color: "hsl(var(--primary-foreground))",
                            borderRadius: "12px",
                            width: "40px",
                            height: "40px",
                        },

                        /* Hover */
                        "& .MuiPickersDay-root:hover": {
                            backgroundColor: "hsl(var(--secondary))",
                        },

                        /* Dia selecionado */
                        "& .MuiPickersDay-root.Mui-selected": {
                            backgroundColor: "hsl(var(--secondary))",
                            color: "hsl(var(--secondary-foreground))",
                            fontWeight: 700,
                        },

                        /* Hoje */
                        "& .MuiPickersDay-today": {
                            border: "1px solid hsl(var(--secondary))",
                        },

                        /* Setas */
                        "& .MuiPickersArrowSwitcher-button": {
                            color: "hsl(var(--primary-foreground))",
                        },

                        "& .MuiDayCalendar-monthContainer": {
                            width: "100%",
                        },

                        "& .MuiDayCalendar-weekContainer": {
                            width: "100%",
                            justifyContent: "space-between",
                        },

                        "& .MuiDayCalendar-header":{
                            width: "100%",
                            justifyContent: "space-between",
                        }
                    }}
                />
            </Box>
        </LocalizationProvider>
    );
}