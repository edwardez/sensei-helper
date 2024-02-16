import styles from 'components/calculationInput/common/EquipmentsList.module.scss';
import {Equipment} from 'model/Equipment';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {MouseEventHandler, memo, useCallback, useRef} from 'react';
import {useTranslation} from 'next-i18next';

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
  const {t} = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);

  let anythingRendered = false;

  const handleClick: MouseEventHandler = useCallback((e) => {
    const index = Array.from(containerRef.current?.children ?? [])
        .findIndex((elm) => elm.contains(e.currentTarget));
    const clicked = equipments.flatMap((equipOrGroup) => {
      return 'id' in equipOrGroup ?
        [equipOrGroup] :
        [/* label */null, ...equipOrGroup.equipments];
    })[index];
    clicked && onClick(clicked.id);
  }, [equipments, onClick]);

  const createLabel = (group: EquipmentGroup) => {
    return <div key={group.label} className={styles.divider}>
      <BuiLinedText>{group.label}</BuiLinedText>
    </div>;
  };

  const createCard = (equip: Equipment) => {
    anythingRendered ||= true;
    return <div key={equip.id} className={styles.card}>
      <EquipmentCardMemo
        imageName={equip.icon} onClick={handleClick}
        isSelected={selectedEquipId === equip.id}/>
    </div>;
  };

  return <div ref={containerRef} className={styles.container}>
    {equipments.flatMap((equipOrGroup) => {
      return 'id' in equipOrGroup ?
        [createCard(equipOrGroup)] :
        [createLabel(equipOrGroup), ...equipOrGroup.equipments.map(createCard)];
    })}
    {anythingRendered || <div key='empty'>{t('filterResultEmpty')}</div>}
  </div>;
};
