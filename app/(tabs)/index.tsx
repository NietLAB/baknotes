import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NoteCard } from '@/components/NoteCard';
import { NoteEditorModal } from '@/components/NoteEditorModal';
import { JokeNote, useNotes } from '@/context/NotesContext';
import { useColors } from '@/hooks/useColors';

const filters = ['Todos', 'One-liners', 'Observaciones', 'Juegos de palabras', 'Historias'] as const;

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes, isLoading, addNote, updateNote, deleteNote, toggleFavorite } = useNotes();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos');
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<JokeNote>();

  const visibleNotes = useMemo(
    () =>
      notes.filter((note) => {
        const matchesFilter = filter === 'Todos' || note.category === filter;
        const query = search.trim().toLowerCase();
        return matchesFilter && (!query || `${note.title} ${note.body} ${note.category}`.toLowerCase().includes(query));
      }),
    [filter, notes, search],
  );

  const openNew = () => {
    setEditingNote(undefined);
    setEditorVisible(true);
  };

  const openEdit = (note: JokeNote) => {
    setEditingNote(note);
    setEditorVisible(true);
  };

  const saveNote = (input: Omit<JokeNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) updateNote(editingNote.id, input);
    else addNote(input);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        contentContainerStyle={{ paddingBottom: insets.bottom + 116, paddingTop: Math.max(insets.top, 16) }}
        data={isLoading ? [] : visibleNotes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.empty}><ActivityIndicator color={colors.primary} /><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Cargando tus ideas...</Text></View>
          ) : (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name="wind" size={24} color={colors.primary} /></View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Todavía no hay remates aquí</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Toca el botón de abajo y guarda esa idea antes de que desaparezca.</Text>
            </View>
          )
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View>
                <Text style={[styles.eyebrow, { color: colors.primary }]}>BAKNOTES</Text>
                <Text style={[styles.greeting, { color: colors.foreground }]}>Tu rincón de{'\n'}remates.</Text>
              </View>
              <View style={[styles.logoMark, { backgroundColor: colors.foreground }]}><Feather name="edit-3" size={20} color={colors.accent} /></View>
            </View>
            <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="search" size={18} color={colors.mutedForeground} />
              <TextInput accessibilityLabel="Buscar chistes" onChangeText={setSearch} placeholder="Busca por palabra o título" placeholderTextColor={colors.mutedForeground} style={[styles.searchInput, { color: colors.foreground }]} value={search} />
              {search ? <Pressable hitSlop={10} onPress={() => setSearch('')}><Feather name="x-circle" size={17} color={colors.mutedForeground} /></Pressable> : null}
            </View>
            <View style={styles.sectionIntro}>
              <View><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Mis chistes</Text><Text style={[styles.sectionCaption, { color: colors.mutedForeground }]}>{notes.length} ideas guardadas</Text></View>
              <Feather name="more-horizontal" size={22} color={colors.mutedForeground} />
            </View>
            <FlatList
              contentContainerStyle={styles.filterList}
              data={filters}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => <Pressable onPress={() => { setFilter(item); Haptics.selectionAsync(); }} style={[styles.filterChip, { backgroundColor: filter === item ? colors.primary : colors.secondary }]}><Text style={[styles.filterText, { color: filter === item ? colors.primaryForeground : colors.secondaryForeground }]}>{item}</Text></Pressable>}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }
        refreshControl={<RefreshControl colors={[colors.primary]} refreshing={false} onRefresh={() => undefined} tintColor={colors.primary} />}
        renderItem={({ item }) => <NoteCard note={item} onPress={() => openEdit(item)} onToggleFavorite={() => toggleFavorite(item.id)} />}
        scrollEnabled={visibleNotes.length > 0 || isLoading}
        showsVerticalScrollIndicator={false}
      />
      <Pressable accessibilityLabel="Nuevo chiste" onPress={openNew} style={({ pressed }) => [styles.fab, { backgroundColor: colors.primary, bottom: insets.bottom + 72 }, pressed && styles.fabPressed]}>
        <Feather name="plus" size={25} color={colors.primaryForeground} />
        <Text style={[styles.fabText, { color: colors.primaryForeground }]}>Nuevo chiste</Text>
      </Pressable>
      <NoteEditorModal key={editingNote?.id ?? 'new'} note={editingNote} visible={editorVisible} onClose={() => setEditorVisible(false)} onDelete={editingNote ? () => { deleteNote(editingNote.id); setEditorVisible(false); } : undefined} onSave={saveNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 20 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 2.2, marginBottom: 8 },
  greeting: { fontSize: 34, fontWeight: '700', letterSpacing: -1.2, lineHeight: 37 },
  logoMark: { alignItems: 'center', borderRadius: 18, height: 50, justifyContent: 'center', width: 50 },
  searchBox: { alignItems: 'center', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 10, marginHorizontal: 20, paddingHorizontal: 15 },
  searchInput: { flex: 1, fontSize: 14, height: 50 },
  sectionIntro: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700' },
  sectionCaption: { fontSize: 13, marginTop: 3 },
  filterList: { gap: 8, paddingHorizontal: 20, paddingVertical: 16 },
  filterChip: { borderRadius: 100, paddingHorizontal: 14, paddingVertical: 9 },
  filterText: { fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', justifyContent: 'center', minHeight: 240, paddingHorizontal: 48 },
  emptyIcon: { alignItems: 'center', borderRadius: 18, height: 52, justifyContent: 'center', marginBottom: 16, width: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyText: { fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  fab: { alignItems: 'center', borderRadius: 18, elevation: 5, flexDirection: 'row', gap: 8, paddingHorizontal: 18, paddingVertical: 15, position: 'absolute', right: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 10 },
  fabText: { fontSize: 14, fontWeight: '800' },
  fabPressed: { opacity: 0.84, transform: [{ scale: 0.96 }] },
});