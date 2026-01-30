import { Search, Bell, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 text-gray-500">
            <Menu className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                className="block w-64 rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-gray-50"
                placeholder="Search..."
            />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-500">
            <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">
            DA
        </div>
      </div>
    </header>
  );
}
