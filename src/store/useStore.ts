import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Note, TaskStats, TaskRecurrence } from '../types';
import { supabase } from '@/lib/supabase';
import { addDays, addWeeks, addYears, format } from 'date-fns';

interface StoreState {
  tasks: Task[];
  notes: Note[];
  activeView: 'dashboard' | 'tasks' | 'notes' | 'calendar';
  isLoading: boolean;
  
  // Actions para tarefas
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  rescheduleTask: (id: string, dueDate: string, dueTime: string) => Promise<void>;
  
  // Helper function for recurring tasks
  createRecurringTask: (task: Task) => Promise<void>;
  
  // Actions para notas
  fetchNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  // Actions para navegação
  setActiveView: (view: 'dashboard' | 'tasks' | 'notes' | 'calendar') => void;
  
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
      isLoading: false,
      
      // Helper function for recurring tasks
      createRecurringTask: async (task: Task) => {
        if (!task.recurrence || task.recurrence === 'none') return;
        
        let newDueDate: Date;
        
        switch (task.recurrence) {
          case 'daily':
            newDueDate = addDays(new Date(task.dueDate), 1);
            break;
          case 'weekly':
            newDueDate = addWeeks(new Date(task.dueDate), 1);
            break;
          case 'yearly':
            newDueDate = addYears(new Date(task.dueDate), 1);
            break;
          default:
            return;
        }
        
        const formattedDate = format(newDueDate, 'yyyy-MM-dd');
        
        const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
          title: task.title,
          description: task.description,
          dueDate: formattedDate,
          dueTime: task.dueTime,
          status: 'pending',
          completed: false,
          tags: [...task.tags],
          recurrence: task.recurrence as TaskRecurrence,
        };
        
        // Use the existing addTask function to create the new recurring task
        await get().addTask(newTask);
      },
      
      // Implementações das actions para tarefas com Supabase
      fetchTasks: async () => {
        try {
          set({ isLoading: true });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          // Converte os dados do Supabase para o formato da aplicação
          const tasks: Task[] = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            dueDate: item.due_date,
            dueTime: item.due_time,
            status: item.status as 'pending' | 'completed' | 'rescheduled',
            completed: item.completed,
            tags: item.tags,
            recurrence: item.recurrence,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
          
          set({ tasks });
        } catch (error) {
          console.error('Erro ao buscar tarefas:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      addTask: async (task) => {
        try {
          const now = new Date().toISOString();
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { data, error } = await supabase
            .from('tasks')
            .insert([{
              title: task.title,
              description: task.description,
              due_date: task.dueDate,
              due_time: task.dueTime,
              status: task.status,
              completed: task.completed || false,
              tags: task.tags,
              recurrence: task.recurrence || 'none',
              created_at: now,
              updated_at: now,
              user_id: user.id,
            }])
            .select();
            
          if (error) throw error;
          
          if (data && data[0]) {
            const newTask: Task = {
              id: data[0].id,
              title: data[0].title,
              description: data[0].description,
              dueDate: data[0].due_date,
              dueTime: data[0].due_time,
              status: data[0].status as 'pending' | 'completed' | 'rescheduled',
              completed: data[0].completed,
              tags: data[0].tags,
              recurrence: data[0].recurrence,
              createdAt: data[0].created_at,
              updatedAt: data[0].updated_at,
            };
            
            set((state) => ({
              tasks: [...state.tasks, newTask],
            }));
          }
        } catch (error) {
          console.error('Erro ao adicionar tarefa:', error);
        }
      },
      
      updateTask: async (id, updatedTask) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { error } = await supabase
            .from('tasks')
            .update({
              title: updatedTask.title,
              description: updatedTask.description,
              due_date: updatedTask.dueDate,
              due_time: updatedTask.dueTime,
              status: updatedTask.status,
              completed: updatedTask.completed,
              tags: updatedTask.tags,
              recurrence: updatedTask.recurrence,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          set((state) => ({
            tasks: state.tasks.map((task) => 
              task.id === id 
                ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() } 
                : task
            ),
          }));
        } catch (error) {
          console.error('Erro ao atualizar tarefa:', error);
        }
      },
      
      deleteTask: async (id) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        } catch (error) {
          console.error('Erro ao excluir tarefa:', error);
        }
      },
      
      toggleTaskCompletion: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;
        
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const newStatus = !task.completed ? 'completed' : 'pending';
          const isNowCompleted = !task.completed;
          
          const { error } = await supabase
            .from('tasks')
            .update({
              completed: isNowCompleted,
              status: newStatus,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          set((state) => ({
            tasks: state.tasks.map((t) => 
              t.id === id 
                ? { 
                    ...t, 
                    completed: isNowCompleted, 
                    status: newStatus,
                    updatedAt: new Date().toISOString() 
                  } 
                : t
            ),
          }));
          
          // If task is now completed and has recurrence, create the next occurrence
          if (isNowCompleted && task.recurrence && task.recurrence !== 'none') {
            await get().createRecurringTask(task);
          }
        } catch (error) {
          console.error('Erro ao alterar status da tarefa:', error);
        }
      },
      
      rescheduleTask: async (id, dueDate, dueTime) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { error } = await supabase
            .from('tasks')
            .update({
              due_date: dueDate,
              due_time: dueTime,
              status: 'rescheduled',
              updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
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
        } catch (error) {
          console.error('Erro ao reagendar tarefa:', error);
        }
      },
      
      // Implementações das actions para notas com Supabase
      fetchNotes: async () => {
        try {
          set({ isLoading: true });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          // Converte os dados do Supabase para o formato da aplicação
          const notes: Note[] = data.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category,
            tags: item.tags,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }));
          
          set({ notes });
        } catch (error) {
          console.error('Erro ao buscar notas:', error);
        } finally {
          set({ isLoading: false });
        }
      },
      
      addNote: async (note) => {
        try {
          const now = new Date().toISOString();
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { data, error } = await supabase
            .from('notes')
            .insert([{
              title: note.title,
              content: note.content,
              category: note.category,
              tags: note.tags,
              created_at: now,
              updated_at: now,
              user_id: user.id,
            }])
            .select();
            
          if (error) throw error;
          
          if (data && data[0]) {
            const newNote: Note = {
              id: data[0].id,
              title: data[0].title,
              content: data[0].content,
              category: data[0].category,
              tags: data[0].tags,
              createdAt: data[0].created_at,
              updatedAt: data[0].updated_at,
            };
            
            set((state) => ({
              notes: [...state.notes, newNote],
            }));
          }
        } catch (error) {
          console.error('Erro ao adicionar nota:', error);
        }
      },
      
      updateNote: async (id, updatedNote) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { error } = await supabase
            .from('notes')
            .update({
              title: updatedNote.title,
              content: updatedNote.content,
              category: updatedNote.category,
              tags: updatedNote.tags,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          set((state) => ({
            notes: state.notes.map((note) => 
              note.id === id 
                ? { ...note, ...updatedNote, updatedAt: new Date().toISOString() } 
                : note
            ),
          }));
        } catch (error) {
          console.error('Erro ao atualizar nota:', error);
        }
      },
      
      deleteNote: async (id) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
            
          if (error) throw error;
          
          set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
          }));
        } catch (error) {
          console.error('Erro ao excluir nota:', error);
        }
      },
      
      // Keep existing navigation action
      setActiveView: (view) => {
        set({ activeView: view });
      },
      
      // Keep existing getters
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
      // Não persiste tarefas e notas localmente, pois serão buscadas do Supabase
      partialize: (state) => ({ 
        activeView: state.activeView
      }),
    }
  )
);

export default useStore;
