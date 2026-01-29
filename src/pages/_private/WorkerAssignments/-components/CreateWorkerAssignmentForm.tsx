import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, NumberInput, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import { WorkerSelect, WorkShiftSelect } from '@/components';
import { useMutationCreateWorkerAssignment } from '../-hooks';
import {
	type CreateWorkerAssignmentRequest,
	CreateWorkerAssignmentRequestSchema,
} from '../-models';

interface CreateWorkerAssignmentFormProps {
	opened: boolean;
	onClose: () => void;
}

export function CreateWorkerAssignmentForm({
	opened,
	onClose,
}: CreateWorkerAssignmentFormProps) {
	const { mutate: createWorkerAssignment, isPending } = useMutationCreateWorkerAssignment();

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<CreateWorkerAssignmentRequest>({
		resolver: zodResolver(CreateWorkerAssignmentRequestSchema),
		defaultValues: {
			workerId: '',
			workShiftId: '',
			date: '',
			additionalPercent: '',
		},
	});

	const onSubmit = (data: CreateWorkerAssignmentRequest) => {
		// Asegurarse de que additionalPercent sea undefined si está vacío
		const submitData: CreateWorkerAssignmentRequest = {
			workerId: data.workerId,
			workShiftId: data.workShiftId,
			date: data.date,
		};

		// Solo incluir additionalPercent si tiene un valor válido
		if (data.additionalPercent && data.additionalPercent !== '') {
			submitData.additionalPercent = data.additionalPercent;
		}

		createWorkerAssignment(submitData, {
			onSuccess: () => {
				reset();
				onClose();
			},
		});
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title='Crear nueva asignación'
			centered
			size='md'
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack>
					<Controller
						name='workerId'
						control={control}
						render={({ field }) => (
							<WorkerSelect
								label='Trabajador'
								placeholder='Seleccione un trabajador'
								value={field.value}
								onChange={(value) => field.onChange(value || '')}
								onBlur={field.onBlur}
								error={errors.workerId?.message}
								required
							/>
						)}
					/>

					<Controller
						name='workShiftId'
						control={control}
						render={({ field }) => (
							<WorkShiftSelect
								label='Turno'
								placeholder='Seleccione un turno'
								value={field.value}
								onChange={(value) => field.onChange(value || '')}
								onBlur={field.onBlur}
								error={errors.workShiftId?.message}
								required
							/>
						)}
					/>

					<Controller
						name='date'
						control={control}
						render={({ field }) => (
							<DateInput
								label='Fecha'
								placeholder='Seleccione la fecha'
								value={field.value ? new Date(field.value) : null}
								onChange={(value) => {
									if (value) {
										const year = value.getFullYear();
										const month = String(value.getMonth() + 1).padStart(2, '0');
										const day = String(value.getDate()).padStart(2, '0');
										field.onChange(`${year}-${month}-${day}`);
									} else {
										field.onChange('');
									}
								}}
								onBlur={field.onBlur}
								error={errors.date?.message}
								required
								valueFormat='DD/MM/YYYY'
							/>
						)}
					/>

					<Controller
						name='additionalPercent'
						control={control}
						render={({ field }) => (
							<NumberInput
								label='Porcentaje adicional'
								placeholder='Ej: 15.00 (para 15%)'
								value={field.value ? Number(field.value) : undefined}
								onChange={(value) => {
									if (value === '' || value === null || value === undefined) {
										field.onChange('');
									} else {
										field.onChange(String(value));
									}
								}}
								onBlur={field.onBlur}
								error={errors.additionalPercent?.message}
								decimalSeparator='.'
								thousandSeparator=''
								allowNegative={false}
								decimalScale={2}
								fixedDecimalScale={false}
							/>
						)}
					/>

					<Button type='submit' loading={isPending} fullWidth>
						Crear asignación
					</Button>
				</Stack>
			</form>
		</Modal>
	);
}
