export function AppHeader() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <h1 className="text-base font-medium text-gray-900">
          Reactiv - Mobile App Builder
        </h1>
      </div>

      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="px-3 py-1.5 text-sm border rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </form>
    </header>
  );
}