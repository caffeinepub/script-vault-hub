# Specification

## Summary
**Goal:** Restore the display of scripts on the Home page and My Scripts page by fixing data-fetching hooks and backend endpoints.

**Planned changes:**
- Fix the Home page to correctly fetch and display all publicly available scripts, showing title, description, category, author, and creation date per script card, with loading skeletons and empty state handling.
- Fix the My Scripts page to correctly fetch and display all scripts belonging to the authenticated user, with working edit (pre-populated dialog) and delete (confirmation dialog) functionality.
- Audit and fix React Query hooks in `useQueries.ts` to ensure script-fetching queries are correctly wired to backend actor methods, with proper query keys, data transformations, and no silent failures.
- Verify and fix the backend `main.mo` actor to expose correct public endpoints for listing all scripts and user-specific scripts, ensuring persisted scripts are accessible and not filtered out.

**User-visible outcome:** Users can see all scripts on the Home page and manage their own scripts on the My Scripts page without data being missing or silently failing.
