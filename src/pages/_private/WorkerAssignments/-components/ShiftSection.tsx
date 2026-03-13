import {
	ActionIcon,
	Button,
	Divider,
	Group,
	NumberInput,
	Select,
	Stack,
	Text,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Control, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Controller, useFieldArray } from 'react-hook-form';
import { WorkerSelect } from '@/components';
import { useQuerySelectWorkShifts } from '@/hooks';
import { WORKER_CATEGORY_OPTIONS } from '@/models';
import { BaseValueSelect, type BaseValueSelection } from './BaseValueSelect';

interface ShiftSectionProps {
	shiftIndex: number;
	control: Control<any>;
	errors: FieldErrors<any>;
	date?: string;
	onRemove: () => void;
	canRemove: boolean;
	setValue: UseFormSetValue<any>;
	watch: UseFormWatch<any>;
}

export function ShiftSection({
	shiftIndex,
	control,
	errors,
	date,
	onRemove,
	canRemove,
	setValue,
	watch,
}: ShiftSectionProps) {
	const { data: workShiftsData } = useQuerySelectWorkShifts();
	const [baseValueKeys, setBaseValueKeys] = useState<Record<number, string | null>>({});

	const { fields, append, remove } = useFieldArray({
		control,
		name: `shifts.${shiftIndex}.workers`,
	});

	const workShiftId = watch(`shifts.${shiftIndex}.workShiftId`);

	const selectedCoefficient = useMemo(() => {
		if (!workShiftId || !workShiftsData?.data) return undefined;
		return workShiftsData.data.find((ws) => ws.id === workShiftId)?.coefficient;
	}, [workShiftId, workShiftsData?.data]);

	const prevWorkShiftIdRef = useRef(workShiftId);
	useEffect(() => {
		if (prevWorkShiftIdRef.current === workShiftId) return;
		prevWorkShiftIdRef.current = workShiftId;
		setBaseValueKeys({});
		for (let i = 0; i < fields.length; i++) {
			setValue(`shifts.${shiftIndex}.workers.${i}.value`, {
				workShiftBaseValueId: '',
				coefficient: '',
			});
		}
	}, [workShiftId, fields.length, setValue, shiftIndex]);

	const handleBaseValueChange = (workerIndex: number, selection: BaseValueSelection | null) => {
		if (selection) {
			setValue(`shifts.${shiftIndex}.workers.${workerIndex}.value`, selection);
			setBaseValueKeys((prev) => ({
				...prev,
				[workerIndex]: `${selection.workShiftBaseValueId}|${selection.coefficient}`,
			}));
		} else {
			setValue(`shifts.${shiftIndex}.workers.${workerIndex}.value`, {
				workShiftBaseValueId: '',
				coefficient: '',
			});
			setBaseValueKeys((prev) => ({ ...prev, [workerIndex]: null }));
		}
	};

	const handleAddWorker = () => {
		append({
			workerId: '',
			category: undefined as unknown as 'IDONEO' | 'PERITO',
			value: { workShiftBaseValueId: '', coefficient: '' },
			additionalPercent: '',
		});
	};

	const formatDays = (days: string[]): string => {
		const dayLabels: Record<string, string> = {
			M: 'Lun',
			T: 'Mar',
			W: 'Mié',
			Th: 'Jue',
			F: 'Vie',
			S: 'Sáb',
			Su: 'Dom',
		};
		return days.map((day) => dayLabels[day] || day).join(', ');
	};

	const getWorkShiftDescription = (wsId: string): string => {
		if (!workShiftsData?.data) return '';
		const ws = workShiftsData.data.find((w) => w.id === wsId);
		if (!ws) return '';
		return ws.description || formatDays(ws.days);
	};

	const shiftErrors = (errors.shifts as any)?.[shiftIndex];

	return (
		<Stack
			gap='sm'
			style={{
				border: '2px solid var(--mantine-color-blue-6)',
				borderRadius: 8,
				padding: 16,
				marginTop: 8,
			}}
		>
			<Group justify='space-between'>
				<Text size='md' fw={600}>
					Turno {shiftIndex + 1}
					{workShiftId && ` - ${getWorkShiftDescription(workShiftId)}`}
				</Text>
				{canRemove && (
					<ActionIcon variant='light' color='red' onClick={onRemove}>
						<IconTrash size={18} />
					</ActionIcon>
				)}
			</Group>

			<Controller
				name={`shifts.${shiftIndex}.workShiftId`}
				control={control}
				render={({ field }) => (
					<Select
						label='Turno'
						placeholder='Seleccione un turno'
						data={
							workShiftsData?.data?.map((ws) => {
								const displayName = ws.description || formatDays(ws.days);
								return {
									value: ws.id,
									label: `${displayName} (Coef: ${ws.coefficient})`,
								};
							}) || []
						}
						value={field.value || null}
						onChange={(value) => field.onChange(value || '')}
						onBlur={field.onBlur}
						error={shiftErrors?.workShiftId?.message}
						required
					/>
				)}
			/>

			<Divider my='xs' label='Trabajadores' labelPosition='center' />

			<Group justify='space-between'>
				<Text size='sm' fw={500}>
					Trabajadores del turno
				</Text>
				<Button
					variant='light'
					size='xs'
					leftSection={<IconPlus size={14} />}
					onClick={handleAddWorker}
				>
					Agregar trabajador
				</Button>
			</Group>

			{shiftErrors?.workers?.root?.message && (
				<Text c='red' size='sm'>
					{shiftErrors.workers.root.message}
				</Text>
			)}

			{fields.map((field, workerIndex) => {
				const categoryValue = watch(`shifts.${shiftIndex}.workers.${workerIndex}.category`);
				const workerErrors = shiftErrors?.workers?.[workerIndex];

				return (
					<Stack
						key={field.id}
						gap='xs'
						style={{
							border: '1px solid var(--mantine-color-dark-4)',
							borderRadius: 8,
							padding: 12,
						}}
					>
						<Group justify='space-between'>
							<Text size='sm' fw={500}>
								Trabajador {workerIndex + 1}
							</Text>
							{fields.length > 1 && (
								<ActionIcon
									variant='subtle'
									color='red'
									size='sm'
									onClick={() => {
										remove(workerIndex);
										setBaseValueKeys((prev) => {
											const next = { ...prev };
											delete next[workerIndex];
											return next;
										});
									}}
								>
									<IconTrash size={14} />
								</ActionIcon>
							)}
						</Group>

						<Controller
							name={`shifts.${shiftIndex}.workers.${workerIndex}.workerId`}
							control={control}
							render={({ field: workerField }) => (
								<WorkerSelect
									label='Trabajador'
									placeholder='Seleccione un trabajador'
									value={workerField.value}
									onChange={(value) => workerField.onChange(value || '')}
									onBlur={workerField.onBlur}
									error={workerErrors?.workerId?.message}
									required
								/>
							)}
						/>

						<Controller
							name={`shifts.${shiftIndex}.workers.${workerIndex}.category`}
							control={control}
							render={({ field: catField }) => (
								<Select
									label='Categoría'
									placeholder='Seleccione una categoría'
									data={
										WORKER_CATEGORY_OPTIONS as unknown as { value: string; label: string }[]
									}
									value={catField.value || null}
									onChange={(value) => catField.onChange(value || '')}
									onBlur={catField.onBlur}
									error={workerErrors?.category?.message}
									required
								/>
							)}
						/>

						<BaseValueSelect
							label='Valor base'
							placeholder='Seleccione un valor base'
							date={date}
							category={categoryValue || undefined}
							coefficient={selectedCoefficient}
							value={baseValueKeys[workerIndex] ?? null}
							onChange={(selection) => handleBaseValueChange(workerIndex, selection)}
							error={
								workerErrors?.value?.workShiftBaseValueId?.message ||
								workerErrors?.value?.coefficient?.message
							}
							required
						/>

						<Controller
							name={`shifts.${shiftIndex}.workers.${workerIndex}.additionalPercent`}
							control={control}
							render={({ field: apField }) => (
								<NumberInput
									label='Bonificación / Descuento'
									placeholder='Ej: 15,00 o -10,00'
									value={apField.value ? Number(apField.value) : undefined}
									onChange={(value) => {
										if (value === '' || value === null || value === undefined) {
											apField.onChange('');
										} else {
											apField.onChange(String(value));
										}
									}}
									onBlur={apField.onBlur}
									error={workerErrors?.additionalPercent?.message}
									decimalSeparator=','
									thousandSeparator='.'
									allowNegative={true}
									decimalScale={2}
									fixedDecimalScale={false}
									styles={{
										input: {
											color:
												apField.value && Number(apField.value) !== 0
													? Number(apField.value) > 0
														? 'var(--mantine-color-green-9)'
														: 'var(--mantine-color-red-9)'
													: undefined,
											fontWeight:
												apField.value && Number(apField.value) !== 0 ? 600 : undefined,
										},
									}}
								/>
							)}
						/>
					</Stack>
				);
			})}
		</Stack>
	);
}
