"use client"

import BuilderHeader from "@/components/builder/BuilderHeader";
import EditorSidebar from "@/components/builder/EditorSidebar";
import MobilePreview from "@/components/builder/MobilePreview";
import { useBuilderStore } from "@/lib/store";
import { ConfigWithRevision } from "@/types";
import { useEffect } from "react";

interface Props {
  initialConfig: ConfigWithRevision;
}

const BuilderClient = (props: Props) => {
  const { initialConfig } = props;

  const setSaveConfig = useBuilderStore((s) => s.setSavedConfig);
  const setIsPublished = useBuilderStore((s) => s.setIsPublished);

  useEffect(() => {
    if (initialConfig?.latestRevision) {
      setSaveConfig(initialConfig.latestRevision.content);
      setIsPublished(initialConfig.latestRevision.isPublished);
    }
  }, [initialConfig, setSaveConfig, setIsPublished]);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      <BuilderHeader />

      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar />
        <MobilePreview />
      </div>
    </div>
  );
};

export default BuilderClient;