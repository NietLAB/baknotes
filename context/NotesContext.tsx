import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NoteBackground } from '@/constants/colors';

export type NoteCategory =
  | 'Observaciones'
  | 'Juegos de palabras'
  | 'One-liners'
  | 'Historias';

export interface JokeNote {
  id: string;
  title: string;
  body: string;
  category: NoteCategory;
  background: NoteBackground;
  photoUri?: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = '@baknotes/notes-v1';

const seedNotes: JokeNote[] = [
  {
    id: 'seed-1',
    title: 'El chiste del ascensor',
    body: 'Mi ascensor está deprimido… siempre baja, pero nunca sabe cómo subir el ánimo.',
    category: 'One-liners',
    background: 'peach',
    favorite: true,
    createdAt: '2026-09-02T10:30:00.000Z',
    updatedAt: '2026-09-02T10:30:00.000Z',
  },
  {
    id: 'seed-2',
    title: 'Para la sobremesa',
    body: '—¿Qué hace una abeja en el gimnasio?\\n—¡Zum-ba!',
    category: 'Juegos de palabras',
    background: 'sunny',
    favorite: false,
    createdAt: '2026-09-01T16:15:00.000Z',
    updatedAt: '2026-09-01T16:15:00.000Z',
  },
  {
    id: 'seed-3',
    title: 'Idea de observación',
    body: 'La adultez es abrir el refrigerador tres veces esperando que aparezca una solución.',
    category: 'Observaciones',
    background: 'lilac',
    favorite: false,
    createdAt: '2026-08-30T08:45:00.000Z',
    updatedAt: '2026-08-30T08:45:00.000Z',
  },
];

interface NotesContextValue {
  notes: JokeNote[];
  isLoading: boolean;
  addNote: (input: Omit<JokeNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, input: Omit<JokeNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const NotesContext = createContext<NotesContextValue | null>(null);

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<JokeNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!mounted) return;
        if (stored) {
          try {
            setNotes(JSON.parse(stored) as JokeNote[]);
          } catch {
            setNotes(seedNotes);
          }
        } else {
          setNotes(seedNotes);
        }
      })
      .catch(() => {
        if (mounted) setNotes(seedNotes);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes)).catch(() => undefined);
    }
  }, [isLoading, notes]);

  const value = useMemo<NotesContextValue>(
    () => ({
      notes,
      isLoading,
      addNote: (input) => {
        const now = new Date().toISOString();
        setNotes((current) => [
          { ...input, id: createId(), createdAt: now, updatedAt: now },
          ...current,
        ]);
      },
      updateNote: (id, input) => {
        setNotes((current) =>
          current.map((note) =>
            note.id === id ? { ...input, id, createdAt: note.createdAt, updatedAt: new Date().toISOString() } : note,
          ),
        );
      },
      deleteNote: (id) => setNotes((current) => current.filter((note) => note.id !== id)),
      toggleFavorite: (id) =>
        setNotes((current) =>
          current.map((note) => (note.id === id ? { ...note, favorite: !note.favorite } : note)),
        ),
    }),
    [isLoading, notes],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used inside NotesProvider');
  return context;
}