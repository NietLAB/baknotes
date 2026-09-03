import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { noteBackgrounds } from '@/constants/colors';
import { useNotes } from '@/context/NotesContext';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes } = useNotes();

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30, paddingTop: Math.max(insets.top, 20) }]} showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.background }}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>BAKNOTES</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Tu espacio,{'\n'}tus reglas.</Text>
      <Text style={[styles.caption, { color: colors.mutedForeground }]}>Personaliza cómo se siente cada idea que guardas.</Text>

      <View style={[styles.preview, { backgroundColor: noteBackgrounds.peach }]}>
        <View style={[styles.previewBubble, { backgroundColor: colors.foreground }]}><Feather name="edit-3" size={17} color={colors.accent} /></View>
        <Text style={[styles.previewTitle, { color: colors.foreground }]}>Un chiste con tu sello</Text>
        <Text style={[styles.previewBody, { color: colors.foreground }]}>Cada nota puede tener un color o una foto de tu galería.</Text>
        <View style={styles.swatches}>{Object.values(noteBackgrounds).map((background) => <View key={background} style={[styles.swatch, { backgroundColor: background }]} />)}</View>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>RESUMEN</Text>
      <View style={[styles.statRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View><Text style={[styles.statNumber, { color: colors.foreground }]}>{notes.length}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>chistes guardados</Text></View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View><Text style={[styles.statNumber, { color: colors.primary }]}>{notes.filter((note) => note.favorite).length}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>favoritos</Text></View>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>SOBRE LA APP</Text>
      <Pressable onPress={() => Linking.openURL('https://replit.com')} style={[styles.linkRow, { borderBottomColor: colors.border }]}>
        <View style={[styles.linkIcon, { backgroundColor: colors.secondary }]}><Feather name="info" size={17} color={colors.primary} /></View>
        <View style={styles.linkCopy}><Text style={[styles.linkTitle, { color: colors.foreground }]}>BakNotes</Text><Text style={[styles.linkCaption, { color: colors.mutedForeground }]}>Tu libreta rápida de chistes · v1.0</Text></View>
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      </Pressable>
      <View style={styles.localRow}><Feather name="lock" size={15} color={colors.mutedForeground} /><Text style={[styles.localText, { color: colors.mutedForeground }]}>Tus notas se guardan en este dispositivo.</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 2.2, marginBottom: 8 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1, lineHeight: 37 },
  caption: { fontSize: 14, lineHeight: 21, marginTop: 12, maxWidth: 300 },
  preview: { borderRadius: 24, marginTop: 28, minHeight: 190, padding: 20 },
  previewBubble: { alignItems: 'center', borderRadius: 14, height: 36, justifyContent: 'center', width: 36 },
  previewTitle: { fontSize: 19, fontWeight: '700', marginTop: 22 },
  previewBody: { fontSize: 14, lineHeight: 20, marginTop: 7, maxWidth: 275 },
  swatches: { flexDirection: 'row', gap: 7, marginTop: 17 },
  swatch: { borderColor: 'rgba(36,27,47,0.12)', borderRadius: 100, borderWidth: 1, height: 16, width: 16 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 11, marginTop: 30 },
  statRow: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 18 },
  statNumber: { fontSize: 25, fontWeight: '700', textAlign: 'center' },
  statLabel: { fontSize: 12, marginTop: 3 },
  divider: { height: 35, width: 1 },
  linkRow: { alignItems: 'center', borderBottomWidth: 1, flexDirection: 'row', paddingBottom: 16 },
  linkIcon: { alignItems: 'center', borderRadius: 12, height: 38, justifyContent: 'center', width: 38 },
  linkCopy: { flex: 1, marginLeft: 12 },
  linkTitle: { fontSize: 14, fontWeight: '700' },
  linkCaption: { fontSize: 12, marginTop: 3 },
  localRow: { alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 22 },
  localText: { fontSize: 12 },
});