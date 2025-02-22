import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Calendar as RNCalendar } from 'react-native-calendars';
import tw from 'twrnc';

const EventCalendar = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const getMarkedDates = () => {
    if (!startDate || !endDate) return {};

    const marked = {};
    let current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = formatDate(current);
      marked[dateStr] = {
        color: '#FFCC66',
        textColor: 'white',
      };

      current.setDate(current.getDate() + 1);
    }

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    if (marked[startDateStr]) {
      marked[startDateStr] = { ...marked[startDateStr], startingDay: true };
    }

    if (marked[endDateStr]) {
      marked[endDateStr] = { ...marked[endDateStr], endingDay: true };
    }

    return marked;
  };

  const handleDayPress = (day) => {
    const selectedDate = new Date(day.timestamp);

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    } else {
      if (selectedDate < startDate) {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  return (
    <RNCalendar
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
      onDayPress={handleDayPress}
      enableSwipeMonths={true}
    />
  );
};

export default EventCalendar;
