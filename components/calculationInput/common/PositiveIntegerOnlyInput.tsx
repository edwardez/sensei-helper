import {TextField} from '@mui/material';
import {Controller, FieldValues, Path} from 'react-hook-form';
import React from 'react';
import {useTranslation} from 'next-i18next';
import {Control} from 'react-hook-form/dist/types/form';

interface PositiveIntegerOnlyInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  showError: boolean;
  helperText: string;
  min?: number;
}

const PositiveIntegerOnlyInput = function<T>({
  name, control, showError, helperText,
  min = 1,
}: PositiveIntegerOnlyInputProps<T>) {
  const {t} = useTranslation('home');
  return <Controller
    name={name}
    control={control}
    rules={{
      required: {
        value: true,
        message: t('addPieceDialog.required'),
      },
      pattern: {
        value: /^\d+$/,
        message: t('addPieceDialog.mustBeAInteger'),
      },
      min: {
        value: min,
        message: t('addPieceDialog.minimumIs', {min: 1}),
      },
      max: {
        value: 999,
        message: t('addPieceDialog.maximumIs', {max: 999}),
      },
    }}
    render={({field}) => (
      <TextField
        {...field}
        inputProps={{pattern: '\\d*'}}
        variant="outlined"
        error={showError}
        helperText={helperText}
        label={t('addPieceDialog.quantity')}
      />
    )}
  />;
};

export default PositiveIntegerOnlyInput;
