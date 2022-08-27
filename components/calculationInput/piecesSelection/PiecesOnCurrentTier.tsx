import {Equipment} from 'model/Equipment';
import Image from 'next/image';
import styles from 'components/calculationInput/piecesSelection/PiecesOnCurrentTier.module.scss';
import {CardActionArea} from '@mui/material';
import React from 'react';
import BuiCard from 'components/bui/BuiCard';
import BuiLinedText from 'components/bui/text/BuiLinedText';


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
            <BuiCard elevation={1} className={selectedPieceId === piece.id ? 'wiz-selected' : ''}>
              <CardActionArea onClick={() => handleSelectPiece(piece.id)} className={'exclude-revert-transform'}>
                <Image className={'revert-wiz-transform'}
                  src={`/images/equipments/@0.5/${piece.icon}.png`}
                  width={63} height={50}></Image>
              </CardActionArea>
            </BuiCard></div>);
        })}
      </div>
    </>
  );
};

export default PiecesOnCurrentTier;