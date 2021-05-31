/* eslint-disable import/no-extraneous-dependencies */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

const rgxExpression = new RegExp(/\.(jpe?g|png|gif|jpg)$/i);

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  /*  */

  const formValidations = {
    image: {
      lessThan10MB: (files: File[]) => files[0].size < 100000,
      acceptedFormats: (files: File[]) => {
        const filename = files[0].name;

        return rgxExpression.test(filename);
      },
    },
    title: {
      required: (value: string) => !!value,
      minLength: (value: string) => value.length >= 2,
      maxLength: (value: string) => value.length <= 20,
    },
    description: {
      required: (value: string) => !!value,
      maxLength: (value: string) => value.length <= 65,
    },
  };

  type SendImagePayload = {
    title: string;
    description: string;
    url: string;
  };
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (payload: SendImagePayload): Promise<void> => api.post('images', payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, string>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Url da image inválida',
          status: 'error',
        });
        return;
      }

      mutation.mutate({
        description: data.description,
        title: data.title,
        url: imageUrl,
      });

      toast({
        title: 'Imagem enviada com sucesso',
        status: 'success',
      });
    } catch {
      toast({
        title: 'Houve um erro ao enviar a imagem',
        status: 'error',
      });
    } finally {
      reset();
      closeModal();
      setImageUrl('');
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', {
            validate: formValidations.image,
          })}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', {
            validate: formValidations.title,
          })}
          error={errors.title}
        />

        <TextInput
          {...register('description', {
            validate: formValidations.description,
          })}
          placeholder="Descrição da imagem..."
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
