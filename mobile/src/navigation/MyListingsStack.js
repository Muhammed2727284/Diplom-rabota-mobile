import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyListingsScreen from '../screens/mylistings/MyListingsScreen';
import VacancyDetailScreen from '../screens/home/VacancyDetailScreen';
import ResumeDetailScreen from '../screens/home/ResumeDetailScreen';
import EditVacancyScreen from '../screens/mylistings/EditVacancyScreen';
import EditResumeScreen from '../screens/mylistings/EditResumeScreen';
import CreateVacancyScreen from '../screens/mylistings/CreateVacancyScreen';
import CreateResumeScreen from '../screens/mylistings/CreateResumeScreen';
import ApplicationsListScreen from '../screens/mylistings/ApplicationsListScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const MyListingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.surface },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen name="MyListings" component={MyListingsScreen} options={{ title: 'Мои объявления' }} />
    <Stack.Screen name="VacancyDetail" component={VacancyDetailScreen} options={{ title: 'Вакансия' }} />
    <Stack.Screen name="ResumeDetail" component={ResumeDetailScreen} options={{ title: 'Резюме' }} />
    <Stack.Screen name="EditVacancy" component={EditVacancyScreen} options={{ title: 'Редактировать вакансию' }} />
    <Stack.Screen name="EditResume" component={EditResumeScreen} options={{ title: 'Редактировать резюме' }} />
    <Stack.Screen name="CreateVacancy" component={CreateVacancyScreen} options={{ title: 'Новая вакансия' }} />
    <Stack.Screen name="CreateResume" component={CreateResumeScreen} options={{ title: 'Новое резюме' }} />
    <Stack.Screen name="ApplicationsList" component={ApplicationsListScreen} options={{ title: 'Отклики' }} />
  </Stack.Navigator>
);

export default MyListingsStack;
