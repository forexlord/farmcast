import { UploadZone } from "@/components/field-scan/upload-zone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { uploadConfig } from "@/data/field-scan";

type ImageryUploadProps = {
  status: "idle" | "processing" | "complete" | "error";
  statusMessage?: string;
  fileName?: string;
  onFileSelect: (file: File) => void;
  onAnalyze: () => void;
  disabled?: boolean;
};

export function ImageryUpload({
  status,
  statusMessage,
  fileName,
  onFileSelect,
  onAnalyze,
  disabled,
}: ImageryUploadProps) {
  return (
    <Card variant="elevated" className="p-stack-lg">
      <h2 className="text-label-md text-primary uppercase tracking-widest mb-stack-md">
        Imagery Upload
      </h2>
      <UploadZone
        icon={uploadConfig.icon}
        browseLabel={uploadConfig.browseLabel}
        hint={uploadConfig.hint}
        status={status}
        statusMessage={statusMessage}
        fileName={fileName}
        onFileSelect={onFileSelect}
      />
      <Button
        className="w-full mt-stack-lg py-4 uppercase tracking-wider shadow-lg shadow-primary/20 gap-2"
        onClick={onAnalyze}
        disabled={disabled || status === "processing"}
      >
        <Icon name="analytics" size="sm" />
        {uploadConfig.analyzeLabel}
      </Button>
    </Card>
  );
}
