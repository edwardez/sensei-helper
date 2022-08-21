import {Equipment} from 'model/Equipment';
import Image from 'next/image';
import styles from './PiecesOnCurrentTier.module.scss';


const PiecesOnCurrentTier = ({tier, pieces, handleSelectPiece} : {tier: number, pieces:Equipment[], handleSelectPiece:Function })=>{
  return (
    <>
      <div> T{tier}</div>
      <div className={styles.currentTierPiecesRow}>
        {pieces.map(function(piece) {
          return (<Image key={piece.id}
            src={`/images/equipments/${piece.icon}.png`}
            width={63} height={50}
            onClick={() => handleSelectPiece(piece.id)}></Image>);
        })}
      </div>
    </>
  );
};

export default PiecesOnCurrentTier;
