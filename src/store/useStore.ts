
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Note, TaskStats } from '../types';

interface StoreState {
  tasks: Task[];
  notes: Note[];
  activeView: 'dashboard' | 'tasks' | 'notes';
  
  // Actions para tarefas
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  rescheduleTask: (id: string, dueDate: string, dueTime: string) => void;
  
  // Actions para notas
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Actions para navegação
  setActiveView: (view: 'dashboard' | 'tasks' | 'notes') => void;
  
  // Getters para estatísticas e consultas
  getTaskStats: () => TaskStats;
  getTasksByStatus: (status: 'pending' | 'completed' | 'rescheduled') => Task[];
  getTasksDueToday: () => Task[];
  searchTasks: (query: string) => Task[];
  searchNotes: (query: string) => Note[];
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      notes: [],
      activeView: 'dashboard',
      
      // Implementações das actions para tarefas
      addTask: (task) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },
      
      updateTask: (id, updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id 
              ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() } 
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      toggleTaskCompletion: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id 
              ? { 
                  ...task, 
                  completed: !task.completed, 
                  status: !task.completed ? 'completed' : 'pending',
                  updatedAt: new Date().toISOString() 
                } 
              : task
          ),
        }));
      },
      
      rescheduleTask: (id, dueDate, dueTime) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id 
              ? { 
                  ...task, 
                  dueDate,
                  dueTime,
                  status: 'rescheduled',
                  updatedAt: new Date().toISOString() 
                } 
              : task
          ),
        }));
      },
      
      // Implementações das actions para notas
      addNote: (note) => {
        const now = new Date().toISOString();
        const newNote: Note = {
          ...note,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          notes: [...state.notes, newNote],
        }));
      },
      
      updateNote: (id, updatedNote) => {
        set((state) => ({
          notes: state.notes.map((note) => 
            note.id === id 
              ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } 
              : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },
      
      // Implementações das actions para navegação
      setActiveView: (view) => {
        set({ activeView: view });
      },
      
      // Implementações dos getters
      getTaskStats: () => {
        const { tasks } = get();
        const completed = tasks.filter((task) => task.status === 'completed').length;
        const pending = tasks.filter((task) => task.status === 'pending').length;
        const rescheduled = tasks.filter((task) => task.status === 'rescheduled').length;
        const total = tasks.length;
        
        return {
          completed,
          pending,
          rescheduled,
          total,
          completionRate: total > 0 ? (completed / total) * 100 : 0,
        };
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },
      
      getTasksDueToday: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter((task) => task.dueDate === today);
      },
      
      searchTasks: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().tasks.filter((task) => 
          task.title.toLowerCase().includes(lowerQuery) || 
          task.description.toLowerCase().includes(lowerQuery) ||
          task.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
      
      searchNotes: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().notes.filter((note) => 
          note.title.toLowerCase().includes(lowerQuery) || 
          note.content.toLowerCase().includes(lowerQuery) ||
          note.category.toLowerCase().includes(lowerQuery) ||
          note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'bloom-storage',
    }
  )
);

export default useStore;
