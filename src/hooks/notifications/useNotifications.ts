import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/services/api-client';
import useAuthStore from '@/store/useAuthStore';
import configEnv from '@/config';

export interface NotificationItem {
  id: number;
  createdAt: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  data?: Record<string, unknown>;
}

const QUERY_KEY = 'notifications';

export const useNotifications = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const { data: notifications = [] } = useQuery<NotificationItem[]>({
    queryKey: [QUERY_KEY],
    queryFn: () => axiosInstance.get<NotificationItem[]>('notifications').then((r) => r.data),
    enabled: !!token,
    staleTime: 30_000,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Socket.io — join user room and listen for real-time notifications
  useEffect(() => {
    if (!user?.userId || !token) return;

    const baseUrl = configEnv.BASE_URL?.replace(/\/$/, '') ?? '';
    const wsBase = baseUrl.replace(/^http/, 'ws');

    const socket = io(`${wsBase}/tracking`, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('user:join', { userId: user.userId });
    });

    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('notification:new', (notification: NotificationItem) => {
      queryClient.setQueryData<NotificationItem[]>([QUERY_KEY], (prev = []) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.userId, token, queryClient]);

  const { mutate: markRead } = useMutation({
    mutationFn: (id: number) => axiosInstance.patch(`notifications/${id}/read`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationItem[]>([QUERY_KEY], (prev = []) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    },
  });

  const { mutate: markAllRead } = useMutation({
    mutationFn: () => axiosInstance.patch('notifications/read-all'),
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>([QUERY_KEY], (prev = []) =>
        prev.map((n) => ({ ...n, isRead: true })),
      );
    },
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  }, [queryClient]);

  return { notifications, unreadCount, markRead, markAllRead, refresh, socketConnected };
};
