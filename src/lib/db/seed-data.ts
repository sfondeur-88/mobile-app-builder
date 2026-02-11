import { ConfigurationContent } from "@/types";
import { db } from "./index";
import { configurationRevisions, configurations } from "./schema";

const sampleContent: ConfigurationContent = {
  carousel: {
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
        alt: "Store front",
        order: 0,
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1445205170230-053b83016050",
        alt: "Fashion collection",
        order: 1,
      },
    ],
  },
  textSection: {
    title: "Welcome to Our Store",
    titleColour: "#1A1A1A",
    description: "Discover amazing products curated just for you",
    descriptionColour: "#666666",
  },
  callToAction: {
    label: "Shop Now",
    url: "https://example.com/shop",
    backgroundColour: "#000000",
    textColour: "#FFFFFF",
  },
};

export async function seed() {
  console.log("🌱 Seeding database...");

  // Create a sample config
  const [config] = await db
    .insert(configurations)
    .values({
      name: "Default Home Screen",
      isPublished: true,
      publishedAt: new Date(),
    })
    .returning();

  // Create initial revision
  await db.insert(configurationRevisions).values({
    configurationId: config.id,
    revisionNumber: 1,
    content: sampleContent,
    isPublished: true,
  });

  console.log("✅ Database seeded successfully!");
  console.log(`Created configuration: ${config.name} (ID: ${config.id})`);
}

// Run seed if called directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Seed failed:", error);
      process.exit(1);
    });
}