import fs from 'fs';
import path from 'path';
import {Campaign} from 'model/Campaign';
import {Equipment} from 'model/Equipment';
import Image from 'next/image';
import styles from './all-campaigns.module.scss';

const jsonDirectory = path.join(process.cwd(), 'public', 'data');
console.log(styles);
const AllCampaigns = ({
  campaigns,
  equipmentsById,
}: { campaigns: Campaign[], equipmentsById: { [k: string]: Equipment } }) => {
  return (
    <ul>
      {campaigns.map((campaign) => {
        return (
          <li key={campaign.id}>
            <div>{`${campaign.area}-${campaign.stage}`}</div>

            <div className={styles.equipmentsParent}>
              {
                campaign.rewards.map((reward) => {
                  const equipment = equipmentsById[reward.id.toString()];
                  return (<div className={styles.imageContainer} key={reward.id}>
                    <Image
                      src={`/images/equipments/${equipment?.icon}.png`}
                      width={63} height={50}></Image>
                    <div>{reward.probability * 100}%</div>
                  </div>);
                })
              }
            </div>

          </li>
        );
      })}
    </ul>
  );
};


export async function getStaticProps() {
  const rawCampaignsData = fs.readFileSync(path.join(jsonDirectory, 'campaigns.json'));
  const campaigns = JSON.parse(rawCampaignsData.toString()) as Campaign[];

  const rawEquipmentsData = fs.readFileSync(path.join(jsonDirectory, 'equipments.json'));
  const equipments = JSON.parse(rawEquipmentsData.toString()) as Equipment[];
  const equipmentsById = Object.fromEntries(equipments.map((equipment) => [equipment.id, equipment]));
  return {
    props: {campaigns, equipmentsById}, // will be passed to the page component as props
  };
}

export default AllCampaigns;
