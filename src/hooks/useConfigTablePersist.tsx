import { useLocalStorage } from '@mantine/hooks';
import type { MRT_ColumnOrderState, MRT_VisibilityState } from 'mantine-react-table';

export const useConfigTablePersist = (key: string) => {
  const [columnOrder, setColumnOrder] = useLocalStorage<MRT_ColumnOrderState>({
    key: `table-column-order-${key}`,
    defaultValue: [],
    getInitialValueInEffect: false,
  });

  const [columnVisibility, setColumnVisibility] = useLocalStorage<MRT_VisibilityState>({
    key: `table-column-visibility-${key}`,
    defaultValue: {},
    getInitialValueInEffect: false,
  });

  return {
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
  };
};
