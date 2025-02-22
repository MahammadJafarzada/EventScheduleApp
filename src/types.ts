import { Event } from './store/eventSlice';

export type RootStackParamList = {
  Home: undefined;
  EventAdd: { event?: Event } | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 