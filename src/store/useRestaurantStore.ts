import { create } from 'zustand';
import { RestaurantResponse } from '@/hooks/restaurants/useRestaurants';

interface RestaurantStore {
  selectedRestaurant: RestaurantResponse | null;
  setSelectedRestaurant: (restaurant: RestaurantResponse | null) => void;
  clearSelectedRestaurant: () => void;
}

const useRestaurantStore = create<RestaurantStore>((set) => ({
  selectedRestaurant: null,
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  clearSelectedRestaurant: () => set({ selectedRestaurant: null }),
}));

export default useRestaurantStore;
