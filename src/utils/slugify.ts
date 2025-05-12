export const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, '');
  };