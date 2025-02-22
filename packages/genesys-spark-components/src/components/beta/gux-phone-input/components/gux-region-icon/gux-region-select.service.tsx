import { getAssetPath } from '@stencil/core';

const imgSrcCache: Map<string, Promise<string>> = new Map();

async function fetchImage(imgName: string): Promise<string> {
  const imgResponse = await fetch(
    getAssetPath(`./assets/region-flags/${imgName}.png`)
  );

  if (imgResponse.status === 200) {
    return imgResponse.url;
  }

  throw new Error(
    `[gux-region-select] fetching failed for icon "${imgName}" with status "${imgResponse.statusText} (${imgResponse.status})".`
  );
}

export async function getImgSource(imgName: string): Promise<string> {
  const cachedImageSrc = await imgSrcCache.get(imgName);

  if (cachedImageSrc) {
    return cachedImageSrc;
  }

  const imgSrcUrl = fetchImage(imgName)
    .then(imgSrc => imgSrc)
    .catch(err => {
      setTimeout(() => {
        throw err;
      }, 0);

      return '';
    });

  imgSrcCache.set(imgName, imgSrcUrl);

  return imgSrcUrl;
}
