import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/toast-context'
import {
  ApiRequestError,
  clearAccessToken,
  getCurrentUser,
  login,
  logout,
  signup,
  type AuthUser,
} from './api'

export const authKeys = {
  currentUser: ['auth', 'current-user'] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      queryClient.setQueryData<AuthUser>(authKeys.currentUser, user)
      toast({
        title: 'Signed in',
        description: `Welcome back${user.name ? `, ${user.name}` : ''}.`,
        variant: 'success',
      })
      navigate('/welcome', { replace: true })
    },
    onError: (error) => {
      toast({
        title: 'Sign in failed',
        description:
          error instanceof ApiRequestError
            ? error.message
            : 'Please check your details and try again.',
        variant: 'error',
      })
    },
  })
}

export function useSignup() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: signup,
    onSuccess: ({ user }) => {
      queryClient.setQueryData<AuthUser>(authKeys.currentUser, user)
      toast({
        title: 'Account created',
        description: 'Your OneLingo workspace is ready.',
        variant: 'success',
      })
      navigate('/welcome', { replace: true })
    },
    onError: (error) => {
      toast({
        title: 'Could not create account',
        description:
          error instanceof ApiRequestError
            ? error.message
            : 'Please check your details and try again.',
        variant: 'error',
      })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { toast } = useToast()

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAccessToken()
      queryClient.removeQueries({ queryKey: authKeys.currentUser })
      toast({
        title: 'Signed out',
        description: 'You can sign in again whenever you are ready.',
        variant: 'info',
      })
      navigate('/login', { replace: true })
    },
  })
}
