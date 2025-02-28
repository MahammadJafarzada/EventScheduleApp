import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent } from '../redux/eventSlice';
import { useNavigation } from '@react-navigation/native';
import { nanoid } from '@reduxjs/toolkit';
import { Ionicons } from '@expo/vector-icons';

const EventAdd = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const editEvent = route.params?.event;
  const [eventName, setEventName] = useState(editEvent?.name || '');
  const [selectedDate, setSelectedDate] = useState(editEvent ? new Date(editEvent.startDate) : new Date());
  const [startTime, setStartTime] = useState(editEvent ? new Date(editEvent.startDate) : new Date());
  const [endTime, setEndTime] = useState(editEvent ? new Date(editEvent.endDate) : new Date());
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [error, setError] = useState('');

  const [repeatOption, setRepeatOption] = useState<'None' | 'Weekly' | 'Bi-weekly' | 'Monthly'>(
    editEvent?.repeatOption || 'None'
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      title: editEvent ? 'Edit Event' : 'Add Event'
    });
  }, [navigation, editEvent]);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const getMarkedDates = () => {
    const dateStr = formatDate(selectedDate);
    return {
      [dateStr]: {
        selected: true,
        color: '#FFB800',
        textColor: 'white'
      }
    };
  };

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSave = () => {
    if (!eventName.trim()) {
      setError('Event name is required.');
      return;
    }

    const start = new Date(selectedDate);
    start.setHours(startTime.getHours(), startTime.getMinutes());

    const end = new Date(selectedDate);
    end.setHours(endTime.getHours(), endTime.getMinutes());

    const eventData = {
      id: editEvent?.id || nanoid(),
      name: eventName,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      repeatOption,
    };

    let repeatEvents = [eventData];

    if (repeatOption === 'Weekly' || repeatOption === 'Bi-weekly' || repeatOption === 'Monthly') {
      let interval = repeatOption === 'Weekly' ? 7 : repeatOption === 'Bi-weekly' ? 14 : 30;
      let nextStartDate = new Date(start);
      let nextEndDate = new Date(end);

      for (let i = 1; i < 10; i++) {
        nextStartDate = new Date(nextStartDate.setDate(nextStartDate.getDate() + interval));
        nextEndDate = new Date(nextEndDate.setDate(nextEndDate.getDate() + interval));
        repeatEvents.push({
          ...eventData,
          id: nanoid(),
          startDate: nextStartDate.toISOString(),
          endDate: nextEndDate.toISOString(),
        });
      }
    }

    repeatEvents.forEach(event => dispatch(addEvent(event)));
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4`}>
          <Calendar
            style={tw`rounded-xl bg-white shadow mb-4`}
            markedDates={getMarkedDates()}
            theme={{
              selectedDayBackgroundColor: '#FFB800',
              todayTextColor: '#FFB800',
              arrowColor: '#000',
              monthTextColor: '#000',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            onDayPress={(day) => {
              const newSelectedDate = new Date(day.timestamp);
              setSelectedDate(newSelectedDate);
            }}
            enableSwipeMonths={true}
            minDate={new Date().toISOString().split('T')[0]}
          />
          <View style={tw`bg-white rounded-xl p-4 shadow`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-500 mb-1 text-sm`}>Event Name</Text>
              <TextInput
                placeholder="Enter Name"
                value={eventName}
                onChangeText={(text) => {
                  setEventName(text);
                  setError('');
                }}
                style={tw`text-base border-b border-gray-200 pb-1`}
              />
              {error ? <Text style={tw`text-red-500 mt-1`}>{error}</Text> : null}
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-500 mb-1 text-sm`}>Date</Text>
              <View style={tw`border-b border-gray-200 pb-1`}>
                <Text style={tw`text-base`}>
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row mb-4`}>
              <View style={tw`flex-1 mr-2`}>
                <Text style={tw`text-gray-500 mb-1 text-sm`}>Start Time</Text>
                <TouchableOpacity
                  onPress={() => setShowStartTime(true)}
                  style={tw`border-b border-gray-200 pb-1`}
                >
                  <Text style={tw`text-base`}>{formatTimeDisplay(startTime)}</Text>
                </TouchableOpacity>
              </View>

              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`text-gray-500 mb-1 text-sm`}>End Time</Text>
                <TouchableOpacity
                  onPress={() => setShowEndTime(true)}
                  style={tw`border-b border-gray-200 pb-1`}
                >
                  <Text style={tw`text-base`}>{formatTimeDisplay(endTime)}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={tw`text-gray-500 mb-1 text-sm`}>Repeat</Text>
              <View style={tw`border-b border-gray-200`}>
                <Picker
                  selectedValue={repeatOption}
                  onValueChange={(itemValue: 'None' | 'Weekly' | 'Bi-weekly' | 'Monthly') => setRepeatOption(itemValue)}
                  style={tw`text-base -my-2`}
                >
                  <Picker.Item label="None" value="None" />
                  <Picker.Item label="Weekly" value="Weekly" />
                  <Picker.Item label="Bi-weekly" value="Bi-weekly" />
                  <Picker.Item label="Monthly" value="Monthly" />
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {showStartTime && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowStartTime(false);
            if (selectedTime) {
              setStartTime(selectedTime);
              if (endTime < selectedTime) {
                setEndTime(selectedTime);
              }
            }
          }}
        />
      )}

      {showEndTime && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={startTime}
          onChange={(event, selectedTime) => {
            setShowEndTime(false);
            if (selectedTime) {
              setEndTime(selectedTime);
            }
          }}
        />
      )}

      <View style={tw`p-4`}>
        <TouchableOpacity
          style={tw`bg-yellow-400 p-4 rounded-full items-center`}
          onPress={handleSave}
        >
          <Text style={tw`text-base font-semibold`}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EventAdd;