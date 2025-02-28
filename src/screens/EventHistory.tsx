import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const EventHistory = () => {
  const pastEvents = useSelector((state: RootState) => state.events.pastEvents);
  const navigation = useNavigation();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }) => (
    <View style={tw`bg-white p-4 mb-4 rounded-2xl shadow-lg border border-gray-200`}>
      <Text style={tw`text-xl font-bold text-gray-900 mb-2`}>{item.name}</Text>
      <Text style={tw`text-gray-600 text-sm`}>From: <Text style={tw`text-gray-800 font-semibold`}>{formatDateTime(item.startDate)}</Text></Text>
      <Text style={tw`text-gray-600 text-sm`}>To: <Text style={tw`text-gray-800 font-semibold`}>{formatDateTime(item.endDate)}</Text></Text>
      <Text style={tw`text-blue-600 text-sm mt-1`}>Repeat: {item.repeatOption}</Text>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50 p-4`}>
      <TouchableOpacity onPress={() => navigation.goBack()}
        style={tw`flex-row items-center mb-4 `}>
        <Ionicons name="arrow-back-sharp" size={24} color="black" style={tw`p-2`} />
        <Text style={tw`text-2xl font-bold text-gray-900 pl-2`}>Event History</Text>
      </TouchableOpacity>
      {pastEvents.length === 0 ? (
        <View style={tw`flex-1  justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>No past events</Text>
        </View>
      ) : (
        <FlatList
          data={pastEvents}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={tw`pb-4`}
        />
      )}
    </SafeAreaView>
  );
};

export default EventHistory;