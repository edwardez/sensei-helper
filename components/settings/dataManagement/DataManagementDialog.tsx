import React, {
  ChangeEventHandler, DragEventHandler, MouseEventHandler, ReactNode,
  forwardRef, useEffect, useId, useRef, useState,
} from 'react';
import {
  Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, FormHelperText, OutlinedInput, FormLabel,
  Snackbar, Stack, Tooltip, styled, useTheme, useMediaQuery, Slide, IconButton,
} from '@mui/material';
import {useTranslation} from 'next-i18next';
import {Controller, useForm} from 'react-hook-form';
import {IWizStoreSnapshotOut, useStore} from 'stores/WizStore';
import {getSnapshot, getType, typecheck} from 'mobx-state-tree';
import {
  ContentCopy, ContentPasteGo, FileDownload, FileUpload,
  InfoOutlined,
} from '@mui/icons-material';

interface DataManagementFormValues {
  data: string
}

// YYYY/MM/DD hh:mm:ss
const formatter = new Intl.DateTimeFormat('ja-JP', { // sv-SE?
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});
const createFileName = (base: string, ext: string, sep: string = '_') => {
  const [date, time] = formatter.format(new Date())
      .replaceAll('/', '')
      .replaceAll(':', '')
      .split(' ');
  return `${[base, date, time].join(sep)}.${ext}`;
};

type Result<T, E = unknown> = {success: true, value: T} | {success: false, error: E}
const catching = <T, >(block: () => T): Result<T> => {
  try {
    return {success: true, value: block()};
  } catch (e: unknown) {
    return {success: false, error: e};
  }
};

const idle = (opt?: Parameters<typeof requestIdleCallback>[1]) => {
  return new Promise((resolve) => requestIdleCallback(resolve, opt));
};

interface MSTError extends Error {
  message: `[mobx-state-tree] ${string}`
}
const isMSTError = (error: unknown): error is MSTError => {
  return error instanceof Error && error.message.startsWith('[mobx-state-tree] ');
};
const convertMSTError = (error: MSTError): string => {
  return error.message
      .replace('[mobx-state-tree] ', '')
      .replace(/Error while converting `[^`]*` to `[^`]*`:\n/, 'Failed to convert data:')
      .replace(/^\s+/gm, '');
};

