import { Search, Bell, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#08090a]/80 backdrop-blur-xl px-8">
      <div className="flex items-center gap-6">
        <button className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-80 rounded-xl border-none py-2.5 pl-11 pr-4 text-gray-200 ring-1 ring-inset ring-white/5 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white/5 transition-all duration-300"
            placeholder="Search everything..."
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="group text-gray-400 hover:text-white transition-all duration-300 relative p-2 rounded-lg hover:bg-white/5">
          <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 ring-4 ring-[#08090a] animate-pulse"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
          <div className="flex flex-col items-end hidden lg:flex">
            <span className="text-sm font-semibold text-gray-200">Deeksha A.</span>
            <span className="text-[10px] text-gray-500">Administrator</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20 border border-white/10">
            DA
          </div>
        </div>
      </div>
    </header>
  );
}
