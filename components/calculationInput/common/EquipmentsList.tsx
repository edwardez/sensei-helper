import styles from 'components/calculationInput/common/EquipmentsList.module.scss';
import {Equipment} from 'model/Equipment';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {memo} from 'react';

const EquipmentCardMemo = memo(EquipmentCard);

type EquipmentGroup = {label?: string, equipments: Equipment[]};

export const EquipmentsList = ({
  selectedEquipId: selectedEquipId,
  equipments,
  onClick,
}: {
    selectedEquipId: string | null,
    equipments: (Equipment | EquipmentGroup)[],
    onClick: (id: string) => void,
}) => {
  let anythingRendered = false;
  const createCard = (equip: Equipment) => {
    anythingRendered ||= true;
    return <div className={styles.card}>
      <EquipmentCardMemo key={equip.id}
        imageName={equip.icon} onClick={() => onClick(equip.id)}
        isSelected={selectedEquipId === equip.id}/>
    </div>;
  };
  return <div className={styles.container}>
    {equipments.map((equip) => {
      return 'id' in equip ? createCard(equip) :
        <>
          <div className={styles.divider}><BuiLinedText>
            {equip.label}
          </BuiLinedText></div>
          {equip.equipments.map(createCard)}
        </>;
    })}
    {anythingRendered || <>フィルタ結果が空です</>}
  </div>;
};
