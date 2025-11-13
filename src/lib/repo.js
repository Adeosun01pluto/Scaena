import {
  collection, addDoc, doc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, serverTimestamp, getDoc
} from "firebase/firestore";
import { db } from "./firebase";

export const colRefs = {
  categories: collection(db, "categories"),
  artworks: collection(db, "artworks"),
  supplies: collection(db, "supplies"),
  users: collection(db, "users"),
};

export const subscribeAll = (setters) => {
  const unsubs = [];
  unsubs.push(onSnapshot(colRefs.categories, (s) => setters.setCategories(s.docs.map(d=>({id:d.id, ...d.data()})))));
  unsubs.push(onSnapshot(colRefs.artworks,   (s) => setters.setArtworks(s.docs.map(d=>({id:d.id, ...d.data()})))));
  unsubs.push(onSnapshot(colRefs.supplies,   (s) => setters.setSupplies(s.docs.map(d=>({id:d.id, ...d.data()})))));
  unsubs.push(onSnapshot(colRefs.users,      (s) => setters.setUsers(s.docs.map(d=>({id:d.id, ...d.data()})))));
  return () => unsubs.forEach(u=>u());
};

// --- Categories ---
export const createCategory = async ({ id, name, image }) => {
  const ref = id ? doc(db, "categories", id) : doc(colRefs.categories);
  await setDoc(ref, { name, image, createdAt: serverTimestamp() }, { merge: true });
  return ref.id;
};
export const updateCategory = async ({ id, name, image }) => {
  await updateDoc(doc(db, "categories", id), { name, image, updatedAt: serverTimestamp() });
};
export const deleteCategory = async (id) => {
  await deleteDoc(doc(db, "categories", id));
};

// --- Artworks ---
export const createArtwork = async (payload) => {
  const ref = doc(colRefs.artworks);
  await setDoc(ref, { ...payload, createdAt: serverTimestamp(), type: "Art" });
  return ref.id;
};
export const updateArtwork = async (payload) => {
  const { id, ...rest } = payload;
  await updateDoc(doc(db, "artworks", id), { ...rest, updatedAt: serverTimestamp() });
};
export const deleteArtwork = async (id) => {
  await deleteDoc(doc(db, "artworks", id));
};

// --- Supplies ---
export const createSupply = async (payload) => {
  const ref = doc(colRefs.supplies);
  await setDoc(ref, { ...payload, createdAt: serverTimestamp(), type: "Supply" });
  return ref.id;
};
export const updateSupply = async (payload) => {
  const { id, ...rest } = payload;
  await updateDoc(doc(db, "supplies", id), { ...rest, updatedAt: serverTimestamp() });
};
export const deleteSupply = async (id) => {
  await deleteDoc(doc(db, "supplies", id));
};

// --- Users (mock/admin list; tie to Firebase Auth later if desired) ---
export const createUser = async (payload) => {
  const ref = doc(colRefs.users);
  await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
  return ref.id;
};
export const updateUser = async (payload) => {
  const { id, ...rest } = payload;
  await updateDoc(doc(db, "users", id), { ...rest, updatedAt: serverTimestamp() });
};
export const deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
};















