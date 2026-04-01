import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { getVacancyApplications, updateApplicationStatus } from '../../api/applications';
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

const ApplicationsListScreen = ({ route }) => {
  const { vacancyId } = route.params;
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const res = await getVacancyApplications(vacancyId);
      setApps(res.data.results || res.data);
    } catch (e) {
      console.log('Apps error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const changeStatus = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, { status: newStatus });
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось обновить статус');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.email}>{item.applicant_email}</Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_BG[item.status] || COLORS.gray100 }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || COLORS.text }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      {item.message ? <Text style={styles.msg} numberOfLines={3}>{item.message}</Text> : null}
      <View style={styles.btnRow}>
        {item.status !== 'ACCEPTED' && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.success }]} onPress={() => changeStatus(item.id, 'ACCEPTED')} activeOpacity={0.7}>
            <Text style={styles.actionText}>Принять</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'REJECTED' && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.error }]} onPress={() => changeStatus(item.id, 'REJECTED')} activeOpacity={0.7}>
            <Text style={styles.actionText}>Отклонить</Text>
          </TouchableOpacity>
        )}
        {item.status === 'SENT' && (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.warning }]} onPress={() => changeStatus(item.id, 'VIEWED')} activeOpacity={0.7}>
            <Text style={styles.actionText}>Просмотрено</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <FlatList
      style={styles.container}
      data={apps}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadApps(); }} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
      ListEmptyComponent={
        <EmptyState
          icon="people-outline"
          title="Нет откликов"
          subtitle="Когда кандидаты откликнутся на вакансию, они появятся здесь"
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.md, paddingBottom: 60 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 2,
    ...SHADOWS.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  email: { ...FONTS.bold, fontSize: 15, flex: 1, marginRight: SPACING.sm },
  statusBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  msg: { ...FONTS.regular, color: COLORS.textSecondary, marginTop: 4, lineHeight: 20 },
  btnRow: { flexDirection: 'row', marginTop: SPACING.sm + 4, gap: SPACING.sm },
  actionBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  actionText: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
});

export default ApplicationsListScreen;
