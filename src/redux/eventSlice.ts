import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  repeatOption: 'None' | 'Weekly' | 'Bi-weekly' | 'Monthly';
}

interface EventState {
  events: Event[];
}

const initialState: EventState = {
  events: []
};

const saveEventsToStorage = async (events: Event[]) => {
  try {
    await AsyncStorage.setItem('events', JSON.stringify(events));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
};

export const loadEventsFromStorage = async () => {
  try {
    const storedEvents = await AsyncStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error('Failed to load events:', error);
    return [];
  }
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
      saveEventsToStorage(state.events);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
        saveEventsToStorage(state.events);
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      saveEventsToStorage(state.events);
    }
  }
});

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
