import { z } from "zod";
import {
  imageSchema,
  carouselSchema,
  textSectionSchema,
  callToActionSchema,
  configurationContentSchema,
} from "@/lib/validations";

export type Image = z.infer<typeof imageSchema>;
export type Carousel = z.infer<typeof carouselSchema>;
export type TextSection = z.infer<typeof textSectionSchema>;
export type CallToAction = z.infer<typeof callToActionSchema>;
export type ConfigurationContent = z.infer<typeof configurationContentSchema>;

export type DeviceSize = "small" | "large";

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type PublishStatus = "unpublished" | "publishing" | "published" | "error";