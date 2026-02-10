import { boolean, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Configuration table.
 * The main configuration entity.
 */
export const configurations = pgTable("configurations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/**
 * Configuration revisions table.
 * Stores every saved version.
 */
export const configurationRevisions = pgTable("configuration_revisions", {
  id: serial("id").primaryKey(),
  configurationId: serial("configuration_id")
    .notNull()
    .references(() => configurations.id, { onDelete: "cascade" }),
  revisionNumber: serial("revision_number").notNull(),
  content: jsonb("content").$type<ConfigurationContent>().notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

import type { ConfigurationContent } from "@/types";

export type Configuration = typeof configurations.$inferSelect;
export type NewConfiguration = typeof configurations.$inferInsert;
export type ConfigurationRevision = typeof configurationRevisions.$inferSelect;
export type NewConfigurationRevision = typeof configurationRevisions.$inferInsert;