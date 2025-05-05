type Class = {
  id: string | number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  class_type: string;
  trainer: string;
  dance_category: string;
  vacancies: number;
  advancement_level: string;
  participants_limit: number;
  price: number;
  description: string;
  classroom: string;
  class_status: string;
  group_number: number;
};

type Ticket = {
  id: string | number;
  class: Class;
  user_id: string | number;
  created_at: string;
  updated_at: string;
};

export * from "../auth/auth-client";
export type { Class, Ticket };