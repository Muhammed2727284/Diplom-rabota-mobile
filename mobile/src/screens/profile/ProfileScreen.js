import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, getMyOrganization } from '../../api/profile';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isUser = user?.role === 'USER';
  const isOrg = user?.role === 'ORG';

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (isUser) {
        const res = await getMyProfile();
        setProfileData(res.data);
      } else if (isOrg) {
        const res = await getMyOrganization();
        setProfileData(res.data);
      }
    } catch (e) {
      console.log('Profile load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User header card */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Ionicons name={isOrg ? 'business' : 'person'} size={32} color={COLORS.primary} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.email} numberOfLines={1}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {isUser ? 'Соискатель' : isOrg ? 'Работодатель' : 'Админ'}
            </Text>
          </View>
        </View>
      </View>

      {/* Profile data section */}
      {isUser && profileData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Личные данные</Text>
          <InfoRow label="Имя" value={profileData.first_name} />
          <InfoRow label="Фамилия" value={profileData.last_name} />
          <InfoRow label="Телефон" value={profileData.phone} />
          <InfoRow label="Город" value={profileData.city} />
          <InfoRow label="Опыт (лет)" value={profileData.experience_years?.toString()} />
          <InfoRow label="Ожидаемая ЗП" value={profileData.expected_salary ? `${profileData.expected_salary.toLocaleString()} сом` : null} />
          {profileData.about ? (
            <View style={styles.subSection}>
              <Text style={styles.subLabel}>О себе</Text>
              <Text style={styles.subValue}>{profileData.about}</Text>
            </View>
          ) : null}
        </View>
      )}

      {isOrg && profileData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Данные компании</Text>
          <InfoRow label="Название" value={profileData.name} />
          <InfoRow label="Город" value={profileData.city} />
          <InfoRow label="Адрес" value={profileData.address} />
          <InfoRow label="Телефон" value={profileData.phone} />
          <InfoRow label="Сайт" value={profileData.website} />
          {profileData.description ? (
            <View style={styles.subSection}>
              <Text style={styles.subLabel}>Описание</Text>
              <Text style={styles.subValue}>{profileData.description}</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => {
            if (isUser) navigation.navigate('EditUserProfile');
            else if (isOrg) navigation.navigate('EditOrgProfile');
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.actionText}>Редактировать профиль</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        {isUser && (
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate('MyApplications')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: COLORS.secondaryLight }]}>
              <Ionicons name="paper-plane-outline" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>Мои отклики</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value} numberOfLines={2}>{value}</Text>
    </View>
  );
};

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray200,
  },
  label: { ...FONTS.regular, color: COLORS.textSecondary },
  value: { ...FONTS.medium, maxWidth: '60%', textAlign: 'right', fontSize: 14 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 60 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 4,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: { marginLeft: SPACING.md, flex: 1 },
  email: { ...FONTS.bold, fontSize: 16 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    marginTop: 6,
  },
  roleText: { ...FONTS.caption, color: COLORS.primary, fontWeight: '600', fontSize: 12 },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitle: { ...FONTS.bold, fontSize: 17, marginBottom: SPACING.sm },
  subSection: { marginTop: SPACING.sm },
  subLabel: { ...FONTS.small, color: COLORS.textSecondary, fontWeight: '600', marginBottom: 4 },
  subValue: { ...FONTS.regular, lineHeight: 20 },
  actionsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.gray100,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm + 4,
  },
  actionText: { ...FONTS.medium, flex: 1, fontSize: 15 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.errorLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  logoutText: { ...FONTS.medium, color: COLORS.error, fontWeight: '600' },
});

export default ProfileScreen;
