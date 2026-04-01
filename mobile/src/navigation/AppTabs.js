import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import HomeStack from './HomeStack';
import FavoritesStack from './FavoritesStack';
import MyListingsStack from './MyListingsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const PlusPlaceholder = () => null;

const PlusButton = ({ onPress }) => (
  <TouchableOpacity style={styles.plusBtn} onPress={onPress} activeOpacity={0.8}>
    <Ionicons name="add" size={30} color={COLORS.white} />
  </TouchableOpacity>
);

const AppTabs = () => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const isUser = user?.role === 'USER';
  const isOrg = user?.role === 'ORG';

  const handleCreate = () => {
    setModalVisible(false);
    if (isUser) {
      navigation.navigate('MyListingsTab', { screen: 'CreateResume' });
    } else if (isOrg) {
      navigation.navigate('MyListingsTab', { screen: 'CreateVacancy' });
    }
  };

  const tabBarHeight = 56 + Math.max(insets.bottom, 8);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.tabBar, { height: tabBarHeight, paddingBottom: Math.max(insets.bottom, 8) }],
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: -2 },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: 'Главная',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStack}
          options={{
            tabBarLabel: 'Избранное',
            tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="PlusTab"
          component={PlusPlaceholder}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setModalVisible(true);
            },
          }}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => null,
            tabBarButton: (props) => <PlusButton onPress={() => setModalVisible(true)} />,
          }}
        />
        <Tab.Screen
          name="MyListingsTab"
          component={MyListingsStack}
          options={{
            tabBarLabel: 'Мои',
            tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStack}
          options={{
            tabBarLabel: 'Профиль',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>

      {/* Create action sheet */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Создать</Text>
            <Text style={styles.modalSubtitle}>
              {isUser ? 'Создайте резюме для поиска работы' : 'Создайте вакансию для поиска кандидатов'}
            </Text>

            {isUser && (
              <TouchableOpacity style={styles.modalOption} onPress={handleCreate} activeOpacity={0.7}>
                <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.primaryLight }]}>
                  <Ionicons name="document-text" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.modalOptionInfo}>
                  <Text style={styles.modalOptionTitle}>Создать резюме</Text>
                  <Text style={styles.modalOptionDesc}>Расскажите о себе и своём опыте</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
            {isOrg && (
              <TouchableOpacity style={styles.modalOption} onPress={handleCreate} activeOpacity={0.7}>
                <View style={[styles.modalOptionIcon, { backgroundColor: COLORS.primaryLight }]}>
                  <Ionicons name="briefcase" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.modalOptionInfo}>
                  <Text style={styles.modalOptionTitle}>Создать вакансию</Text>
                  <Text style={styles.modalOptionDesc}>Опишите позицию и требования</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)} activeOpacity={0.7}>
              <Text style={styles.modalCancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 4,
  },
  plusBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 24 : 16,
    ...SHADOWS.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gray300,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: { ...FONTS.heading, fontSize: 22, marginBottom: SPACING.xs },
  modalSubtitle: { ...FONTS.regular, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray100,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  modalOptionInfo: { flex: 1 },
  modalOptionTitle: { ...FONTS.bold, fontSize: 16 },
  modalOptionDesc: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  modalCancelText: { ...FONTS.medium, color: COLORS.textSecondary, fontWeight: '600' },
});

export default AppTabs;
