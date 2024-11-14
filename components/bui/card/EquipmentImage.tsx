import Image, {type StaticImageData} from 'next/image';
import React from 'react';

import images from './EquipmentImageList';

const EquipmentImage = ({imageName}: {imageName: string}) => {
  return <Image src={(images as Record<string, StaticImageData>)[imageName] ?? `/images/equipments/@0.5/${imageName}.png`}
    width={63} height={50} alt={imageName} />;
};

export default EquipmentImage;
