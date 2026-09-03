import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { JokeNote, NoteCategory } from '@/context/NotesContext';
import { noteBackgrounds, NoteBackground } from '@/constants/colors';
import { useColors } from '@/hooks/useColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const categories: NoteCategory[] = ['Observaciones', 'Juegos de palabras', 'One-liners', 'Historias'];

interface NoteEditorModalProps {
  visible: boolean;
  note?: JokeNote;
  onClose: () => void;
  onSave: (input: Omit<JokeNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
}

export function NoteEditorModal({ visible, note, onClose, onSave, onDelete }: NoteEditorModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const [category, setCategory] = useState<NoteCategory>(note?.category ?? 'One-liners');
  const [background, setBackground] = useState<NoteBackground>(note?.background ?? 'cream');
  const [photoUri, setPhotoUri] = useState(note?.photoUri);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0]?.uri);
      await Haptics.selectionAsync();
    }
  };

  const save = async () => {
    if (!body.trim()) {
      Alert.alert('Falta el chiste', 'Escribe al menos el remate para guardar la nota.');
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({ title: title.trim(), body: body.trim(), category, background, photoUri, favorite: note?.favorite ?? false });
    onClose();
  };

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={visible} onRequestClose={onClose}>
      <View style={[styles.modal, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
          <Pressable accessibilityLabel="Cerrar editor" hitSlop={12} onPress={onClose} style={styles.iconButton}>
            <Feather name="x" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{note ? 'Editar chiste' : 'Nuevo chiste'}</Text>
          <Pressable accessibilityLabel="Guardar chiste" disabled={!body.trim()} hitSlop={12} onPress={save} style={({ pressed }) => [styles.saveButton, { backgroundColor: colors.primary }, !body.trim() && styles.disabled, pressed && styles.pressed]}>
            <Feather name="check" size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>
        <KeyboardAwareScrollViewCompat contentContainerStyle={styles.scrollContent} bottomOffset={24} showsVerticalScrollIndicator={false}>
          <TextInput
            autoFocus={!note}
            maxLength={60}
            onChangeText={setTitle}
            placeholder="Título opcional"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.titleInput, { color: colors.foreground }]}
            value={title}
          />
          <TextInput
            multiline
            onChangeText={setBody}
            placeholder="Escribe la idea antes de que se escape..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.bodyInput, { backgroundColor: noteBackgrounds[background], color: colors.foreground }]}
            textAlignVertical="top"
            value={body}
          />

          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>TIPO DE CHISTE</Text>
          <View style={styles.chipWrap}>
            {categories.map((item) => (
              <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, { backgroundColor: category === item ? colors.foreground : colors.secondary }]}>
                <Text style={[styles.chipText, { color: category === item ? colors.background : colors.secondaryForeground }]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>FONDO</Text>
            <Pressable accessibilityLabel="Elegir foto de fondo" onPress={pickPhoto} style={styles.photoAction}>
              <Feather name="image" size={16} color={colors.primary} />
              <Text style={[styles.photoActionText, { color: colors.primary }]}>Usar foto</Text>
            </Pressable>
          </View>
          <View style={styles.backgroundRow}>
            {(Object.keys(noteBackgrounds) as NoteBackground[]).map((item) => (
              <Pressable key={item} accessibilityLabel={`Fondo ${item}`} onPress={() => { setBackground(item); setPhotoUri(undefined); }} style={[styles.backgroundSwatch, { backgroundColor: noteBackgrounds[item] }, background === item && !photoUri && { borderColor: colors.foreground }]}>
                {background === item && !photoUri ? <Feather name="check" size={17} color={colors.foreground} /> : null}
              </Pressable>
            ))}
          </View>
          {photoUri ? (
            <View style={styles.photoPreviewRow}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <View style={styles.photoCopy}>
                <Text style={[styles.photoTitle, { color: colors.foreground }]}>Foto elegida</Text>
                <Text style={[styles.photoHint, { color: colors.mutedForeground }]}>Tu chiste tendrá un fondo único.</Text>
              </View>
              <Pressable accessibilityLabel="Quitar foto" hitSlop={10} onPress={() => setPhotoUri(undefined)}>
                <Feather name="trash-2" size={18} color={colors.destructive} />
              </Pressable>
            </View>
          ) : null}
          {onDelete ? (
            <Pressable accessibilityLabel="Eliminar chiste" onPress={onDelete} style={styles.deleteButton}>
              <Feather name="trash-2" size={16} color={colors.destructive} />
              <Text style={[styles.deleteText, { color: colors.destructive }]}>Eliminar nota</Text>
            </Pressable>
          ) : null}
        </KeyboardAwareScrollViewCompat>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { flex: 1 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14 },
  iconButton: { alignItems: 'center', height: 42, justifyContent: 'center', width: 42 },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  saveButton: { alignItems: 'center', borderRadius: 14, height: 42, justifyContent: 'center', width: 42 },
  scrollContent: { padding: 20, paddingBottom: 46 },
  titleInput: { fontSize: 28, fontWeight: '700', paddingVertical: 8 },
  bodyInput: { borderRadius: 20, fontSize: 18, lineHeight: 28, minHeight: 220, padding: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 10, marginTop: 28 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 100, paddingHorizontal: 13, paddingVertical: 9 },
  chipText: { fontSize: 12, fontWeight: '600' },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  photoAction: { alignItems: 'center', flexDirection: 'row', gap: 6, paddingVertical: 8 },
  photoActionText: { fontSize: 13, fontWeight: '700' },
  backgroundRow: { flexDirection: 'row', gap: 13 },
  backgroundSwatch: { alignItems: 'center', borderColor: 'transparent', borderRadius: 17, borderWidth: 3, height: 48, justifyContent: 'center', width: 48 },
  photoPreviewRow: { alignItems: 'center', flexDirection: 'row', gap: 12, marginTop: 18 },
  photoPreview: { borderRadius: 14, height: 54, width: 54 },
  photoCopy: { flex: 1 },
  photoTitle: { fontSize: 14, fontWeight: '700' },
  photoHint: { fontSize: 12, marginTop: 3 },
  deleteButton: { alignItems: 'center', flexDirection: 'row', gap: 7, justifyContent: 'center', marginTop: 42, padding: 12 },
  deleteText: { fontSize: 13, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.96 }] },
});