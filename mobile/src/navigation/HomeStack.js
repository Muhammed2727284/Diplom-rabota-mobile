import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import VacancyDetailScreen from '../screens/home/VacancyDetailScreen';
import ResumeDetailScreen from '../screens/home/ResumeDetailScreen';
import FiltersVacanciesScreen from '../screens/home/FiltersVacanciesScreen';
import FiltersResumesScreen from '../screens/home/FiltersResumesScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.surface },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'JobBoard' }} />
    <Stack.Screen name="VacancyDetail" component={VacancyDetailScreen} options={{ title: 'Вакансия' }} />
    <Stack.Screen name="ResumeDetail" component={ResumeDetailScreen} options={{ title: 'Резюме' }} />
    <Stack.Screen name="FiltersVacancies" component={FiltersVacanciesScreen} options={{ title: 'Фильтры вакансий' }} />
    <Stack.Screen name="FiltersResumes" component={FiltersResumesScreen} options={{ title: 'Фильтры резюме' }} />
  </Stack.Navigator>
);

export default HomeStack;
