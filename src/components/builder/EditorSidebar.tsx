const EditorSidebar = () => {
  return (
    <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto p-6">
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Components
        </h2>
        <div className="space-y-3">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">Carousel Editor</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">Text Section Editor</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">Call to Action Editor</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;