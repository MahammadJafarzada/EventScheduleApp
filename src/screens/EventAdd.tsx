import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent } from '../store/eventSlice';
import { useNavigation } from '@react-navigation/native';
import { nanoid } from '@reduxjs/toolkit';
import { Ionicons } from '@expo/vector-icons';

const EventAdd = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const editEvent = route.params?.event;

  const [eventName, setEventName] = useState(editEvent?.name || '');
  const [startDate, setStartDate] = useState(editEvent ? new Date(editEvent.startDate) : new Date());
  const [endDate, setEndDate] = useState(editEvent ? new Date(editEvent.endDate) : new Date());
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
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
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    const marked = {
      [startDateStr]: { 
        selected: true,
        color: '#FFB800',
        textColor: 'white'
      }
    };

    let currentDate = new Date(startDate);
    while (formatDate(currentDate) !== endDateStr) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dateStr = formatDate(currentDate);
      marked[dateStr] = {
        selected: true,
        color: dateStr === endDateStr ? '#FFB800' : '#FFE4B0',
        textColor: dateStr === endDateStr ? 'white' : 'black'
      };
    }
    
    return marked;
  };

  const formatTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSave = () => {
    const eventData = {
      id: editEvent?.id || nanoid(),
      name: eventName,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      repeatOption
    };

    if (editEvent) {
      dispatch(updateEvent(eventData));
    } else {
      dispatch(addEvent(eventData));
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`p-4`}>
          <Calendar
            style={tw`rounded-xl bg-white shadow mb-4`}
            markedDates={getMarkedDates()}
            markingType="period"
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
              const selectedDate = new Date(day.timestamp);
              const selectedTime = new Date(selectedDate);
              if (startDate) {
                selectedTime.setHours(startDate.getHours(), startDate.getMinutes());
              }

              if (!startDate || (startDate && endDate && startDate.getTime() !== endDate.getTime())) {
                setStartDate(selectedTime);
                setEndDate(selectedTime);
              } else {
                if (selectedDate < startDate) {
                  setStartDate(selectedTime);
                } else {
                  const endTime = new Date(selectedDate);
                  endTime.setHours(endDate.getHours(), endDate.getMinutes());
                  setEndDate(endTime);
                }
              }
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
                onChangeText={setEventName}
                style={tw`text-base border-b border-gray-200 pb-1`}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-500 mb-1 text-sm`}>Start Time</Text>
              <TouchableOpacity 
                onPress={() => setShowStartTime(true)}
                style={tw`flex-row items-center justify-between border-b border-gray-200 pb-1`}
              >
                <Text style={tw`text-base`}>{formatTimeDisplay(startDate)}</Text>
                <Text style={tw`text-base text-gray-500`}>
                  {startDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-gray-500 mb-1 text-sm`}>End Time</Text>
              <TouchableOpacity 
                onPress={() => setShowEndTime(true)}
                style={tw`flex-row items-center justify-between border-b border-gray-200 pb-1`}
              >
                <Text style={tw`text-base`}>{formatTimeDisplay(endDate)}</Text>
                <Text style={tw`text-base text-gray-500`}>
                  {endDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
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
          value={startDate}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartTime(false);
            if (selectedDate) {
              setStartDate(selectedDate);
              if (endDate < selectedDate) {
                setEndDate(selectedDate);
              }
            }
          }}
        />
      )}

      {showEndTime && (
        <DateTimePicker
          value={endDate}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={startDate}
          onChange={(event, selectedDate) => {
            setShowEndTime(false);
            if (selectedDate) {
              setEndDate(selectedDate);
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