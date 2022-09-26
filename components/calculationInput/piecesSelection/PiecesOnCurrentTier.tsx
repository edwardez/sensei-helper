import {Equipment} from 'model/Equipment';
import styles from 'components/calculationInput/piecesSelection/PiecesOnCurrentTier.module.scss';
import React from 'react';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import EquipmentCard from 'components/bui/card/EquipmentCard';


const PiecesOnCurrentTier = ({tier, selectedPieceId, pieces, handleSelectPiece}:
                                 {
                                     tier: number,
                                     selectedPieceId: string | null,
                                     pieces: Equipment[],
                                     handleSelectPiece: Function,
                                 }) => {
  return (
    <>
      <BuiLinedText>{`T${tier}`}</BuiLinedText>
      <div className={styles.currentTierPiecesRow}>
        {pieces.map(function(piece) {
          return (<div key={piece.id} className={styles.paperOuterMargin}>
            <EquipmentCard imageName={piece.icon} onClick={() => handleSelectPiece(piece.id)}
              isSelected={selectedPieceId === piece.id}/></div>);
        })}
      </div>
    </>
  );
};

export default PiecesOnCurrentTier;
