import {TextField, TextFieldProps} from '@mui/material';
import {Controller, FieldValues, Path} from 'react-hook-form';
import React from 'react';
import {useTranslation} from 'next-i18next';
import {Control} from 'react-hook-form/dist/types/form';

interface PositiveIntegerOnlyInputProps<T extends FieldValues>
  extends Omit<TextFieldProps,
    | 'inputProps' | 'variant' | 'error' | 'helperText' | 'label'
    | 'onChange' | 'onBlur' | 'value' | 'name' | 'ref'>
{
  name: Path<T>;
  control: Control<T>;
  showError: boolean;
  helperText: string;
  min?: number;
  inputLabel?: string;
  required?: boolean;
}

const PositiveIntegerOnlyInput = function<T extends FieldValues>({
  name, control, showError, helperText,
  min = 1, inputLabel, required = true,
  ...others
}: PositiveIntegerOnlyInputProps<T>) {
  const {t} = useTranslation('home');
  return <Controller
    name={name}
    control={control}
    rules={{
      required: {
        value: required,
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
    render={({field: {ref: fieldRef, ...field}}) => (
      <TextField
        {...others}
        {...field}
        inputRef={fieldRef}
        inputProps={{pattern: '\\d*'}}
        variant="outlined"
        error={showError}
        helperText={helperText}
        label={inputLabel ?? t('addPieceDialog.quantity')}
      />
    )}
  />;
};

export default PositiveIntegerOnlyInput;
