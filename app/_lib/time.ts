export function formatMinutesToHHMM(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    return `${paddedHours}:${paddedMinutes}`;
}

export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
}

export function intervalsOverlap(
    startA: Date, 
    endA: Date, 
    startB: Date, 
    endB: Date
): boolean {
    return startA < endB && startB < endA;
}