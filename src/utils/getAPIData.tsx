export const getAPIData = async ({ uri }: { uri: string }) => {
  try {
    const res = await fetch(uri, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Error found while fetching");
    }
    return await res.json();
  } catch (error) {
    console.log("Error loading data", error);
  }
};
