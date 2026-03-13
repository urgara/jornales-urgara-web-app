import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { useAuthStore } from '@/stores';
import { useMutationUpdateWorkerAssignment } from '../-hooks';
import { type ShiftDetail, ShiftInputSchema } from '../-models';
import { ShiftSection } from './ShiftSection';

const EditShiftsFormSchema = z.object({
	shifts: z
		.array(ShiftInputSchema)
		.min(1, 'Debe agregar al menos un turno')
		.refine(
			(shifts) => {
				const shiftIds = shifts.map((s) => s.workShiftId);
				return new Set(shiftIds).size === shiftIds.length;
			},
			{ message: 'No puede haber turnos duplicados' }
		),
});

type EditShiftsFormData = z.infer<typeof EditShiftsFormSchema>;

interface EditShiftsModalProps {
	assignmentId: string;
	currentShifts: ShiftDetail[];
	date: string;
	opened: boolean;
	onClose: () => void;
}

export function EditShiftsModal({
	assignmentId,
	currentShifts,
	date,
	opened,
	onClose,
}: EditShiftsModalProps) {
	const admin = useAuthStore((state) => state.admin);
	const { mutate: updateWorkerAssignment, isPending } = useMutationUpdateWorkerAssignment();

	// Transform currentShifts (response format) to form format
	const defaultShifts = currentShifts.map((shift) => ({
		workShiftId: shift.workShiftId,
		workers: shift.workers.map((w) => ({
			workerId: w.workerId,
			category: w.category,
			value: {
				workShiftBaseValueId: w.workShiftBaseValueId,
				coefficient: w.coefficient,
			},
			additionalPercent: w.additionalPercent || '',
		})),
	}));

	const {
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm<EditShiftsFormData>({
		resolver: zodResolver(EditShiftsFormSchema),
		defaultValues: {
			shifts: defaultShifts.length > 0 ? defaultShifts : [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'shifts',
	});

	const onSubmit = (data: EditShiftsFormData) => {
		// Clean up empty additionalPercent values
		const cleanedShifts = data.shifts.map((shift) => ({
			...shift,
			workers: shift.workers.map((w) => {
				const worker = { ...w };
				if (!worker.additionalPercent || worker.additionalPercent === '') {
					delete worker.additionalPercent;
				}
				return worker;
			}),
		}));

		updateWorkerAssignment(
			{
				id: assignmentId,
				data: { shifts: cleanedShifts, localityId: admin?.localityId || '' },
			},
			{
				onSuccess: () => {
					onClose();
				},
			}
		);
	};

	const handleAddShift = () => {
		append({
			workShiftId: '',
			workers: [
				{
					workerId: '',
					category: undefined as unknown as 'IDONEO' | 'PERITO',
					value: { workShiftBaseValueId: '', coefficient: '' },
					additionalPercent: '',
				},
			],
		});
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title='Editar turnos'
			centered
			size='70%'
			styles={{
				body: { maxHeight: '80vh', overflowY: 'auto' },
			}}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack>
					<Group justify='flex-end'>
						<Button
							variant='light'
							size='sm'
							leftSection={<IconPlus size={14} />}
							onClick={handleAddShift}
						>
							Agregar turno
						</Button>
					</Group>

					{errors.shifts?.root?.message && (
						<Text c='red' size='sm'>
							{errors.shifts.root.message}
						</Text>
					)}

					<SimpleGrid cols={{ base: 1, md: 2 }} spacing='md'>
						{fields.map((field, index) => (
							<ShiftSection
								key={field.id}
								shiftIndex={index}
								control={control}
								errors={errors}
								date={date}
								onRemove={() => remove(index)}
								canRemove={fields.length > 1}
								setValue={setValue}
								watch={watch}
							/>
						))}
					</SimpleGrid>

					<Group justify='flex-end' mt='md'>
						<Button variant='outline' onClick={onClose} disabled={isPending}>
							Cancelar
						</Button>
						<Button type='submit' loading={isPending}>
							Guardar
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
}
