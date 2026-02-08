import BuilderHeader from "@/components/builder/BuilderHeader";
import EditorSidebar from "@/components/builder/EditorSidebar";
import MobilePreview from "@/components/builder/MobilePreview";

export default function BuilderPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      <BuilderHeader />

      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar />
        <MobilePreview />
      </div>
    </div>
  );
}