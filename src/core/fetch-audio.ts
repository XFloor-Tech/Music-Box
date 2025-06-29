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

export { fetchAudioFromUrl };
