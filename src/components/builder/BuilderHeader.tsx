const BuilderHeader = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-neutral-900 font-semibold">
        Home Screen
      </h2>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          Details
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          Save
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
          Preview
        </button>
        <button className="px-6 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md">
          Publish
        </button>
      </div>
    </div>
  );
};

export default BuilderHeader;