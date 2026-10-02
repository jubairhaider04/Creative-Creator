import { Project } from "../types";
import { 
  subscribeToPortfolioFirestore, 
  getCachedPortfolio, 
  saveProjectFirestore, 
  deleteProjectFirestore, 
  togglePublishProjectFirestore, 
  toggleFeatureProjectFirestore, 
  updateProjectSortOrderFirestore,
  uploadPortfolioImage
} from "../lib/firebase";

export const portfolioService = {
  // Real-time Firestore subscription with IndexedDB offline persistence
  subscribe: subscribeToPortfolioFirestore,
  getCached: getCachedPortfolio,

  // REST API: Get all published projects (or all for admin)
  async getAll(options?: { category?: string; search?: string; all?: boolean }): Promise<Project[]> {
    try {
      const params = new URLSearchParams();
      if (options?.category) params.append("category", options.category);
      if (options?.search) params.append("search", options.search);
      if (options?.all) params.append("all", "true");

      const res = await fetch(`/api/portfolio?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.projects || [];
      }
    } catch (err) {
      console.warn("Portfolio API fetch failed, falling back to local cache/offline:", err);
    }
    // Offline fallback
    return await getCachedPortfolio();
  },

  // REST API: Get featured project
  async getFeatured(): Promise<Project | null> {
    try {
      const res = await fetch("/api/portfolio/featured");
      if (res.ok) {
        const data = await res.json();
        return data.project || null;
      }
    } catch (err) {
      console.warn("Portfolio featured API fetch failed:", err);
    }
    const cached = await getCachedPortfolio();
    return cached.find(p => p.featured && p.isPublished !== false) || cached[0] || null;
  },

  // REST API: Get project by slug or ID
  async getBySlug(slug: string): Promise<Project | null> {
    try {
      const res = await fetch(`/api/portfolio/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        return data.project || null;
      }
    } catch (err) {
      console.warn("Portfolio getBySlug API fetch failed:", err);
    }
    const cached = await getCachedPortfolio();
    return cached.find(p => p.slug === slug || p.id === slug) || null;
  },

  // Save / Update project in Firestore & backend
  async save(project: Project): Promise<void> {
    // Save to Firestore
    await saveProjectFirestore(project);

    // Also notify server backend
    try {
      await fetch(`/api/portfolio/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project)
      });
    } catch {
      // Offline fallback
    }
  },

  // Delete / Archive project
  async delete(id: string): Promise<void> {
    await deleteProjectFirestore(id);
    try {
      await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    } catch {
      // Offline
    }
  },

  // Toggle publish
  async togglePublish(id: string, isPublished: boolean): Promise<void> {
    await togglePublishProjectFirestore(id, isPublished);
    try {
      await fetch(`/api/portfolio/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished })
      });
    } catch {
      // Offline
    }
  },

  // Toggle feature
  async toggleFeature(id: string, featured: boolean): Promise<void> {
    await toggleFeatureProjectFirestore(id, featured);
    try {
      await fetch(`/api/portfolio/${id}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured })
      });
    } catch {
      // Offline
    }
  },

  // Update order
  async updateSortOrder(id: string, sortOrder: number): Promise<void> {
    await updateProjectSortOrderFirestore(id, sortOrder);
  },

  // Upload image to Firebase Storage
  async uploadImage(file: File, portfolioId: string, type: "thumbnail" | "hero" | "gallery"): Promise<string> {
    return await uploadPortfolioImage(file, portfolioId, type);
  }
};
