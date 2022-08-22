import {Equipment} from 'model/Equipment';
import Image from 'next/image';
import styles from './PiecesOnCurrentTier.module.scss';
import {CardActionArea, Typography} from '@mui/material';
import React from 'react';
import BasCard from 'components/bui/BasCard';


const PiecesOnCurrentTier = ({tier, selectedPieceId, pieces, handleSelectPiece}:
                                 {
                                     tier: number,
                                     selectedPieceId: string | null,
                                     pieces: Equipment[],
                                     handleSelectPiece: Function,
                                 }) => {
  return (
    <>
      <Typography> T{tier}</Typography>
      <div className={styles.currentTierPiecesRow}>
        {pieces.map(function(piece) {
          return (<div key={piece.id} className={styles.paperOuterMargin}><BasCard elevation={1}
            className={selectedPieceId === piece.id ? 'bas-selected' : ''}>
            <CardActionArea onClick={() => handleSelectPiece(piece.id)}>
              <Image
                src={`/images/equipments/${piece.icon}.png`}
                width={63} height={50}></Image>
            </CardActionArea>
          </BasCard></div>);
        })}
      </div>
    </>
  );
};

export default PiecesOnCurrentTier;
