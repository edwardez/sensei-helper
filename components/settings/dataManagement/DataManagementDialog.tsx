import React, {
  ChangeEventHandler, DragEventHandler, MouseEventHandler, ReactNode,
  useEffect, useId, useRef, useState,
} from 'react';
import {
  Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, FormHelperText, OutlinedInput, FormLabel,
  Snackbar, Stack, Tooltip, styled, useTheme, useMediaQuery, Slide,
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
const formatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});

type Result<T, E = unknown> = {success: true, value: T} | {success: false, error: E}
const catching = <T, >(block: () => T): Result<T> => {
  try {
    return {success: true, value: block()};
  } catch (e: unknown) {
    return {success: false, error: e};
  }
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

  type SnackbarContent = {
    key: string,
    msg: ReactNode,
  };
  const [snackbar, setSnackbar] = useState<SnackbarContent | null>(null);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const showSnackbar = (content: SnackbarContent) => {
    setSnackbar(content);
    setSnackbarOpen(true);
  };

  const handleCopy: MouseEventHandler = async (e) => {
    await navigator.clipboard.writeText(getValues('data'));
    showSnackbar({key: 'copied', msg: 'Copied!'});
  };

  const handlePaste: MouseEventHandler = async (e) => {
    const value = await navigator.clipboard.readText();
    setValue('data', value, {shouldValidate: true});
    showSnackbar({key: 'pasted', msg: 'Pasted!'});
  };

  const anchor = useRef<HTMLAnchorElement>(null);
  const handleDownload: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (!anchor.current) return;

    const blob = new Blob([
      getValues('data'),
    ], {
      type: 'application/json',
    });

    const [date, time] = formatter.format(new Date())
        .replaceAll('/', '')
        .replaceAll(':', '')
        .split(' ');
    const name = `SenseiHelper_${date}_${time}.json`;

    anchor.current.href = window.URL.createObjectURL(blob);
    anchor.current.download = name;
    anchor.current.click();
    showSnackbar({key: 'exported', msg: `Exported to '${name}'`});
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
      データ管理
      <Tooltip title='アプリのデータをバックアップしたり、破損したデータを手動で修復できます。'><InfoOutlined /></Tooltip>
    </Stack>
    <Stack component={DialogContent} direction='column'>
      <Stack flex='0 0 auto' direction='row' flexWrap='wrap' gap='1rem'>
        <ButtonGroup variant='contained' fullWidth sx={{flex: '1 1 max-content'}}>
          <Button component='label' tabIndex={-1} startIcon={<FileDownload />}>
            インポート
            <HiddenInput type='file' accept='application/json' onChange={handleUpload} />
          </Button>
          <Button component='label' onClick={handlePaste} sx={{width: 'unset'}}>
            <ContentPasteGo fontSize='small'/>
          </Button>
        </ButtonGroup>
        <ButtonGroup variant='contained' fullWidth sx={{flex: '1 1 max-content'}}>
          <Button startIcon={<FileUpload />} onClick={handleDownload}>
            エクスポート
            <Box component='a' ref={anchor} display='none' />
          </Button>
          <Button onClick={handleCopy} sx={{width: 'unset'}}>
            <ContentCopy fontSize='small'/>
          </Button>
        </ButtonGroup>
      </Stack>
      <Controller control={control} name='data'
        rules={{
          required: {value: true, message: '必須です'},
          validate: (value) => {
            const result = parseInput(value);
            return result.success || `${result.error}`;
          },
        }}
        render={({field, fieldState}) => (
          <FormControl fullWidth variant='outlined' error={fieldState.invalid}
            margin='normal' sx={{flex: '1 1 100%'}}>
            <Stack direction='row' gap='0.5rem'>
              <Box component={FormLabel} htmlFor={inputId} flex='1 1 auto'>JSON</Box>
              <Box component={Button} variant='text' padding='0'
                disabled={(!formState.isDirty)}
                onClick={() => reset()}>
                リセット
              </Box>
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
                    <Box>変更はダイアログを閉じるまで適用されません</Box>}
              </Tooltip>
            </FormHelperText>
          </FormControl>
        )}/>
    </Stack>
    <DialogActions>
      {mode === 'edit' ? <Button onClick={onCancel}>
        キャンセル
      </Button> : <Button color='error' onClick={onResetData}>
        データをリセット
      </Button>}
      <Button disabled={!formState.isValid}
        onClick={handleSubmit((values) => {
          const result = parseInput(values.data);
          result.success && onSubmit?.(result.value);
        })}>
        適用
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
