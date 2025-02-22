import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteEvent } from '../store/eventSlice';
import { RootState } from '../store/store';
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events.events);

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
    <View style={tw`bg-white p-4 mb-2 rounded-xl shadow`}>
      <View style={tw`flex-row justify-between items-start`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-semibold mb-2`}>{item.name}</Text>
          <Text style={tw`text-gray-600`}>
            From: {formatDateTime(item.startDate)}
          </Text>
          <Text style={tw`text-gray-600`}>
            To: {formatDateTime(item.endDate)}
          </Text>
          {item.repeatOption !== 'None' && (
            <Text style={tw`text-gray-500 mt-1`}>
              Repeats: {item.repeatOption}
            </Text>
          )}
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('EventAdd', { event: item })}
            style={tw`p-2`}
          >
            <Ionicons name="pencil" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => dispatch(deleteEvent(item.id))}
            style={tw`p-2`}
          >
            <Ionicons name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4 flex-row justify-between items-center border-b border-gray-200`}>
        <Text style={tw`text-xl font-bold`}>Events</Text>
      </View>
      
      {events.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500`}>No events yet</Text>
        </View>
      ) : (
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
          {events
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .map(item => (
              <View key={item.id} style={tw`bg-white p-4 mb-2 rounded-xl shadow`}>
                <View style={tw`flex-row justify-between items-start`}>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-lg font-semibold mb-2`}>{item.name}</Text>
                    <Text style={tw`text-gray-600`}>
                      From: {formatDateTime(item.startDate)}
                    </Text>
                    <Text style={tw`text-gray-600`}>
                      To: {formatDateTime(item.endDate)}
                    </Text>
                    {item.repeatOption !== 'None' && (
                      <Text style={tw`text-gray-500 mt-1`}>
                        Repeats: {item.repeatOption}
                      </Text>
                    )}
                  </View>
                  <View style={tw`flex-row`}>
                    <TouchableOpacity 
                      onPress={() => navigation.navigate('EventAdd', { event: item })}
                      style={tw`p-2`}
                    >
                      <Ionicons name="pencil" size={20} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => dispatch(deleteEvent(item.id))}
                      style={tw`p-2`}
                    >
                      <Ionicons name="trash" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
        </ScrollView>
      )}

      <TouchableOpacity 
        onPress={() => navigation.navigate('EventAdd')}
        style={tw`absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg`}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
