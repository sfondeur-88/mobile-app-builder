import { Configuration, ConfigurationRevision } from "@/lib/db/schema";
import {
  callToActionSchema,
  carouselSchema,
  configurationContentSchema,
  imageSchema,
  textSectionSchema,
} from "@/lib/validations";
import { z } from "zod";

/**
 * Configuration Content Types
 * 
 * These types are inferred from Zod validation schemas.
 * Used for form validation and content structure.
 */
export type Image = z.infer<typeof imageSchema>;
export type Carousel = z.infer<typeof carouselSchema>;
export type TextSection = z.infer<typeof textSectionSchema>;
export type CallToAction = z.infer<typeof callToActionSchema>;
export type ConfigurationContent = z.infer<typeof configurationContentSchema>;
export interface ConfigWithRevision extends Configuration {
  latestRevision: ConfigurationRevision | null;
}

/**
 * UI Types
 */
export type DeviceSize = "small" | "large";
export type SaveStatus = "idle" | "success" | "error";
export type PublishStatus = "unpublished" | "publishing" | "published" | "error";

/**
 * API Response type for reuse.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}