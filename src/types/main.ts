import type { AxiosRequestConfig } from 'axios';
import type {
  BCMSApiKeyHandler,
  BCMSEntryHandler,
  BCMSFunctionHandler,
  BCMSGroupHandler,
  BCMSLanguageHandler,
  BCMSMediaHandler,
  BCMSShimHandler,
  BCMSStatusHandler,
  BCMSTemplateHandler,
  BCMSTemplateOrganizerHandler,
  BCMSUserHandler,
  BCMSWidgetHandler,
} from './handlers';
import type { BCMSJwt } from './models';
import type { BCMSStorage } from './storage';
import type { BCMSStore } from './store';

export interface BCMSSdkConfig {
  /** Origin of the BCMS. For example: https://bcms.example.com */
  origin?: string;
}

export interface BCMSSdk {
  send: SendFunction;
  storage: BCMSStorage;
  store: BCMSStore;
  isLoggedIn(): Promise<boolean>;
  getAccessToken(): BCMSJwt | null;

  // Handlers
  shim: BCMSShimHandler;
  user: BCMSUserHandler;
  apiKey: BCMSApiKeyHandler;
  function: BCMSFunctionHandler;
  language: BCMSLanguageHandler;
  status: BCMSStatusHandler;
  group: BCMSGroupHandler;
  widget: BCMSWidgetHandler;
  media: BCMSMediaHandler;
  templateOrganizer: BCMSTemplateOrganizerHandler;
  template: BCMSTemplateHandler;
  entry: BCMSEntryHandler;
}

export interface SendFunction {
  <Data>(config: AxiosRequestConfig): Promise<Data>;
}
