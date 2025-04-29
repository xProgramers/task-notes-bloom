
export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: string;
          tags: string[];
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          due_date: string;
          due_time: string;
          status: string;
          completed: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          due_date: string;
          due_time: string;
          status: string;
          completed?: boolean;
          tags: string[];
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          due_date?: string;
          due_time?: string;
          status?: string;
          completed?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
    };
  };
}
