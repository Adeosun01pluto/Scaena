export async function uploadImageUnsigned(fileOrBlob) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // "Scaena"
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const form = new FormData();
  form.append("file", fileOrBlob);
  form.append("upload_preset", preset);

  const res = await fetch(url, { method: "POST", body: form });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}
