
import { AppComponent, AppScreen } from "@/types/appBuilder";
import { useEffect, useState } from "react";
import { ChevronLeft, Menu, ShoppingCart } from "lucide-react";

interface PhonePreviewProps {
  activeScreen: AppScreen | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  platform: 'ios' | 'android' | 'both';
}

export default function PhonePreview({ 
  activeScreen, 
  onDragOver, 
  onDrop,
  platform 
}: PhonePreviewProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const renderComponent = (component: AppComponent) => {
    switch (component.type) {
      case 'navbar':
        return (
          <div key={component.id} className="px-4 py-3 flex items-center justify-between border-b">
            <div className="flex items-center">
              {component.props.showBackButton && <ChevronLeft className="h-5 w-5 mr-2" />}
              <h1 className="font-semibold">{component.props.title}</h1>
            </div>
            {component.props.rightIcon && (
              <div>
                {component.props.rightIcon === 'menu' && <Menu className="h-5 w-5" />}
                {component.props.rightIcon === 'shopping-cart' && <ShoppingCart className="h-5 w-5" />}
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div key={component.id} className="px-4 py-2">
            {component.props.variant === 'h1' && (
              <h1 className="text-xl font-bold">{component.props.content}</h1>
            )}
            {component.props.variant === 'h2' && (
              <h2 className="text-lg font-semibold">{component.props.content}</h2>
            )}
            {component.props.variant === 'p' && (
              <p className="text-base">{component.props.content}</p>
            )}
          </div>
        );
      case 'image':
        return (
          <div key={component.id} className="px-4 py-2">
            <img 
              src={component.props.src} 
              alt={component.props.alt} 
              className="w-full rounded-md"
              style={{ height: `${component.props.height}px` }}
            />
          </div>
        );
      case 'button':
        return (
          <div key={component.id} className="px-4 py-2">
            <button className={`
              px-4 py-2 rounded-md 
              ${component.props.variant === 'primary' ? 'bg-builder-blue-500 text-white' : ''}
              ${component.props.variant === 'secondary' ? 'border border-builder-blue-500 text-builder-blue-500' : ''}
              ${component.props.size === 'small' ? 'text-sm' : ''}
              ${component.props.size === 'large' ? 'text-lg' : ''}
            `}>
              {component.props.label}
            </button>
          </div>
        );
      case 'list':
        return (
          <div key={component.id} className="px-4 py-2">
            <ul className="divide-y">
              {component.props.items.map((item: any) => (
                <li key={item.id} className="py-3 flex justify-between items-center">
                  <span>{item.title}</span>
                  {item.price && <span className="font-medium">{item.price}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return (
          <div key={component.id} className="px-4 py-2 border border-dashed rounded-md m-4">
            {component.type} component
          </div>
        );
    }
  };

  const getStatusBarStyle = () => {
    if (platform === 'ios') {
      return 'h-6 bg-black text-white flex justify-between items-center px-4 text-xs';
    }
    return 'h-6 bg-builder-blue-600 text-white flex justify-between items-center px-4 text-xs';
  };

  return (
    <div className="flex justify-center items-start h-full">
      <div className={`
        w-72 h-[600px] bg-white rounded-[2.5rem] border-8 
        ${platform === 'ios' ? 'border-gray-800' : 'border-gray-700'}
        shadow-xl overflow-hidden flex flex-col
      `}>
        {/* Notch for iOS */}
        {platform === 'ios' && (
          <div className="h-6 bg-black text-white flex justify-between items-center px-4 text-xs relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-2xl"></div>
            <span>{currentTime}</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
          </div>
        )}
        
        {/* Status bar for Android */}
        {platform === 'android' && (
          <div className="h-6 bg-builder-blue-600 text-white flex justify-between items-center px-4 text-xs">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
          </div>
        )}
        
        {/* Screen content area */}
        <div 
          className="flex-1 overflow-auto bg-gray-50"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {activeScreen ? (
            <>
              {activeScreen.components.map(component => renderComponent(component))}
              <div className="p-4"></div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No screen selected
            </div>
          )}
        </div>

        {/* Home indicator for iOS */}
        {platform === 'ios' && (
          <div className="h-6 bg-white flex justify-center items-center">
            <div className="w-1/3 h-1 bg-black rounded-full"></div>
          </div>
        )}
        
        {/* Navigation buttons for Android */}
        {platform === 'android' && (
          <div className="h-10 bg-gray-800 flex justify-center items-center gap-8">
            <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
            <div className="w-5 h-5 border-2 border-white rounded-full"></div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}
