
import { User, Bell, School } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200/50 px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl">
              <School className="h-6 w-6" />
            </div>
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-400 w-3 h-3 rounded-full shadow-lg"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              AdmitAI Pro
            </h1>
            <p className="text-sm text-slate-600 font-medium">Enrollment Management Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-xl">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
              5
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-xl">
            <User className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
