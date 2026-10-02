import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Star, 
  Upload, 
  Check, 
  X, 
  Image as ImageIcon, 
  Video, 
  ExternalLink,
  MoveUp,
  MoveDown,
  Layers,
  Search,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Project, ProjectGalleryItem, ProjectResultMetric } from "../types";
import { portfolioService } from "../services/portfolioService";

interface AdminPortfolioManagerProps {
  projects: Project[];
  onRefresh: () => void;
  showNotice: (msg: string) => void;
}

export const AdminPortfolioManager: React.FC<AdminPortfolioManagerProps> = ({
  projects,
  onRefresh,
  showNotice
}) => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [clientName, setClientName] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [featured, setFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [gallery, setGallery] = useState<ProjectGalleryItem[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [servicesInput, setServicesInput] = useState("");
  const [technologiesInput, setTechnologiesInput] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState<ProjectResultMetric[]>([
    { label: "Conversion Uplift", value: "+180%" }
  ]);
  const [tagsInput, setTagsInput] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(projects.length + 1);

  // Auto-generate slug when title changes in create mode
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingProjectId) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  };

  const openCreateModal = () => {
    setEditingProjectId(null);
    setTitle("");
    setSlug("");
    setSubtitle("");
    setDescription("");
    setCategory("Web Development");
    setClientName("");
    setYear(new Date().getFullYear());
    setFeatured(false);
    setIsPublished(true);
    setThumbnailUrl("");
    setHeroImageUrl("");
    setGallery([]);
    setVideoUrl("");
    setLiveUrl("");
    setServicesInput("Web Development");
    setTechnologiesInput("React, Tailwind CSS, TypeScript");
    setChallenge("");
    setSolution("");
    setResults([{ label: "Conversion Uplift", value: "+180%" }]);
    setTagsInput("");
    setSortOrder(projects.length + 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProjectId(p.id);
    setTitle(p.title);
    setSlug(p.slug || p.id);
    setSubtitle(p.subtitle || "");
    setDescription(p.description || "");
    setCategory(p.category || "Web Development");
    setClientName(p.clientName || p.client || "");
    setYear(typeof p.year === "number" ? p.year : parseInt(String(p.year), 10) || 2025);
    setFeatured(Boolean(p.featured));
    setIsPublished(p.isPublished !== false);
    setThumbnailUrl(p.thumbnailUrl || p.thumbnail || "");
    setHeroImageUrl(p.heroImageUrl || p.thumbnailUrl || p.thumbnail || "");
    setGallery(p.gallery || (p.galleryImages || []).map(url => ({ url, caption: p.title })));
    setVideoUrl(p.videoUrl || p.videoPreviewUrl || "");
    setLiveUrl(p.liveUrl || "");
    setServicesInput((p.services || [p.category]).join(", "));
    setTechnologiesInput((p.technologies || p.techStack || []).join(", "));
    setChallenge(p.challenge || "");
    setSolution(p.solution || "");
    setResults(p.results || p.metrics || [{ label: "Efficiency", value: "+120%" }]);
    setTagsInput((p.tags || []).join(", "));
    setSortOrder(p.sortOrder ?? 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Upload file to Firebase Storage
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: "thumbnail" | "hero" | "gallery"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(type);
    try {
      const tempId = editingProjectId || `proj-${Date.now()}`;
      const downloadUrl = await portfolioService.uploadImage(file, tempId, type);

      if (type === "thumbnail") {
        setThumbnailUrl(downloadUrl);
        if (!heroImageUrl) setHeroImageUrl(downloadUrl);
      } else if (type === "hero") {
        setHeroImageUrl(downloadUrl);
      } else if (type === "gallery") {
        setGallery(prev => [...prev, { url: downloadUrl, caption: `${title} Showcase` }]);
      }
      showNotice(`${type} uploaded successfully to Firebase Storage!`);
    } catch (err: any) {
      console.error("Storage upload error:", err);
      setFormError(err.message || "Failed to upload image. Please check file format and size.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleAddResultMetric = () => {
    setResults(prev => [...prev, { label: "New Metric", value: "100%" }]);
  };

  const handleRemoveResultMetric = (index: number) => {
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateResultMetric = (index: number, field: "label" | "value", val: string) => {
    setResults(prev => prev.map((r, i) => i === index ? { ...r, [field]: val } : r));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  // Submit project form
  const handleSubmit = async (publishState: boolean) => {
    if (!title.trim()) {
      setFormError("Project Title is required.");
      return;
    }
    if (!thumbnailUrl.trim()) {
      setFormError("A Thumbnail Image URL or Upload is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const projectPayload: Project = {
      id: editingProjectId || `proj-${Date.now()}`,
      title: title.trim(),
      slug: (slug || title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      subtitle: subtitle.trim(),
      description: description.trim() || subtitle.trim(),
      category: category.trim(),
      clientName: clientName.trim() || "Bongio Partner",
      client: clientName.trim() || "Bongio Partner",
      year,
      featured,
      isPublished: publishState,
      thumbnailUrl: thumbnailUrl.trim(),
      thumbnail: thumbnailUrl.trim(),
      heroImageUrl: heroImageUrl.trim() || thumbnailUrl.trim(),
      gallery,
      galleryImages: gallery.map(g => g.url),
      videoUrl: videoUrl.trim(),
      videoPreviewUrl: videoUrl.trim(),
      liveUrl: liveUrl.trim(),
      services: servicesInput.split(",").map(s => s.trim()).filter(Boolean),
      technologies: technologiesInput.split(",").map(t => t.trim()).filter(Boolean),
      techStack: technologiesInput.split(",").map(t => t.trim()).filter(Boolean),
      challenge: challenge.trim(),
      solution: solution.trim(),
      results: results.filter(r => r.label && r.value),
      metrics: results.filter(r => r.label && r.value),
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      sortOrder: Number(sortOrder) || 1,
      updatedAt: new Date().toISOString(),
      createdAt: editingProjectId ? (projects.find(p => p.id === editingProjectId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    try {
      await portfolioService.save(projectPayload);
      showNotice(editingProjectId ? "Project updated successfully!" : "New project published to portfolio!");
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error("Save project error:", err);
      setFormError(err.message || "Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the portfolio?`)) return;
    try {
      await portfolioService.delete(id);
      showNotice(`Project "${name}" deleted.`);
      onRefresh();
    } catch (err) {
      console.error("Delete project error:", err);
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await portfolioService.togglePublish(id, !current);
      showNotice(!current ? "Project published to live site!" : "Project converted to draft.");
      onRefresh();
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  };

  const handleToggleFeature = async (id: string, current: boolean) => {
    try {
      await portfolioService.toggleFeature(id, !current);
      showNotice(!current ? "Project featured on homepage!" : "Project unfeatured.");
      onRefresh();
    } catch (err) {
      console.error("Toggle feature error:", err);
    }
  };

  const filtered = projects.filter(p => {
    const matchesCat = filterCategory === "All" || p.category === filterCategory;
    if (!matchesCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.clientName?.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  }).sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Portfolio & Work Management</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-500/30">
              {projects.length} Total
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Create, edit, feature, and publish interactive case studies displayed on the homepage #work section and /work route.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, client, or category..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["All", "AI Automation", "Web Development", "Graphic Design", "Video", "Motion Graphics", "Digital Marketing"].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors ${
                filterCategory === cat ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / Grid */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500 space-y-2">
            <p>No projects match current filters.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="text-blue-400 underline font-semibold"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 font-mono text-[10px] uppercase border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-400">
                      #{p.sortOrder ?? 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnailUrl || p.thumbnail}
                          alt=""
                          className="w-12 h-9 object-cover rounded-lg border border-zinc-800 bg-zinc-950 flex-shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="font-bold text-white block truncate">{p.title}</span>
                          <span className="text-[10px] text-zinc-500 font-mono truncate block">
                            {p.clientName || p.client} {p.slug && `• /work/${p.slug}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-400">
                      {p.year}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(p.id, Boolean(p.featured))}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          p.featured
                            ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                            : "text-zinc-500 hover:text-zinc-300 bg-zinc-900"
                        }`}
                        title="Toggle featured on homepage"
                      >
                        <Star className={`w-3 h-3 ${p.featured ? "fill-amber-400 text-amber-400" : ""}`} />
                        <span>{p.featured ? "Featured" : "Standard"}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(p.id, p.isPublished !== false)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                          p.isPublished !== false
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                            : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                        }`}
                        title="Toggle live visibility"
                      >
                        {p.isPublished !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.isPublished !== false ? "Published" : "Draft"}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                          title="Edit project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.title)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT PROJECT MODAL FORM                           */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingProjectId ? "Edit Portfolio Project" : "Create New Portfolio Project"}
                </h3>
                <p className="text-xs text-zinc-400">
                  Fill in project specifications, visual assets, and metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              
              {/* Row 1: Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Bongio AI Automation"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. bongio-ai-automation"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Row 2: Category, Client, Year, Sort Order */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-2 text-white outline-none"
                  >
                    <option value="AI Automation">AI Automation</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Video">Video</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Content Creation">Content Creation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Client Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Kroma Tech (San Francisco)"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Release Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10) || 2025)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Subtitle & Description */}
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Subtitle / Focus Area</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. High-Frequency Asset Management & WebGL Trading Dashboard"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Short Narrative Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Automate. Create. Scale. AI-powered social media automation for modern brands..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              {/* Row 4: Thumbnail & Hero Image (Firebase Storage Upload + URL input) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                {/* Thumbnail */}
                <div className="space-y-2">
                  <label className="block text-zinc-300 font-semibold">Thumbnail Card Image *</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://... or upload below"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 cursor-pointer text-zinc-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === "thumbnail" ? "Uploading to Storage..." : "Upload Thumbnail (Storage)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "thumbnail")}
                      className="hidden"
                    />
                  </label>
                  {thumbnailUrl && (
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="h-20 w-auto rounded-lg object-cover border border-zinc-700" />
                  )}
                </div>

                {/* Hero Cover */}
                <div className="space-y-2">
                  <label className="block text-zinc-300 font-semibold">Hero Cinematic Image</label>
                  <input
                    type="url"
                    value={heroImageUrl}
                    onChange={(e) => setHeroImageUrl(e.target.value)}
                    placeholder="https://... or upload below"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <label className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 cursor-pointer text-zinc-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingField === "hero" ? "Uploading to Storage..." : "Upload Hero Cover (Storage)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "hero")}
                      className="hidden"
                    />
                  </label>
                  {heroImageUrl && (
                    <img src={heroImageUrl} alt="Hero preview" className="h-20 w-auto rounded-lg object-cover border border-zinc-700" />
                  )}
                </div>
              </div>

              {/* Row 5: Video & Live Deployment URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Video URL (MP4 / WebM / YouTube / Vimeo)</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://... (mixkit.co, youtube.com, vimeo.com)"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Live Project Website URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://client-preview.example.com"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Row 6: Services & Technologies Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Services Provided (comma-separated)</label>
                  <input
                    type="text"
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    placeholder="AI Automation, Social Media Strategy, Analytics"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Technologies & Tools (comma-separated)</label>
                  <input
                    type="text"
                    value={technologiesInput}
                    onChange={(e) => setTechnologiesInput(e.target.value)}
                    placeholder="React 19, Google GenAI, Tailwind CSS, n8n"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Row 7: Challenge & Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">The Challenge</label>
                  <textarea
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    rows={3}
                    placeholder="Initial client problem or market hurdle..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Our Solution</label>
                  <textarea
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    rows={3}
                    placeholder="The architecture, design system, and technical delivery..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Row 8: Results & Metrics Badges */}
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-semibold">Results & Impact Metrics</label>
                  <button
                    type="button"
                    onClick={handleAddResultMetric}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {results.map((res, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={res.value}
                        onChange={(e) => handleUpdateResultMetric(i, "value", e.target.value)}
                        placeholder="Value (e.g. +312%)"
                        className="w-1/3 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-white font-mono"
                      />
                      <input
                        type="text"
                        value={res.label}
                        onChange={(e) => handleUpdateResultMetric(i, "label", e.target.value)}
                        placeholder="Metric Label (e.g. Conversion Lift)"
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveResultMetric(i)}
                        className="p-1.5 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 9: Gallery Uploads */}
              <div className="space-y-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-semibold">Project Gallery Images ({gallery.length})</label>
                  <label className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "gallery")}
                      className="hidden"
                    />
                  </label>
                </div>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                    {gallery.map((g, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-zinc-700 aspect-video">
                        <img src={g.url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="absolute top-1 right-1 p-1 bg-black/80 rounded-md text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 10: Toggles (Featured & Published) */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Feature on Homepage Hero Section</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Publish to Public Visitors Immediately</span>
                </label>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(true)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProjectId ? "Update Project" : "Publish Project"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
