import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Script, UserProfile } from '../backend';
import type { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Script Queries
export function useGetAllScripts() {
  const { actor, isFetching } = useActor();

  return useQuery<Script[]>({
    queryKey: ['scripts', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScripts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetScript(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Script>({
    queryKey: ['scripts', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getScript(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSearchScriptsByTitle(title: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Script[]>({
    queryKey: ['scripts', 'search', title],
    queryFn: async () => {
      if (!actor) return [];
      if (!title.trim()) return [];
      return actor.searchScriptsByTitle(title);
    },
    enabled: !!actor && !isFetching && !!title.trim(),
  });
}

export function useFilterScriptsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Script[]>({
    queryKey: ['scripts', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category) return [];
      return actor.filterScriptsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetScriptsByAuthor(author: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Script[]>({
    queryKey: ['scripts', 'author', author?.toString()],
    queryFn: async () => {
      if (!actor || !author) return [];
      return actor.getScriptsByAuthor(author);
    },
    enabled: !!actor && !isFetching && !!author,
  });
}

// Script Mutations
export function useCreateScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createScript(data.title, data.description, data.category, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}

export function useUpdateScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description: string;
      category: string;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateScript(data.id, data.title, data.description, data.category, data.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}

export function useDeleteScript() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteScript(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
}
