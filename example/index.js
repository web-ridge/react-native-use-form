import { registerRootComponent } from 'expo';

import App from './src/App';
import { en, registerTranslation, registerDefaultLocale } from '../src/index';
registerTranslation('en', en);
registerDefaultLocale('en');
registerRootComponent(App);
