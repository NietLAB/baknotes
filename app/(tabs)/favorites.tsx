import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditorModal } from '@/components/NoteEditorModal';
import { JokeNote, useNotes } from '@/context/NotesContext';
import { useColors } from '@/hooks/useColors';

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes, toggleFavorite, updateNote, deleteNote } = useNotes();
  const [editingNote, setEditingNote] = useState<JokeNote>();
  const favorites = notes.filter((note) => note.favorite);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 34, paddingTop: Math.max(insets.top, 20), paddingHorizontal: 20 }}
        data={favorites}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<View style={styles.empty}><View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name="heart" size={23} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Tus favoritos aparecerán aquí</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Marca un chiste con el corazón para encontrarlo en un segundo.</Text></View>}
        ListHeaderComponent={<View style={styles.header}><Text style={[styles.eyebrow, { color: colors.primary }]}>COLECCIÓN</Text><Text style={[styles.title, { color: colors.foreground }]}>Favoritos</Text><Text style={[styles.caption, { color: colors.mutedForeground }]}>{favorites.length} chistes que vale la pena repetir.</Text></View>}
        renderItem={({ item }) => <NoteCard note={item} onPress={() => setEditingNote(item)} onToggleFavorite={() => toggleFavorite(item.id)} />}
        scrollEnabled={favorites.length > 0}
        showsVerticalScrollIndicator={false}
      />
      <NoteEditorModal key={editingNote?.id ?? 'favorite-none'} note={editingNote} visible={!!editingNote} onClose={() => setEditingNote(undefined)} onDelete={editingNote ? () => { deleteNote(editingNote.id); setEditingNote(undefined); } : undefined} onSave={(input) => { if (editingNote) updateNote(editingNote.id, input); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { marginBottom: 25 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 2.2, marginBottom: 8 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -1 },
  caption: { fontSize: 14, marginTop: 8 },
  empty: { alignItems: 'center', justifyContent: 'center', minHeight: 310, paddingHorizontal: 32 },
  emptyIcon: { alignItems: 'center', borderRadius: 18, height: 52, justifyContent: 'center', marginBottom: 16, width: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyText: { fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
});