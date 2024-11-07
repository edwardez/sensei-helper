import Image from 'next/image';
import React from 'react';

const EquipmentImage = ({imageName}: {imageName: string}) => {
  return <Image src={`/images/equipments/@0.5/${imageName}.png`}
    width={63} height={50} alt={imageName}
    style={{maxWidth: '100%', height: 'auto'}} />;
};

export default EquipmentImage;
