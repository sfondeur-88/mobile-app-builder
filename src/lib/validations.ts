import { z } from "zod";

// Image schema for carousel
export const imageSchema = z.object({
  id: z.string(),
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional(),
  order: z.number().int().min(0),
});

export const carouselSchema = z.object({
  images: z.array(imageSchema).min(0).max(10, "Maximum 10 images allowed"),
});

export const textSectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  titleColour: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex colour"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  descriptionColour: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex colour"),
});

export const callToActionSchema = z.object({
  label: z.string().min(1, "Button label is required").max(50, "Label too long"),
  url: z.string().url("Invalid URL"),
  backgroundColour: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex colour"),
  textColour: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex colour"),
});

// Configuration schemas
export const configurationContentSchema = z.object({
  carousel: carouselSchema,
  textSection: textSectionSchema,
  callToAction: callToActionSchema,
});

// API request schemas
export const createConfigurationSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  content: configurationContentSchema,
});

export const updateConfigurationSchema = z.object({
  content: configurationContentSchema,
});