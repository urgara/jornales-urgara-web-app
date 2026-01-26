import { Flex } from '@mantine/core';
import { LogoIcon } from './LogoIcon';

export function PageLoading() {
  return (
    <Flex h='100dvh' w='100%' justify='center' align='center'>
      <LogoIcon height={150} animation />
    </Flex>
  );
}
