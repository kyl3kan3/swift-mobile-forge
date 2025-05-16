
import { AppProject, ComponentDefinition } from "@/types/appBuilder";

export const mockProjects: AppProject[] = [
  {
    id: "1",
    name: "My First App",
    description: "A simple e-commerce app",
    createdAt: "2025-05-10T10:30:00Z",
    updatedAt: "2025-05-15T15:45:00Z",
    template: "ecommerce",
    icon: "shopping-bag",
    screens: [
      {
        id: "screen-1",
        name: "Home",
        components: [
          {
            id: "comp-1",
            type: "navbar",
            props: {
              title: "My Store",
              showBackButton: false,
              rightIcon: "shopping-cart"
            }
          },
          {
            id: "comp-2",
            type: "image",
            props: {
              src: "https://via.placeholder.com/800x400?text=Featured+Products",
              alt: "Featured Products",
              height: 200
            }
          },
          {
            id: "comp-3",
            type: "text",
            props: {
              content: "Welcome to My Store",
              variant: "h1"
            }
          }
        ]
      },
      {
        id: "screen-2",
        name: "Products",
        components: [
          {
            id: "comp-4",
            type: "navbar",
            props: {
              title: "Products",
              showBackButton: true
            }
          },
          {
            id: "comp-5",
            type: "list",
            props: {
              items: [
                { id: "1", title: "Product 1", price: "$19.99" },
                { id: "2", title: "Product 2", price: "$29.99" },
                { id: "3", title: "Product 3", price: "$39.99" }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Fitness Tracker",
    description: "Track your workouts and progress",
    createdAt: "2025-05-05T08:20:00Z",
    updatedAt: "2025-05-13T09:15:00Z",
    template: "blank",
    icon: "activity",
    screens: [
      {
        id: "screen-1",
        name: "Dashboard",
        components: []
      }
    ]
  },
  {
    id: "3",
    name: "Recipe Book",
    description: "Store and share your favorite recipes",
    createdAt: "2025-05-01T14:10:00Z",
    updatedAt: "2025-05-11T11:30:00Z",
    template: "blog",
    icon: "book-open",
    screens: [
      {
        id: "screen-1",
        name: "Home",
        components: []
      }
    ]
  }
];

export const componentLibrary: ComponentDefinition[] = [
  {
    type: "text",
    label: "Text",
    icon: "text",
    description: "Display text content",
    defaultProps: {
      content: "Text content",
      variant: "p",
      align: "left"
    }
  },
  {
    type: "button",
    label: "Button",
    icon: "square",
    description: "Interactive button element",
    defaultProps: {
      label: "Button",
      variant: "primary",
      size: "medium"
    }
  },
  {
    type: "image",
    label: "Image",
    icon: "image",
    description: "Display images",
    defaultProps: {
      src: "https://via.placeholder.com/400x200",
      alt: "Image description",
      width: "100%",
      height: "auto"
    }
  },
  {
    type: "input",
    label: "Input Field",
    icon: "input",
    description: "Text input field",
    defaultProps: {
      placeholder: "Enter text here",
      label: "Label",
      type: "text"
    }
  },
  {
    type: "list",
    label: "List",
    icon: "list",
    description: "Display a list of items",
    defaultProps: {
      items: [
        { id: "1", title: "Item 1" },
        { id: "2", title: "Item 2" },
        { id: "3", title: "Item 3" }
      ]
    }
  },
  {
    type: "card",
    label: "Card",
    icon: "square",
    description: "Container with a card-like appearance",
    defaultProps: {
      title: "Card Title",
      content: "Card content goes here",
      footer: "Card Footer"
    }
  },
  {
    type: "navbar",
    label: "Navigation Bar",
    icon: "navigation",
    description: "App navigation bar",
    defaultProps: {
      title: "App Title",
      showBackButton: false,
      rightIcon: "menu"
    }
  },
  {
    type: "tabbar",
    label: "Tab Bar",
    icon: "layout",
    description: "Bottom tab navigation",
    defaultProps: {
      tabs: [
        { icon: "home", label: "Home" },
        { icon: "search", label: "Search" },
        { icon: "user", label: "Profile" }
      ]
    }
  }
];

export const appTemplates = [
  {
    id: "blank",
    name: "Blank App",
    description: "Start with a clean slate",
    icon: "file",
    preview: "https://via.placeholder.com/300x600?text=Blank+App"
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    description: "Build an online store app",
    icon: "shopping-bag",
    preview: "https://via.placeholder.com/300x600?text=E-Commerce+App"
  },
  {
    id: "social",
    name: "Social Network",
    description: "Create a social media app",
    icon: "users",
    preview: "https://via.placeholder.com/300x600?text=Social+App"
  },
  {
    id: "blog",
    name: "Blog/News",
    description: "Publish content and news",
    icon: "book-open",
    preview: "https://via.placeholder.com/300x600?text=Blog+App"
  },
  {
    id: "business",
    name: "Business",
    description: "Showcase your business",
    icon: "briefcase",
    preview: "https://via.placeholder.com/300x600?text=Business+App"
  }
];
