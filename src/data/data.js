export const categories = [
  { id: "abstractum", name: "Abstractum",
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=600" },
  { id: "animalia",   name: "Animalia",
    image: "https://images.unsplash.com/photo-1544551763-7ef038d08ccb?q=80&w=600" },
  { id: "pulchrae",   name: "Pulchrae",
    image: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=600" },
];

export const artworks = [
  { id: "art-1", name: "Ancestors", price: 150, category: "Abstractum", type: "Art",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800" },
  { id: "art-2", name: "Confluence", price: 150, category: "Abstractum", type: "Art",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800" },
  { id: "art-3", name: "Dichotomy", price: 150, category: "Pulchrae", type: "Art",
    image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146e?q=80&w=800" },
  { id: "art-4", name: "Aurora", price: 180, category: "Animalia", type: "Art",
    image: "https://images.unsplash.com/photo-1549880338-4b36c0c10d1c?q=80&w=800" },
];

export const supplies = [
  { id: "sup-1", name: "Round Natural Hair Paint Brush (12/pack)", price: 8.74, type: "Supply",
    image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=600" },
  { id: "sup-2", name: "Sketch Pad Spiral 8.5\"×11\"", price: 8.67, type: "Supply",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600" },
  { id: "sup-3", name: "Premium Sketch Pad 9\"×12\"", price: 7.34, type: "Supply",
    image: "https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?q=80&w=600" },
  { id: "sup-4", name: "Dual Tip Art Markers (36 colors)", price: 17.14, type: "Supply",
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=600" },
  { id: "sup-5", name: "Paint Brush All Purpose (15/pack)", price: 9.58, type: "Supply",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=600" },
];

// Simple mock users so the admin "Users" tab has content
export const users = [
  { id: "u-1", name: "Ava Kim", email: "ava@sena.art", role: "admin" },
  { id: "u-2", name: "Leo Park", email: "leo@sena.art", role: "editor" },
  { id: "u-3", name: "Guest Buyer", email: "guest@example.com", role: "customer" },
];
