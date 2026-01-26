import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { useAuthStore } from '@/stores';
import { loginService } from '../-services';

export const useMutationLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((store) => store.login);

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: () => {
      login(true);
      navigate({ to: '/Dashboard' });
    },
  });

  return loginMutation;
};
