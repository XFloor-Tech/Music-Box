import { useQuery } from "@tanstack/react-query";
//
// TODO: Replace with network client
const fetchAudioFromUrl = async (url: string): Promise<ArrayBuffer> => {
  let audio: ArrayBuffer;

  try {
    const response = await fetch(url);
    audio = await response.arrayBuffer();
  } catch (error) {
    throw new Error(`Failed to fetch audio from ${url}: ${error}`);
  }

  return audio;
};

const useGetAudio = (url: string | null) =>
  useQuery({
    queryKey: ["audio", url],
    queryFn: () => (!!url ? fetchAudioFromUrl(url) : undefined),
    staleTime: Number.MAX_SAFE_INTEGER,
    enabled: !!url,
  });

export { fetchAudioFromUrl, useGetAudio };
