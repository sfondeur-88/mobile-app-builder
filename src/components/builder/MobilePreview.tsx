const MobilePreview = () => {
  return (
    <main className="flex-1 bg-gray-100 flex items-center justify-center p-8">
      <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden">
        <div className="h-full bg-white overflow-y-auto">
          <p className="text-center text-gray-400 mt-20">Mobile Preview</p>
        </div>
      </div>
    </main>
  );
}

export default MobilePreview;