import CallToActionEditor from "../editor/CallToActionEditor";
import CarouselEditor from "../editor/CarouselEditor";
import TextSectionEditor from "../editor/TextSectionEditor";

const EditorSidebar = () => {
  return (
    <aside className="w-2/5 bg-white border-r border-gray-200 overflow-y-auto p-5">
      <div className="flex flex-col gap-10">
        <div className="outline-2 outline-gray-200 bg-[#EEEEEE] rounded p-4">
          <CarouselEditor />
        </div>
        <div className="outline-2 outline-gray-200 bg-[#EEEEEE] rounded p-4">
          <TextSectionEditor />
        </div>
        <div className="outline-2 outline-gray-200 bg-[#EEEEEE] rounded p-4">
          <CallToActionEditor />
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;