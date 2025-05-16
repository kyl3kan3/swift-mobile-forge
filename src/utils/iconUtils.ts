
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

/**
 * Gets a Lucide icon by name with proper type safety
 * @param iconName The name of the icon to retrieve (first letter will be capitalized)
 * @returns The requested icon component or a fallback icon
 */
export function getLucideIcon(iconName: string): LucideIcon {
  // Ensure first letter is capitalized
  const formattedName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  
  // Cast to any first to avoid type errors, then check if it exists
  const icons = LucideIcons as any;
  
  // Return the requested icon if it exists, or a fallback
  return (icons[formattedName] && typeof icons[formattedName] === 'function') 
    ? icons[formattedName] 
    : icons.Square || icons.FileQuestion;
}
