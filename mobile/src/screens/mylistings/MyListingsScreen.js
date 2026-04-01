import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { getMyVacancies, deleteVacancy } from '../../api/vacancies';
import { getMyResumes, deleteResume } from '../../api/resumes';
import { formatSalary } from '../../utils/formatters';
import { getEmploymentLabel } from '../../utils/enums';
import EmptyState from '../../components/EmptyState';

const MyListingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isOrg = user?.role === 'ORG';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = isOrg ? await getMyVacancies() : await getMyResumes();
      setData(res.data.results || res.data);
    } catch (e) {
      console.log('MyListings error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isOrg]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [isOrg])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Удалить',
      `Вы уверены, что хотите удалить "${item.title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              if (isOrg) {
                await deleteVacancy(item.id);
              } else {
                await deleteResume(item.id);
              }
              setData(prev => prev.filter(d => d.id !== item.id));
            } catch (e) {
              Alert.alert('Ошибка', 'Не удалось удалить');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => {
          if (isOrg) {
            navigation.navigate('VacancyDetail', { id: item.id });
          } else {
            navigation.navigate('ResumeDetail', { id: item.id });
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          {!item.is_published && (
            <View style={styles.draftBadge}>
              <Text style={styles.draftText}>Черновик</Text>
            </View>
          )}
        </View>
        <Text style={styles.salary}>{formatSalary(item.salary_from, item.salary_to)}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {[item.city, getEmploymentLabel(item.employment_type)].filter(Boolean).join(' · ')}
        </Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            if (isOrg) {
              navigation.navigate('EditVacancy', { id: item.id });
            } else {
              navigation.navigate('EditResume', { id: item.id });
            }
          }}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        {isOrg && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('ApplicationsList', { vacancyId: item.id })}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Ionicons name="people-outline" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && data.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
          ListEmptyComponent={
            <EmptyState
              icon={isOrg ? 'briefcase-outline' : 'document-text-outline'}
              title={isOrg ? 'Нет вакансий' : 'Нет резюме'}
              subtitle={isOrg
                ? 'Создайте вакансию, чтобы найти кандидатов'
                : 'Создайте резюме, чтобы откликаться на вакансии'}
              actionLabel={isOrg ? 'Создать вакансию' : 'Создать резюме'}
              onAction={() => navigation.navigate(isOrg ? 'CreateVacancy' : 'CreateResume')}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm + 2,
    ...SHADOWS.md,
  },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { ...FONTS.bold, fontSize: 15, flex: 1 },
  salary: { ...FONTS.bold, color: COLORS.primary, fontSize: 14, marginTop: 6 },
  sub: { ...FONTS.small, marginTop: 4, color: COLORS.textSecondary },
  draftBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  draftText: { ...FONTS.caption, color: COLORS.warning, fontWeight: '600', fontSize: 11 },
  actions: { justifyContent: 'center', gap: SPACING.sm + 4, paddingLeft: SPACING.sm + 4 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: { paddingTop: SPACING.sm, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default MyListingsScreen;
