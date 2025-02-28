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
  pastEvents: Event[];
}

const initialState: EventState = {
  events: [],
  pastEvents: []
};

// Save both active and past events to storage
const saveEventsToStorage = async (events: Event[], pastEvents: Event[]) => {
  try {
    await AsyncStorage.setItem('events', JSON.stringify(events));
    await AsyncStorage.setItem('pastEvents', JSON.stringify(pastEvents));
  } catch (error) {
    console.error('Failed to save events:', error);
  }
};

// Load stored events
export const loadEventsFromStorage = async () => {
  try {
    const storedEvents = await AsyncStorage.getItem('events');
    const storedPastEvents = await AsyncStorage.getItem('pastEvents');
    return {
      events: storedEvents ? JSON.parse(storedEvents) : [],
      pastEvents: storedPastEvents ? JSON.parse(storedPastEvents) : [],
    };
  } catch (error) {
    console.error('Failed to load events:', error);
    return { events: [], pastEvents: [] };
  }
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<{ events: Event[]; pastEvents: Event[] }>) => {
      state.events = action.payload.events;
      state.pastEvents = action.payload.pastEvents;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
      saveEventsToStorage(state.events, state.pastEvents);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
        saveEventsToStorage(state.events, state.pastEvents);
      }
    },
    moveEventToHistory: (state) => {
      const now = new Date().getTime();
      const expiredEvents = state.events.filter(event => new Date(event.endDate).getTime() < now);
      state.pastEvents = [...expiredEvents, ...state.pastEvents];
      state.events = state.events.filter(event => new Date(event.endDate).getTime() >= now);
      saveEventsToStorage(state.events, state.pastEvents);
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
      saveEventsToStorage(state.events, state.pastEvents);
    }
  }
});

export const { setEvents, addEvent, updateEvent, moveEventToHistory, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
