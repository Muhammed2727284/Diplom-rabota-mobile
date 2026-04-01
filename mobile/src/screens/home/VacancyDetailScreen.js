import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { getVacancyDetail } from '../../api/vacancies';
import { applyToVacancy } from '../../api/applications';
import { useAuth } from '../../context/AuthContext';
import { formatSalary } from '../../utils/formatters';
import { getEmploymentLabel, getWorkFormatLabel } from '../../utils/enums';
import FavoriteHeart from '../../components/FavoriteHeart';

const VacancyDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadVacancy();
  }, [id]);

  const loadVacancy = async () => {
    try {
      const res = await getVacancyDetail(id);
      setVacancy(res.data);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить вакансию');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToVacancy(id, {});
      Alert.alert('Успешно', 'Отклик отправлен!');
    } catch (e) {
      const msg = e.response?.data?.detail || 'Не удалось откликнуться';
      Alert.alert('Ошибка', msg);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!vacancy) return null;

  const org = vacancy.organization || {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{vacancy.title}</Text>
          <FavoriteHeart targetType="VACANCY" targetId={vacancy.id} size={28} />
        </View>

        <Text style={styles.salary}>{formatSalary(vacancy.salary_from, vacancy.salary_to)}</Text>

        <View style={styles.tags}>
          {vacancy.city ? (
            <View style={styles.tagWrap}>
              <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.tagText}>{vacancy.city}</Text>
            </View>
          ) : null}
          <View style={[styles.tagWrap, styles.tagAccent]}>
            <Text style={styles.tagAccentText}>{getEmploymentLabel(vacancy.employment_type)}</Text>
          </View>
          <View style={[styles.tagWrap, styles.tagAccent]}>
            <Text style={styles.tagAccentText}>{getWorkFormatLabel(vacancy.work_format)}</Text>
          </View>
        </View>

        {org.name ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Компания</Text>
            <View style={styles.companyRow}>
              <View style={styles.companyIcon}>
                <Ionicons name="business-outline" size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.companyName}>{org.name}</Text>
                {org.city ? <Text style={styles.companyDetail}>{org.city}</Text> : null}
              </View>
            </View>
            {org.phone ? <Text style={styles.sectionText}>Тел: {org.phone}</Text> : null}
            {org.website ? <Text style={[styles.sectionText, { color: COLORS.primary }]}>{org.website}</Text> : null}
          </View>
        ) : null}

        {vacancy.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.sectionText}>{vacancy.description}</Text>
          </View>
        ) : null}

        {vacancy.requirements ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Требования</Text>
            <Text style={styles.sectionText}>{vacancy.requirements}</Text>
          </View>
        ) : null}

        {vacancy.conditions ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Условия</Text>
            <Text style={styles.sectionText}>{vacancy.conditions}</Text>
          </View>
        ) : null}
      </ScrollView>

      {user?.role === 'USER' && (
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={[styles.applyBtn, applying && { opacity: 0.7 }]}
            onPress={handleApply}
            disabled={applying}
            activeOpacity={0.8}
          >
            {applying ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.applyBtnText}>Откликнуться</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { ...FONTS.heading, flex: 1, marginRight: SPACING.sm },
  salary: { ...FONTS.title, color: COLORS.primary, marginTop: SPACING.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.md, gap: SPACING.sm },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  tagText: { fontSize: 13, color: COLORS.textSecondary },
  tagAccent: { backgroundColor: COLORS.primaryLight },
  tagAccentText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  section: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitle: { ...FONTS.bold, fontSize: 17, marginBottom: SPACING.sm },
  sectionText: { ...FONTS.regular, lineHeight: 22, marginBottom: 4 },
  companyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  companyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm + 4,
  },
  companyName: { ...FONTS.bold, fontSize: 15 },
  companyDetail: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm + 4,
    backgroundColor: COLORS.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default VacancyDetailScreen;
