import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { getFavorites } from '../../api/favorites';
import VacancyCard from '../../components/VacancyCard';
import ResumeCard from '../../components/ResumeCard';
import EmptyState from '../../components/EmptyState';

const FavoritesScreen = ({ navigation }) => {
  const [tab, setTab] = useState('VACANCY');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFavorites({ target_type: tab });
      setData(res.data.results || res.data);
    } catch (e) {
      console.log('Favorites error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab]);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [tab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const handleTabChange = (newTab) => {
    if (newTab === tab) return;
    setTab(newTab);
    setData([]);
  };

  const renderItem = ({ item }) => {
    if (tab === 'VACANCY' && item.vacancy_detail) {
      return (
        <VacancyCard
          item={item.vacancy_detail}
          isFavorite={true}
          onPress={() => navigation.navigate('VacancyDetail', { id: item.vacancy_detail.id })}
        />
      );
    }
    if (tab === 'RESUME' && item.resume_detail) {
      return (
        <ResumeCard
          item={item.resume_detail}
          isFavorite={true}
          onPress={() => navigation.navigate('ResumeDetail', { id: item.resume_detail.id })}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'VACANCY' && styles.segBtnActive]}
          onPress={() => handleTabChange('VACANCY')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segText, tab === 'VACANCY' && styles.segTextActive]}>Вакансии</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'RESUME' && styles.segBtnActive]}
          onPress={() => handleTabChange('RESUME')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segText, tab === 'RESUME' && styles.segTextActive]}>Резюме</Text>
        </TouchableOpacity>
      </View>

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
              icon="heart-outline"
              title="Нет избранных"
              subtitle={tab === 'VACANCY'
                ? 'Добавьте вакансии в избранное, чтобы не потерять'
                : 'Добавьте резюме в избранное, чтобы не потерять'}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  segmented: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    padding: 3,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.sm + 2,
  },
  segBtnActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.sm,
  },
  segText: { ...FONTS.medium, color: COLORS.textSecondary, fontSize: 14 },
  segTextActive: { color: COLORS.primary, fontWeight: '700' },
  list: { paddingTop: SPACING.sm, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default FavoritesScreen;
