import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import VacancyDetailScreen from '../screens/home/VacancyDetailScreen';
import ResumeDetailScreen from '../screens/home/ResumeDetailScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const FavoritesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.surface },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen name="FavoritesList" component={FavoritesScreen} options={{ title: 'Избранное' }} />
    <Stack.Screen name="VacancyDetail" component={VacancyDetailScreen} options={{ title: 'Вакансия' }} />
    <Stack.Screen name="ResumeDetail" component={ResumeDetailScreen} options={{ title: 'Резюме' }} />
  </Stack.Navigator>
);

export default FavoritesStack;
