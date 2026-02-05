import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import type { z } from 'zod/v4';
import { useForm } from 'react-hook-form';
import { useMutationCreateProduct } from '../-hooks';
import type { CreateProductRequest } from '../-models';
import { CreateProductRequestSchemaBase } from '../-models';

type CreateProductFormData = z.infer<typeof CreateProductRequestSchemaBase>;

interface CreateProductFormProps {
	opened: boolean;
	onClose: () => void;
}

const CreateProductForm = ({ opened, onClose }: CreateProductFormProps) => {
	const { mutate: createProduct, isPending } = useMutationCreateProduct();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateProductFormData>({
		resolver: zodResolver(CreateProductRequestSchemaBase),
		defaultValues: {
			name: '',
			isActive: true,
		},
	});

	const onSubmit = (data: CreateProductFormData) => {
		const submitData: CreateProductRequest = {
			...data,
			isActive: data.isActive ?? true,
		};
		createProduct(submitData, {
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
		<Modal opened={opened} onClose={handleClose} title='Crear Producto'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack gap='md'>
					<TextInput
						label='Nombre'
						placeholder='Ingrese el nombre del producto'
						{...register('name')}
						error={errors.name?.message}
						required
					/>
					<Group justify='flex-end' mt='md'>
						<Button variant='outline' onClick={handleClose} disabled={isPending}>
							Cancelar
						</Button>
						<Button type='submit' loading={isPending}>
							Crear
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
};

export { CreateProductForm };
