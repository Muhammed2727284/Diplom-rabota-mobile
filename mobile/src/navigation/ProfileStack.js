import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditUserProfileScreen from '../screens/profile/EditUserProfileScreen';
import EditOrgProfileScreen from '../screens/profile/EditOrgProfileScreen';
import MyApplicationsScreen from '../screens/mylistings/MyApplicationsScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.surface },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '600' },
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Профиль' }} />
    <Stack.Screen name="EditUserProfile" component={EditUserProfileScreen} options={{ title: 'Редактировать профиль' }} />
    <Stack.Screen name="EditOrgProfile" component={EditOrgProfileScreen} options={{ title: 'Редактировать компанию' }} />
    <Stack.Screen name="MyApplications" component={MyApplicationsScreen} options={{ title: 'Мои отклики' }} />
  </Stack.Navigator>
);

export default ProfileStack;
