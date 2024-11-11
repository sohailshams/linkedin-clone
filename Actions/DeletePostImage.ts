export default async function (imageId: string | null) {
  const response = await fetch("../api/cloudinary", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId }),
  });

  const data = await response.json();
  return data;
}
