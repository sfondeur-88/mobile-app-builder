export default function BuilderPageLoading() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 bg-gray-200 rounded" />
          <div className="h-9 w-16 bg-gray-200 rounded" />
          <div className="h-9 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* EditorSidebar */}
        <aside className="w-2/5 bg-white border-r border-gray-200 p-5">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="h-80 bg-gray-100 rounded-lg" />
              <div className="h-40 bg-gray-100 rounded-lg" />
              <div className="h-40 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </aside>

        {/* MobilePreview */}
        <main className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8">
          <div className="flex gap-4 mb-6">
            <div className="w-17 h-9 bg-gray-300 rounded-md" />
            <div className="w-17 h-9 bg-gray-300 rounded-md" />
          </div>
          <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden flex items-center justify-center">
            <p className="text-gray-400">Loading configuration...</p>
          </div>
        </main>
      </div>
    </div>
  );
}