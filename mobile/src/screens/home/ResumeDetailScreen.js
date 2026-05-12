import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator,
  TouchableOpacity, Modal, TextInput, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { getResumeDetail } from '../../api/resumes';
import { getMyVacancies } from '../../api/vacancies';
import { inviteToResume } from '../../api/applications';
import { formatSalary } from '../../utils/formatters';
import { getEmploymentLabel, getWorkFormatLabel } from '../../utils/enums';
import { useAuth } from '../../context/AuthContext';
import FavoriteHeart from '../../components/FavoriteHeart';

const ResumeDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const { user } = useAuth();
  const isOrg = user?.role === 'ORG';
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [myVacancies, setMyVacancies] = useState([]);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [sending, setSending] = useState(false);

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

  const openInvite = async () => {
    setInviteOpen(true);
    setSelectedVacancyId(null);
    setInviteMessage('');
    setVacanciesLoading(true);
    try {
      const res = await getMyVacancies();
      const list = res.data.results || res.data;
      setMyVacancies(list.filter((v) => v.is_published));
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить ваши вакансии.');
    } finally {
      setVacanciesLoading(false);
    }
  };

  const sendInvite = async () => {
    if (!selectedVacancyId) {
      Alert.alert('Выберите вакансию');
      return;
    }
    setSending(true);
    try {
      await inviteToResume(resume.id, {
        vacancy_id: selectedVacancyId,
        message: inviteMessage,
      });
      setInviteOpen(false);
      Alert.alert('Готово', 'Приглашение отправлено.');
    } catch (e) {
      const msg = e?.response?.data?.detail || 'Не удалось отправить приглашение.';
      Alert.alert('Ошибка', msg);
    } finally {
      setSending(false);
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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

      {isOrg && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.inviteBtn} onPress={openInvite} activeOpacity={0.85}>
            <Ionicons name="mail-outline" size={20} color={COLORS.white} />
            <Text style={styles.inviteBtnText}>Пригласить на вакансию</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={inviteOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setInviteOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Пригласить кандидата</Text>
              <TouchableOpacity onPress={() => setInviteOpen(false)}>
                <Ionicons name="close" size={26} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Выберите вакансию</Text>
            {vacanciesLoading ? (
              <ActivityIndicator color={COLORS.primary} style={{ marginVertical: SPACING.md }} />
            ) : myVacancies.length === 0 ? (
              <Text style={styles.emptyText}>
                У вас нет опубликованных вакансий. Создайте вакансию, чтобы приглашать кандидатов.
              </Text>
            ) : (
              <FlatList
                data={myVacancies}
                keyExtractor={(item) => String(item.id)}
                style={styles.vacancyList}
                renderItem={({ item }) => {
                  const selected = selectedVacancyId === item.id;
                  return (
                    <TouchableOpacity
                      style={[styles.vacancyItem, selected && styles.vacancyItemSelected]}
                      onPress={() => setSelectedVacancyId(item.id)}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.vacancyTitle}>{item.title}</Text>
                        <Text style={styles.vacancyPos}>{item.position}</Text>
                      </View>
                      {selected && (
                        <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            <Text style={styles.modalLabel}>Сообщение (необязательно)</Text>
            <TextInput
              style={styles.messageInput}
              value={inviteMessage}
              onChangeText={setInviteMessage}
              placeholder="Расскажите, почему хотите пригласить..."
              placeholderTextColor={COLORS.textLight}
              multiline
            />

            <TouchableOpacity
              style={[styles.sendBtn, (!selectedVacancyId || sending) && styles.sendBtnDisabled]}
              onPress={sendInvite}
              disabled={!selectedVacancyId || sending}
              activeOpacity={0.85}
            >
              {sending ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.sendBtnText}>Отправить приглашение</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 100 },
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

  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  inviteBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  inviteBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: { ...FONTS.heading, fontSize: 20 },
  modalLabel: { ...FONTS.bold, fontSize: 14, marginTop: SPACING.sm, marginBottom: SPACING.sm },
  vacancyList: { maxHeight: 260, marginBottom: SPACING.sm },
  vacancyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  vacancyItemSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  vacancyTitle: { ...FONTS.bold, fontSize: 14 },
  vacancyPos: { ...FONTS.small, color: COLORS.textSecondary, marginTop: 2 },
  emptyText: { ...FONTS.regular, color: COLORS.textSecondary, marginVertical: SPACING.md },
  messageInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 2,
    minHeight: 80,
    textAlignVertical: 'top',
    ...FONTS.regular,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  sendBtnDisabled: { backgroundColor: COLORS.gray300 },
  sendBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});

export default ResumeDetailScreen;
