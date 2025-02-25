import { View, Text } from 'react-native';
import React from 'react';
import { Calendar as RNCalendar } from 'react-native-calendars';
import tw from 'twrnc';

const EventCalendar = ({ onSelectDate, selectedDate }) => {
  const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  
  const markedDates = {
    [dateString]: {
      selected: true,
      selectedColor: '#FFB800',
    }
  };

  return (
    <RNCalendar
      style={tw`rounded-xl bg-white shadow mb-4`}
      current={dateString}
      markedDates={markedDates}
      onDayPress={(day) => onSelectDate(new Date(day.timestamp))}
      enableSwipeMonths={true}
      minDate={new Date().toISOString().split('T')[0]}
      theme={{
        selectedDayBackgroundColor: '#FFB800',
        todayTextColor: '#FFB800',
        arrowColor: '#000',
        monthTextColor: '#000',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 14,
      }}
    />
  );
};

export default EventCalendar;