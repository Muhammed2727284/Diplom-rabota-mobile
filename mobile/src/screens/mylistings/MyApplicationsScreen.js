import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl,
  TouchableOpacity, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import {
  getMyApplications, getMyInvitations, updateInvitationStatus,
} from '../../api/applications';
import { getStatusLabel } from '../../utils/enums';
import EmptyState from '../../components/EmptyState';

const STATUS_COLORS = {
  SENT: COLORS.primary,
  VIEWED: COLORS.warning,
  ACCEPTED: COLORS.success,
  REJECTED: COLORS.error,
};

const STATUS_BG = {
  SENT: COLORS.primaryLight,
  VIEWED: COLORS.warningLight,
  ACCEPTED: COLORS.successLight,
  REJECTED: COLORS.errorLight,
};

const MyApplicationsScreen = () => {
  const [tab, setTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [appsRes, invRes] = await Promise.all([
        getMyApplications(),
        getMyInvitations(),
      ]);
      setApplications(appsRes.data.results || appsRes.data);
      setInvitations(invRes.data.results || invRes.data);
    } catch (e) {
      console.log('MyApps/Invitations error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchAll(); }, [fetchAll]));

  const handleInvitationResponse = (id, status) => {
    const verb = status === 'ACCEPTED' ? 'принять' : 'отклонить';
    Alert.alert(
      'Подтвердите',
      `Вы уверены, что хотите ${verb} приглашение?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Подтвердить',
          onPress: async () => {
            try {
              await updateInvitationStatus(id, { status });
              fetchAll();
            } catch (e) {
              Alert.alert('Ошибка', 'Не удалось обновить статус.');
            }
          },
        },
      ],
    );
  };

  const renderApplication = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={1}>{item.vacancy_detail?.title || 'Вакансия'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[item.status] || COLORS.gray100 }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || COLORS.text }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.company}>{item.vacancy_detail?.company_name || ''}</Text>
      {item.message ? <Text style={styles.msg} numberOfLines={2}>{item.message}</Text> : null}
    </View>
  );

  const renderInvitation = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={1}>{item.vacancy_detail?.title || 'Вакансия'}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[item.status] || COLORS.gray100 }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || COLORS.text }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      <Text style={styles.company}>{item.vacancy_detail?.company_name || ''}</Text>
      {item.message ? <Text style={styles.msg} numberOfLines={3}>{item.message}</Text> : null}
      {item.status === 'SENT' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => handleInvitationResponse(item.id, 'ACCEPTED')}
          >
            <Text style={styles.acceptText}>Принять</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleInvitationResponse(item.id, 'REJECTED')}
          >
            <Text style={styles.rejectText}>Отклонить</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const isApps = tab === 'applications';
  const data = isApps ? applications : invitations;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, isApps && styles.tabBtnActive]}
          onPress={() => setTab('applications')}
        >
          <Text style={[styles.tabText, isApps && styles.tabTextActive]}>
            Отклики {applications.length > 0 ? `(${applications.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, !isApps && styles.tabBtnActive]}
          onPress={() => setTab('invitations')}
        >
          <Text style={[styles.tabText, !isApps && styles.tabTextActive]}>
            Приглашения {invitations.length > 0 ? `(${invitations.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={isApps ? renderApplication : renderInvitation}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAll(); }} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          isApps ? (
            <EmptyState
              icon="paper-plane-outline"
              title="Нет откликов"
              subtitle="Откликнитесь на вакансию, чтобы увидеть статус здесь"
            />
          ) : (
            <EmptyState
              icon="mail-outline"
              title="Нет приглашений"
              subtitle="Когда работодатель пригласит вас на вакансию, оно появится здесь"
            />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: COLORS.primary },
  tabText: { ...FONTS.medium, color: COLORS.textSecondary, fontSize: 14 },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },
  list: { padding: SPACING.md, paddingBottom: 60 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 2,
    ...SHADOWS.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...FONTS.bold, fontSize: 15, flex: 1, marginRight: SPACING.sm },
  statusBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  company: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  msg: { ...FONTS.regular, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 20 },
  actions: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.sm },
  actionBtn: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  acceptBtn: { backgroundColor: COLORS.success },
  acceptText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  rejectBtn: { backgroundColor: COLORS.gray100, borderWidth: 1, borderColor: COLORS.border },
  rejectText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
});

export default MyApplicationsScreen;
