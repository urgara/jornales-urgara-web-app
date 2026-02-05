import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, NumberInput, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Controller, useForm } from 'react-hook-form';
import {
	AgencySelect,
	CompanySelect,
	ProductSelect,
	TerminalSelect,
	WorkerSelect,
	WorkShiftSelect,
} from '@/components';
import { useAuthStore } from '@/stores';
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
	const admin = useAuthStore((state) => state.admin);
	const { mutate: createWorkerAssignment, isPending } = useMutationCreateWorkerAssignment();

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<Omit<CreateWorkerAssignmentRequest, 'localityId'>>({
		resolver: zodResolver(CreateWorkerAssignmentRequestSchema.omit({ localityId: true })),
		defaultValues: {
			workerId: '',
			workShiftId: '',
			date: '',
			additionalPercent: '',
			companyId: '',
			agencyId: '',
			terminalId: '',
			productId: '',
		},
	});

	const onSubmit = (data: Omit<CreateWorkerAssignmentRequest, 'localityId'>) => {
		console.log('onSubmit data:', data);
		console.log('admin:', admin);

		// Asegurar que se use la localidad del admin (ya sea local o la que seleccionó el ADMIN global)
		const submitData: CreateWorkerAssignmentRequest = {
			...data,
			localityId: admin?.localityId || '',
		};

		console.log('submitData:', submitData);

		// Solo incluir additionalPercent si tiene un valor válido
		if (!data.additionalPercent || data.additionalPercent === '') {
			delete submitData.additionalPercent;
		}

		createWorkerAssignment(submitData, {
			onSuccess: () => {
				console.log('Success!');
				reset();
				onClose();
			},
			onError: (error) => {
				console.error('Error creating worker assignment:', error);
			},
		});
	};

	const onError = (errors: any) => {
		console.log('Form validation errors:', errors);
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
			<form onSubmit={handleSubmit(onSubmit, onError)}>
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
						name='companyId'
						control={control}
						render={({ field }) => (
							<CompanySelect
								placeholder='Seleccione una empresa'
								value={field.value}
								onChange={(value) => field.onChange(value || '')}
								onBlur={field.onBlur}
								error={errors.companyId?.message}
								required
							/>
						)}
					/>

					<Controller
						name='agencyId'
						control={control}
						render={({ field }) => (
							<AgencySelect
								placeholder='Seleccione una agencia'
								value={field.value}
								onChange={(value) => field.onChange(value || '')}
								onBlur={field.onBlur}
								error={errors.agencyId?.message}
								required
							/>
						)}
					/>

					<Controller
						name='terminalId'
						control={control}
						render={({ field }) => (
							<TerminalSelect
								placeholder='Seleccione un terminal'
								value={field.value}
								onChange={(value) => field.onChange(value || '')}
								onBlur={field.onBlur}
								error={errors.terminalId?.message}
								required
							/>
						)}
					/>

					<Controller
						name='productId'
						control={control}
						render={({ field }) => (
							<ProductSelect
								placeholder='Seleccione un producto'
								value={field.value}
								onChange={(value) => field.onChange(value || '')}
								onBlur={field.onBlur}
								error={errors.productId?.message}
								required
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
