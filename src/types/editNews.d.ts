export interface NewsItem {
  _id: string;
  title: string;
  description?: string;
  category: string;
  author: string;
  date: string;
}

export interface EditFormData {
  title: string;
  body: string;
  category: string;
  author: string;
  date: string;
}