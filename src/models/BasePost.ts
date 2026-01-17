export const BasePostFields = {
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  organization: { type: String, required: true },

  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },

  postDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  seo: {
    title: String,
    description: String,
  },
};
