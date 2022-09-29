import {TextField} from '@mui/material';
import React from 'react';
import {Controller, Path} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {IEquipmentFormInputs} from 'components/calculationInput/equipments/EquipmentsSelectionDialog';
import {useTranslation} from 'next-i18next';
import {Box} from '@mui/system';

interface PositiveIntegerOnlyInputProps {
  name: Path<IEquipmentFormInputs>;
  control: Control<IEquipmentFormInputs>;
  showError: boolean;
  helperText: string;
}

const NickNameInput = ({
  name, control, showError, helperText,
}: PositiveIntegerOnlyInputProps) => {
  const {t} = useTranslation('home');

  return <Box sx={{mt: 5}}>
    <Controller
      name={name}
      control={control}
      rules={{
        maxLength: {
          value: 5,
          message: t('addPieceDialog.maximumIs', {max: 5}),
        },
      }}
      render={({field}) => (
        <TextField
          {...field}

          label="Enter a nickname(optional)"
          helperText={helperText}
          error={showError}
        />
      )}
    />
  </Box>;
};

export default NickNameInput;
