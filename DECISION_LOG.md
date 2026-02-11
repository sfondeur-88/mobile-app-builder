# Decision Log

## How I Used AI

I used Claude Pro (Sonnet 4.5) throughout the project as a collaborative coding partner, primarily for:

### API Architecture & Planning:

- Designed the initial API structure and endpoint organization
- Received guidance on error handling patterns and HTTP statuses
- Discussed REST route design for versioning endpoints
- Discussed tradeoffs between different approaches (single vs multi-config, URL routing patterns, data fetching strategies)
- Validated architectural decisions before committing to implementations

### Technical Learning:

This project was an opportunity to learn several technologies I hadn't used in production:

- Drizzle ORM: First time using it - Claude helped with schema design, migrations, and query patterns
- iron-session: Needed guidance on session configuration and secure cookie handling in Next.js 16
- Zustand: I use it in my current React Native work, but hadn't set it up from scratch - learned proper store architecture and selector patterns
- dnd-kit: Implemented this with some help from this YT video: `https://www.youtube.com/watch?v=DVqVQwg_6_4` and had some help from Claude to fill some of the gaps

### Debugging & Problem Solving:

- Resolved Next.js 16 middleware rename (middleware.ts to proxy.ts)
- Fixed routing issues with dynamic [id] params and async params handling
- Debugged database connection problems during SQLlite to PostgreSQL migration

### Design Decisions:

- Reusable Modals instead of confirm()/browser dialogs
- Colour picker enhancements to provide an optional HEX field
- Device toggling visual hierarchy
  - Originally the suggested styling for the Buttons were too close to the primary Publish action button, which made it "compete" with the hierarchy
- Empty states for /builder/new page with a clear call to action instead of auto-creating configs (mentioned in the "Rejected Approaches" further down)

## What I Changed or Rejected

### API Route Architecture (Major Refactor):

Initially attempted to call API routes directly from Server Components using fetch('http://localhost:3000/api/...'). This created several issues:

- Hard-coded localhost URLs that wouldn't work in production
- Circular dependency issues during build

**Solution:** Created a data access layer in /lib/api with reusable database functions (getConfigurationById, saveConfiguration, etc.) that are:

- Called directly by Server Components (no HTTP)
- Reused by API Routes for client-side mutations

### Rejected Approaches:

Auto-creating configs on first visit:

- Felt too "magical/automatic" and probably a little confusing for the user
- Instead implemented proper empty state UI with a "Create Home Screen" action

Single Configuration Model:

- Implemented single-config-per-user model focused on the home screen use case, but designed routing to technically support multiple configs in the future using the `/builder/[id]` and `/builder/new` routes
- The revisions system already supports experimenting with different layouts via save/restore. Multiple configs would add complexity without a huge product benefit for the current scope. Some of the tradeoffs:
  - Simpler UX for the home screen use case
  - Fewer edge cases to handle
  - Architecture supports multi-config without major refactoring
  - No config naming/organization UI (besides Dates)

## Key Technical Tradeoffs

**Migrated to PostgreSQL with Docker after initially setting up with SQLlite:**

Started with SQLite for simplicity but encountered async/await issues with the better-sqlite3 library, which only supports synchronous operations out of the box. Async wrappers felt like workarounds, that i wouldn't want to do in production. Some of the tradeoffs would be:

- More production-aligned
- Supports async
- Requires Docker (small setup complexity)
- Slightly heavier local development environment

**Zustand Performance Optimization:**

Initial implementation computed `hasUnsavedChanges` on every state update by running JSON.stringify() comparisons:

```
setDraftConfig: (config) => {
  set({
    draftConfig: config,
    hasUnsavedChanges: JSON.stringify(config) !== JSON.stringify(savedConfig)
  });
}
```

This caused noticeable UI lag on hover states and input focusing because every keystroke triggered a state update, full JSON comparisons along with the re-renders. I refactored to a getter function so now JSON.stringify() only runs when the value is actually read, not on every editor keystroke. And the lag was completely resolved!

## What I Would Improve with More Time

**UI Components:**
Started noticing repeated UI patterns that would benefit from splitting out:

- Button Component
  - Three variants (primary, secondary, danger) used throughout - would create `<Button variant="primary">` with consistent styling
- Icon System
  - Currently using inline SVGs suggested via Claude - would create custom components or just integrate a library like lucide-react
- Form Inputs
  - Repeated input styling across editors - would create `<Input>` and `<Label>` reusables
- Cards
  - Mostly for the EditorSidebar sections (Carousel, Text, CTA/Button)

**Database Schema Clarity:**

This tripped me up twice during implementation

- The dual `isPublished` columns caused confusion during development:
- `configurations.isPublished` to "Has this config been published?"
- `configurationRevisions.isPublished` to "Is this specific revision currently active?"
- Would rename `configurations.isPublished` to `hasPublishedRevisions` or `isActive`

**Revision Naming**

- Currently revisions are identified by number and Dates. In production, users would benefit from a name field with some description like "Black Friday Promo"

**Additional Polish:**

- Loading spinners (currently just text states)
- Confirmation when leaving page with unsaved changes
- Snackbar/Pop-ups when Publishing/Saving to clean up the text statuses within BuilderHeader
- Reusable emptyConfiguration object (share with creating new configs and seed-data.ts)
- Using Nextjs Image component instead of `<img/>` elements for some optimization
