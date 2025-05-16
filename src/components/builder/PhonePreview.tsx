
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
          <div key={component.id} className="px-4 py-3 flex items-center justify-between border-b border-gray-200 bg-white">
            <div className="flex items-center">
              {component.props.showBackButton && <ChevronLeft className="h-5 w-5 mr-2 text-gray-700" />}
              <h1 className="font-semibold text-gray-800">{component.props.title}</h1>
            </div>
            {component.props.rightIcon && (
              <div>
                {component.props.rightIcon === 'menu' && <Menu className="h-5 w-5 text-gray-700" />}
                {component.props.rightIcon === 'shopping-cart' && <ShoppingCart className="h-5 w-5 text-gray-700" />}
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div key={component.id} className="px-4 py-2">
            {component.props.variant === 'h1' && (
              <h1 className="text-xl font-bold text-gray-800">{component.props.content}</h1>
            )}
            {component.props.variant === 'h2' && (
              <h2 className="text-lg font-semibold text-gray-800">{component.props.content}</h2>
            )}
            {component.props.variant === 'p' && (
              <p className="text-base text-gray-700">{component.props.content}</p>
            )}
          </div>
        );
      case 'image':
        return (
          <div key={component.id} className="px-4 py-2">
            <img 
              src={component.props.src} 
              alt={component.props.alt} 
              className="w-full rounded-md shadow-sm"
              style={{ height: `${component.props.height}px` }}
            />
          </div>
        );
      case 'button':
        return (
          <div key={component.id} className="px-4 py-2">
            <button className={`
              px-4 py-2 rounded-md w-full transition-all duration-200
              ${component.props.variant === 'primary' ? 'gradient-bg text-white shadow-sm hover:shadow-md' : ''}
              ${component.props.variant === 'secondary' ? 'border border-indigo-500 text-indigo-500 hover:bg-indigo-50' : ''}
              ${component.props.size === 'small' ? 'text-sm py-1.5' : ''}
              ${component.props.size === 'large' ? 'text-lg py-2.5' : ''}
            `}>
              {component.props.label}
            </button>
          </div>
        );
      case 'list':
        return (
          <div key={component.id} className="px-4 py-2">
            <ul className="divide-y divide-gray-200 bg-white rounded-md shadow-sm">
              {component.props.items.map((item: any) => (
                <li key={item.id} className="py-3 px-3 flex justify-between items-center hover:bg-gray-50">
                  <span className="text-gray-800">{item.title}</span>
                  {item.price && <span className="font-medium text-gray-900">{item.price}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return (
          <div key={component.id} className="px-4 py-2 border border-dashed rounded-md m-4 text-center text-gray-500 text-sm">
            {component.type} component
          </div>
        );
    }
  };

  return (
    <div className="flex justify-center items-start h-full pt-8">
      <div className={`
        w-[320px] h-[650px] bg-white rounded-[36px] relative overflow-hidden 
        ${platform === 'ios' ? 'ios-device' : 'android-device'}
        shadow-[0_24px_40px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-2
      `}>
        {/* Device Frame */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className={`
            w-full h-full rounded-[36px] border-[12px] 
            ${platform === 'ios' ? 'border-gray-800' : 'border-gray-700'}
            shadow-inner
          `}>
            {/* Notch for iOS */}
            {platform === 'ios' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-6 bg-gray-800 rounded-b-2xl z-20"></div>
            )}
          </div>
        </div>
        
        {/* Status Bar */}
        <div className={`
          h-10 relative z-0 flex justify-between items-center px-6 
          ${platform === 'ios' ? 'pt-6 bg-black text-white' : 'bg-gray-900 text-white'}
        `}>
          <span className="text-xs font-medium">{currentTime}</span>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-white opacity-80"></div>
            <div className="h-2 w-2 rounded-full bg-white opacity-90"></div>
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        </div>
        
        {/* Screen Content Area */}
        <div 
          className="flex-1 overflow-auto bg-gray-100 h-[calc(100%-10rem)]"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {activeScreen ? (
            <>
              {activeScreen.components.map(component => renderComponent(component))}
              <div className="p-4"></div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <Menu className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm">No screen selected</p>
              <p className="text-xs text-gray-400 mt-2">Select or create a screen from the sidebar</p>
            </div>
          )}
        </div>

        {/* Home Bar / Navigation */}
        <div className={`
          absolute bottom-0 left-0 right-0
          ${platform === 'ios' ? 'h-10 bg-black' : 'h-14 bg-gray-900'}
          flex justify-center items-center
        `}>
          {platform === 'ios' ? (
            <div className="w-1/3 h-1 bg-gray-200 rounded-full"></div>
          ) : (
            <div className="flex justify-center items-center gap-8">
              <div className="w-6 h-6 border-2 border-gray-500 rounded-sm"></div>
              <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-gray-500"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
