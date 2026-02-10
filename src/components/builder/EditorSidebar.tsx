import CallToActionEditor from "../editor/CallToActionEditor";
import CarouselEditor from "../editor/CarouselEditor";
import TextSectionEditor from "../editor/TextSectionEditor";

const EditorSidebar = () => {
  return (
    <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto p-6">
      <div className="flex flex-col gap-8">
        <CarouselEditor />
        <TextSectionEditor />
        <CallToActionEditor />
      </div>
    </aside>
  );
};

export default EditorSidebar;