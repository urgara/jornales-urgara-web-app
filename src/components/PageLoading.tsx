import { Flex, Image } from '@mantine/core';

export function PageLoading() {
  return (
    <Flex h='100dvh' w='100%' justify='center' align='center'>
      <Image
        src='/images/urgara.png'
        h={150}
        fit='contain'
        style={{ animation: 'pulse 2s ease-in-out infinite' }}
      />
    </Flex>
  );
}
