import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { noteBackgrounds } from '@/constants/colors';
import { JokeNote } from '@/context/NotesContext';
import { useColors } from '@/hooks/useColors';

interface NoteCardProps {
  note: JokeNote;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function NoteCard({ note, onPress, onToggleFavorite }: NoteCardProps) {
  const colors = useColors();
  const cardColor = noteBackgrounds[note.background];
  const content = (
    <View style={styles.inner}>
      <View style={styles.topRow}>
        <View style={[styles.category, { backgroundColor: `${colors.foreground}12` }]}>
          <Text style={[styles.categoryText, { color: colors.foreground }]}>{note.category}</Text>
        </View>
        <Pressable
          accessibilityLabel={note.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          hitSlop={12}
          onPress={onToggleFavorite}
          style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}
        >
          <Feather name={note.favorite ? 'heart' : 'heart'} size={18} color={note.favorite ? colors.primary : colors.foreground} />
        </Pressable>
      </View>
      <Text numberOfLines={1} style={[styles.title, { color: colors.foreground }]}>
        {note.title || 'Sin título'}
      </Text>
      <Text numberOfLines={3} style={[styles.body, { color: colors.foreground }]}>
        {note.body}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.date, { color: colors.foreground }]}>
          {new Date(note.updatedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
        </Text>
        <Feather name="arrow-up-right" size={16} color={colors.foreground} />
      </View>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: cardColor }, pressed && styles.pressed]}
    >
      {note.photoUri ? (
        <ImageBackground source={{ uri: note.photoUri }} imageStyle={styles.image} style={styles.imageBackground}>
          <View style={styles.photoOverlay}>{content}</View>
        </ImageBackground>
      ) : (
        content
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, overflow: 'hidden', minHeight: 190, marginBottom: 14 },
  imageBackground: { minHeight: 190 },
  image: { opacity: 0.55 },
  photoOverlay: { backgroundColor: 'rgba(255,250,241,0.66)', flex: 1 },
  inner: { flex: 1, justifyContent: 'space-between', padding: 18 },
  topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  category: { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 6 },
  categoryText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  favoriteButton: { alignItems: 'center', height: 34, justifyContent: 'center', width: 34 },
  title: { fontSize: 19, fontWeight: '700', marginTop: 18 },
  body: { fontSize: 15, fontWeight: '500', lineHeight: 22, marginTop: 8 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  date: { fontSize: 12, fontWeight: '500', opacity: 0.62 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});