import {Instance, types} from 'mobx-state-tree';

export const WizSettingsStore = types
    .model('WizSettingsStore', {
      appLanguage: types.enumeration('WizLanguage', ['en', 'cn', 'jp']),
    });

export type WizLanguage = Instance<typeof WizSettingsStore.properties.appLanguage>
