interface NewsFormData {
  title: string;
  body: string;
  date: string;
  category: string;
  author: string;
  description:string
}

interface FormErrors {
  title?: string;
  author?: string;
  category?: string;
  body?: string;
  description?:string
}
