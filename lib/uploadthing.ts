import { generateReactHelpers, generateUploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
// export const { useUploadThing, uploadFiles } =
//   generateReactHelpers<OurFileRouter>();