export const DataManagementDialog = ({
  open = false, mode = 'edit', value,
  onClose, onCancel, onSubmit, onResetData,
}: {
  open?: boolean,
  mode?: 'edit' | 'recovery',
  value?: IWizStoreSnapshotOut | string,
  onClose?: () => void,
  onCancel?: () => void,
  onResetData?: () => void,
  onSubmit?: (snapshot: IWizStoreSnapshotOut) => void,
}) => {
  const {t} = useTranslation('home');
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const store = useStore();

  const inputId = useId();
  const {
    getValues, setValue, reset, trigger,
    formState, handleSubmit, control,
  } = useForm<DataManagementFormValues>({
    mode: 'all',
    defaultValues: value ? {
      data: typeof value === 'object' ? JSON.stringify(value, null, 2) : value,
    }: {
      data: JSON.stringify(getSnapshot(store), null, 2),
    },
  });
  useEffect(() => {
    const id = setTimeout(() => trigger('data'), 0);
    return () => clearTimeout(id);
  }, [trigger]);

  const [isEditEnabled, setEditEnabled] = useState(mode === 'recovery');

  type SnackbarContent = {key: string, msg: ReactNode};
  const [snackbar, setSnackbar] = useState<SnackbarContent | null>(null);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const showSnackbar = (content: SnackbarContent) => {
    setSnackbar(content);
    setSnackbarOpen(true);
  };

  const handleCopy: MouseEventHandler = async () => {
    await navigator.clipboard.writeText(getValues('data'));
    showSnackbar({key: 'copied', msg: 'Copied!'});
  };

  const handlePaste: MouseEventHandler = async () => {
    const value = await navigator.clipboard.readText();
    setValue('data', value, {shouldValidate: true});
    showSnackbar({key: 'pasted', msg: 'Pasted!'});
  };

  const anchorRef = useRef<HTMLAnchorElement>(null);
  const handleDownload: MouseEventHandler = async () => {
    if (!anchorRef.current) return;
    const a = anchorRef.current;

    window.URL.revokeObjectURL(a.href);
    a.href = window.URL.createObjectURL(new Blob([getValues('data')], {type: 'application/json'}));
    a.download = createFileName('SenseiHelper', 'json');
    a.click();
    showSnackbar({key: 'exported', msg: `Exported to '${a.download}'`});
  };

  const handleUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return console.warn('file unspecified');
    setValue('data', await file.text(), {shouldValidate: true});
    showSnackbar({key: 'exported', msg: `Imported from ${file.name}`});
  };

  const handleFileDrop: DragEventHandler = async (e) => {
    const file = Array.from(e.dataTransfer.files).find((it) => it.type === 'application/json');
    if (!file) return console.warn('file unspecified');
    e.preventDefault();
    setValue('data', await file.text(), {shouldValidate: true});
    showSnackbar({key: 'exported', msg: `Imported from '${file.name}'`});
  };

  const parseInput = (value: string) => catching<IWizStoreSnapshotOut>(() => {
    const parsed = catching(() => JSON.parse(value));
    if (!parsed.success) {
      throw parsed?.error instanceof SyntaxError ?
        parsed.error.message :
        parsed.error;
    }
    const checked = catching(() => typecheck(getType(store), parsed.value));
    if (!checked.success) {
      throw isMSTError(checked.error) ?
        convertMSTError(checked.error) :
        checked.error;
    }
    const result = catching(() => getType(store).create(parsed.value));
    if (!result.success) {
      throw result.error;
    }
    return getSnapshot(result.value);
  });

  return <Dialog open={open} fullWidth fullScreen={isFullScreen}
    PaperProps={{sx: {height: '100%'}}} onClose={onClose} onDrop={handleFileDrop}>
    <Stack component={DialogTitle} direction='row' alignItems='center' gap='0.5rem'>
      {t('dataManagementDialog.title')}
      <Tooltip title={t('dataManagementDialog.tips')}>
        <IconButton><InfoOutlined /></IconButton>
      </Tooltip>
    </Stack>
    <Stack component={DialogContent} direction='column'>
      <Stack flex='0 0 auto' direction='row' flexWrap='wrap' gap='1rem'>
        <ButtonGroup variant='contained' fullWidth sx={{flex: '1 1 max-content'}}>
          <Button component='label' tabIndex={-1} startIcon={<FileDownload />} role={undefined}>
            {t('dataManagementDialog.importFile')}
            <HiddenInput type='file' accept='application/json' onChange={handleUpload} />
          </Button>
          <Button component='label' onClick={handlePaste} sx={{width: 'unset'}}>
            <ContentPasteGo fontSize='small'/>
          </Button>
        </ButtonGroup>
        <ButtonGroup variant='contained' fullWidth sx={{flex: '1 1 max-content'}}>
          <Button startIcon={<FileUpload />} onClick={handleDownload}>
            {t('dataManagementDialog.exportFile')}
            <Box component='a' ref={anchorRef} display='none' />
          </Button>
          <Button onClick={handleCopy} sx={{width: 'unset'}}>
            <ContentCopy fontSize='small'/>
          </Button>
        </ButtonGroup>
      </Stack>
      <Controller control={control} name='data'
        rules={{
          required: {value: true, message: t('dataManagementDialog.helpText.required')},
          validate: async (value) => {
            await idle();
            const result = parseInput(value);
            return result.success || `${result.error}`;
          },
        }}
        render={({field, fieldState}) => (
          <FormControl fullWidth variant='outlined' margin='normal' sx={{flex: '1 1 100%'}}
            error={fieldState.invalid} disabled={!isEditEnabled}>
            <Stack direction='row' gap='0.5rem'>
              <Box component={FormLabel} htmlFor={inputId} flex='1 1 auto'>
                {t('dataManagementDialog.formLabel')}
              </Box>
              {!isEditEnabled ? <TextButton onClick={() => setEditEnabled(true)}>
                {t('dataManagementDialog.enableEditing')}
              </TextButton> : <TextButton disabled={!fieldState.isDirty} onClick={() => reset()}>
                {t('dataManagementDialog.resetForm')}
              </TextButton>}
            </Stack>
            <OutlinedInput id={inputId} notched={false}
              sx={{flex: '1', paddingInline: '1rem 0', paddingBlock: '0.1rem'}}
              inputComponent='textarea'
              inputProps={{...field, sx: {
                height: '100%',
                padding: '0',
                resize: 'none',
                fontFamily: `'MyricaM M', Menlo, Monaco, 'Courier New', monospace`,
                overscrollBehavior: 'contain',
              }}} />
            <FormHelperText component={Box} maxWidth='100%' whiteSpace='nowrap'>
              <Tooltip title={fieldState.error && <PreText>{fieldState.error.message}</PreText>}>
                {fieldState.error ?
                    <EllipsisText>{fieldState.error.message}</EllipsisText> :
                    <Box>{t('dataManagementDialog.helpText.default')}</Box>}
              </Tooltip>
            </FormHelperText>
          </FormControl>
        )}/>
    </Stack>
    <DialogActions>
      {mode === 'edit' ? <Button onClick={onCancel}>
        {t('dataManagementDialog.cancel')}
      </Button> : <Button color='error' onClick={onResetData}>
        {t('dataManagementDialog.resetData')}
      </Button>}
      <Button disabled={!formState.isValid}
        onClick={handleSubmit((values) => {
          const result = parseInput(values.data);
          result.success && onSubmit?.(result.value);
        })}>
        {t('dataManagementDialog.applyData')}
      </Button>
    </DialogActions>
    <Snackbar open={isSnackbarOpen} key={snackbar?.key} message={snackbar?.msg}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      TransitionComponent={Slide}
      autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} />
  </Dialog>;
};

const HiddenInput = styled('input')({
  position: 'absolute',
  width: 0,
  height: 0,
  appearance: 'none',
  opacity: 0,
});

const EllipsisText = styled(Box)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const PreText = styled(Box)({
  whiteSpace: 'pre-wrap',
  fontFamily: `'MyricaM M', Menlo, Monaco, 'Courier New', monospace`,
});

const TextButton = styled(forwardRef(function TextButton(props: any, ref: any) {
  return <Button {...props} ref={ref} variant={props.variant ?? 'text'} />;
}))({
  paddingBlock: 0,
  textTransform: 'none',
}) as typeof Button;
