import image1 from '../assets/photos/01.png';
import image2 from '../assets/photos/02.png';
import image3 from '../assets/photos/03.png';
import image4 from '../assets/photos/04.png';
import image5 from '../assets/photos/05.png';
import image6 from '../assets/photos/06.png';
import image7 from '../assets/photos/07.png';
import image8 from '../assets/photos/08.png';
import image9 from '../assets/photos/09.png';
import image10 from '../assets/photos/10.png';
import image11 from '../assets/photos/11.png';
import image12 from '../assets/photos/12.png';
import image13 from '../assets/photos/13.png';
import image14 from '../assets/photos/14.png';
import image15 from '../assets/photos/15.png';
import image16 from '../assets/photos/16.png';
import image17 from '../assets/photos/17.png';
import image18 from '../assets/photos/18.png';
import image19 from '../assets/photos/19.png';
import image20 from '../assets/photos/20.png';

export interface PhotoDescription {
  url: string;
  image?: HTMLImageElement;
}

const photos: PhotoDescription[] = [
  { url: image1 },
  { url: image2 },
  { url: image3 },
  { url: image4 },
  { url: image5 },
  { url: image6 },
  { url: image7 },
  { url: image8 },
  { url: image9 },
  { url: image10 },
  { url: image11 },
  { url: image12 },
  { url: image13 },
  { url: image14 },
  { url: image15 },
  { url: image16 },
  { url: image17 },
  { url: image18 },
  { url: image19 },
  { url: image20 }
];

export default async function photoLoader() {
  const promises = photos.map(photo => {
    return new Promise(resolve => {
      const image = new Image();
      image.src = photo.url;
      image.onload = () => {
        photo.image = image;
        resolve();
      };
    });
  });

  await Promise.all(promises);
  return photos;
}
