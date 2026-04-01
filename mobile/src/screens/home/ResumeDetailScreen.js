import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { getResumeDetail } from '../../api/resumes';
import { formatSalary } from '../../utils/formatters';
import { getEmploymentLabel, getWorkFormatLabel } from '../../utils/enums';
import FavoriteHeart from '../../components/FavoriteHeart';

const ResumeDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      const res = await getResumeDetail(id);
      setResume(res.data);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить резюме');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!resume) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{resume.title}</Text>
        <FavoriteHeart targetType="RESUME" targetId={resume.id} size={28} />
      </View>

      <Text style={styles.position}>{resume.position}</Text>
      <Text style={styles.salary}>{formatSalary(resume.salary_from, resume.salary_to)}</Text>

      <View style={styles.tags}>
        {resume.city ? (
          <View style={styles.tagWrap}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.tagText}>{resume.city}</Text>
          </View>
        ) : null}
        <View style={[styles.tagWrap, styles.tagAccent]}>
          <Text style={styles.tagAccentText}>{getEmploymentLabel(resume.employment_type)}</Text>
        </View>
        <View style={[styles.tagWrap, styles.tagAccent]}>
          <Text style={styles.tagAccentText}>{getWorkFormatLabel(resume.work_format)}</Text>
        </View>
      </View>

      {/* Contact info */}
      <View style={styles.contactCard}>
        <View style={styles.contactRow}>
          <Ionicons name="person-outline" size={18} color={COLORS.primary} />
          <Text style={styles.contactValue}>{resume.owner_name || 'Не указано'}</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
          <Text style={styles.contactValue}>{resume.owner_email}</Text>
        </View>
      </View>

      {resume.about ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О себе</Text>
          <Text style={styles.sectionText}>{resume.about}</Text>
        </View>
      ) : null}

      {resume.skills ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Навыки</Text>
          <Text style={styles.sectionText}>{resume.skills}</Text>
        </View>
      ) : null}

      {resume.experience ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Опыт работы</Text>
          <Text style={styles.sectionText}>{resume.experience}</Text>
        </View>
      ) : null}

      {resume.education ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Образование</Text>
          <Text style={styles.sectionText}>{resume.education}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { ...FONTS.heading, flex: 1, marginRight: SPACING.sm },
  position: { ...FONTS.medium, color: COLORS.textSecondary, marginTop: 4 },
  salary: { ...FONTS.title, color: COLORS.secondary, marginTop: SPACING.sm },
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
  tagAccent: { backgroundColor: COLORS.secondaryLight },
  tagAccentText: { fontSize: 13, color: COLORS.secondary, fontWeight: '500' },
  contactCard: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  contactValue: { ...FONTS.medium, fontSize: 14 },
  section: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitle: { ...FONTS.bold, fontSize: 17, marginBottom: SPACING.sm },
  sectionText: { ...FONTS.regular, lineHeight: 22 },
});

export default ResumeDetailScreen;
