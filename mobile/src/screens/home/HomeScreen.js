import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { getVacancies } from '../../api/vacancies';
import { getResumes } from '../../api/resumes';
import VacancyCard from '../../components/VacancyCard';
import ResumeCard from '../../components/ResumeCard';
import EmptyState from '../../components/EmptyState';

const LIMIT = 20;

const HomeScreen = ({ navigation, route }) => {
  const [tab, setTab] = useState('vacancies');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const debounceTimer = useRef(null);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  // Read filter params from navigation
  useEffect(() => {
    const vacancyFilters = route.params?.vacancyFilters;
    const resumeFilters = route.params?.resumeFilters;
    if (vacancyFilters !== undefined && tab === 'vacancies') {
      setFilters(vacancyFilters || {});
    }
    if (resumeFilters !== undefined && tab === 'resumes') {
      setFilters(resumeFilters || {});
    }
  }, [route.params?.vacancyFilters, route.params?.resumeFilters]);

  const fetchData = useCallback(async (reset = true) => {
    if (!reset && !hasMore) return;

    const newOffset = reset ? 0 : offsetRef.current;
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = { limit: LIMIT, offset: newOffset };
      if (debouncedSearch.trim()) params.q = debouncedSearch.trim();

      // Apply filters
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key];
      });

      const res = tab === 'vacancies'
        ? await getVacancies(params)
        : await getResumes(params);

      const results = res.data.results || res.data;
      if (reset) {
        setData(results);
        offsetRef.current = LIMIT;
      } else {
        setData(prev => [...prev, ...results]);
        offsetRef.current = newOffset + LIMIT;
      }
      setHasMore(results.length === LIMIT);
    } catch (e) {
      console.log('Fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [tab, debouncedSearch, filters, hasMore]);

  // Refetch on tab change, search change, or screen focus
  useFocusEffect(
    useCallback(() => {
      fetchData(true);
    }, [tab, debouncedSearch, filters])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const onEndReached = () => {
    if (!loading && !loadingMore && hasMore) fetchData(false);
  };

  const handleTabChange = (newTab) => {
    if (newTab === tab) return;
    setTab(newTab);
    setData([]);
    setFilters({});
    setSearch('');
    setDebouncedSearch('');
    offsetRef.current = 0;
    setHasMore(true);
  };

  const clearSearch = () => {
    setSearch('');
    setDebouncedSearch('');
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const renderItem = ({ item }) => {
    if (tab === 'vacancies') {
      return (
        <VacancyCard
          item={item}
          onPress={() => navigation.navigate('VacancyDetail', { id: item.id })}
        />
      );
    }
    return (
      <ResumeCard
        item={item}
        onPress={() => navigation.navigate('ResumeDetail', { id: item.id })}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Search row */}
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={20} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor={COLORS.textLight}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={() => setDebouncedSearch(search)}
          />
          {search ? (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
          onPress={() => navigation.navigate(
            tab === 'vacancies' ? 'FiltersVacancies' : 'FiltersResumes',
            { filters }
          )}
        >
          <Ionicons name="options-outline" size={22} color={hasActiveFilters ? COLORS.white : COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <TouchableOpacity style={styles.filterIndicator} onPress={clearFilters} activeOpacity={0.7}>
          <Ionicons name="funnel" size={14} color={COLORS.primary} />
          <Text style={styles.filterIndicatorText}>Фильтры активны</Text>
          <Ionicons name="close-circle" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}

      {/* Segmented control */}
      <View style={styles.segmented}>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'vacancies' && styles.segBtnActive]}
          onPress={() => handleTabChange('vacancies')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segText, tab === 'vacancies' && styles.segTextActive]}>Вакансии</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segBtn, tab === 'resumes' && styles.segBtnActive]}
          onPress={() => handleTabChange('resumes')}
          activeOpacity={0.7}
        >
          <Text style={[styles.segText, tab === 'resumes' && styles.segTextActive]}>Резюме</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
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
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          keyboardDismissMode="on-drag"
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Ничего не найдено"
              subtitle="Попробуйте изменить параметры поиска или сбросить фильтры"
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ paddingVertical: 20 }} color={COLORS.primary} />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    gap: SPACING.sm,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm + 4,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    fontSize: 15,
    color: COLORS.text,
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    gap: 6,
    alignSelf: 'flex-start',
  },
  filterIndicatorText: {
    ...FONTS.small,
    color: COLORS.primary,
    fontWeight: '600',
  },
  segmented: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm + 4,
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

export default HomeScreen;
