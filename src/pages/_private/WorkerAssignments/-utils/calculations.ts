import type { ShiftDetail } from '../-models';

export function calculateShiftGross(shift: ShiftDetail): number {
	return shift.workers.reduce((sum, worker) => sum + Number(worker.gross), 0);
}

export function calculateShiftNet(shift: ShiftDetail): number {
	return shift.workers.reduce((sum, worker) => sum + Number(worker.net), 0);
}

export function calculateTotalGross(shifts: ShiftDetail[]): number {
	return shifts.reduce((sum, shift) => sum + calculateShiftGross(shift), 0);
}

export function calculateTotalNet(shifts: ShiftDetail[]): number {
	return shifts.reduce((sum, shift) => sum + calculateShiftNet(shift), 0);
}

export function countTotalWorkers(shifts: ShiftDetail[]): number {
	return shifts.reduce((count, shift) => count + shift.workers.length, 0);
}

export function formatCurrency(value: number): string {
	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: 2,
	}).format(value);
}
