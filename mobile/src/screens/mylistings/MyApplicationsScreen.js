import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { getMyApplications } from '../../api/applications';
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApps = useCallback(async () => {
    try {
      const res = await getMyApplications();
      setData(res.data.results || res.data);
    } catch (e) {
      console.log('MyApps error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchApps(); }, []));

  const renderItem = ({ item }) => (
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

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <FlatList
      style={styles.container}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchApps(); }} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
      ListEmptyComponent={
        <EmptyState
          icon="paper-plane-outline"
          title="Нет откликов"
          subtitle="Откликнитесь на вакансию, чтобы увидеть статус здесь"
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
});

export default MyApplicationsScreen;
