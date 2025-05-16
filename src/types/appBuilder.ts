
export interface AppProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  template: AppTemplate;
  icon: string;
  screens: AppScreen[];
}

export type AppTemplate = 
  | 'blank'
  | 'ecommerce'
  | 'social'
  | 'blog'
  | 'business';

export type PlatformType = 
  | 'ios'
  | 'android'
  | 'both';

export interface AppScreen {
  id: string;
  name: string;
  components: AppComponent[];
}

export interface AppComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

export type ComponentType =
  | 'text'
  | 'button'
  | 'image'
  | 'input'
  | 'list'
  | 'card'
  | 'navbar'
  | 'tabbar';

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  description: string;
  defaultProps: Record<string, any>;
}
