
import { v4 as uuidv4 } from 'uuid';
import { AppTemplate } from "@/types/appBuilder";

export function getIconForTemplate(template: AppTemplate): string {
  switch (template) {
    case 'ecommerce': return 'shopping-bag';
    case 'social': return 'users';
    case 'blog': return 'book-open';
    case 'business': return 'briefcase';
    default: return 'file';
  }
}

export function createDefaultScreen() {
  return {
    id: uuidv4(),
    name: "Home",
    components: []
  };
}
