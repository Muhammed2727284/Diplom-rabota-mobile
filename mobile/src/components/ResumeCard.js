import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { formatSalary } from '../utils/formatters';
import { getEmploymentLabel, getWorkFormatLabel } from '../utils/enums';
import FavoriteHeart from './FavoriteHeart';

const ResumeCard = ({ item, onPress, isFavorite = false }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{item.position}</Text>
        </View>
        <FavoriteHeart targetType="RESUME" targetId={item.id} initialActive={isFavorite} />
      </View>
      <Text style={styles.salary}>{formatSalary(item.salary_from, item.salary_to)}</Text>
      <View style={styles.tags}>
        {item.city ? (
          <View style={styles.tagWrap}>
            <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
            <Text style={styles.tagText}>{item.city}</Text>
          </View>
        ) : null}
        <View style={[styles.tagWrap, styles.tagAccent]}>
          <Text style={styles.tagAccentText}>{getEmploymentLabel(item.employment_type)}</Text>
        </View>
        <View style={[styles.tagWrap, styles.tagAccent]}>
          <Text style={styles.tagAccentText}>{getWorkFormatLabel(item.work_format)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm + 2,
    ...SHADOWS.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleWrap: { flex: 1, marginRight: SPACING.sm },
  title: { ...FONTS.bold, fontSize: 16, lineHeight: 22 },
  subtitle: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  salary: { ...FONTS.bold, color: COLORS.secondary, marginTop: SPACING.sm, fontSize: 15 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.sm, gap: SPACING.sm },
  tagWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    gap: 3,
  },
  tagText: { fontSize: 12, color: COLORS.textSecondary },
  tagAccent: {
    backgroundColor: COLORS.secondaryLight,
  },
  tagAccentText: { fontSize: 12, color: COLORS.secondary, fontWeight: '500' },
});

export default ResumeCard;
