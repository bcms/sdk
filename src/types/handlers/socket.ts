import type { BCMSSdkCache } from '../cache';
import type { BCMSSocketEvent, BCMSSocketEventName } from '../models';
import type { BCMSStorage } from '../storage';
import type { BCMSThrowable } from '../util';
import type { BCMSApiKeyHandler } from './api-key';
import type { BCMSEntryHandler } from './entry';
import type { BCMSGroupHandler } from './group';
import type { BCMSLanguageHandler } from './language';
import type { BCMSMediaHandler } from './media';
import type { BCMSStatusHandler } from './status';
import type { BCMSTemplateHandler } from './template';
import type { BCMSTemplateOrganizerHandler } from './template-organizer';
import type { BCMSUserHandler } from './user';
import type { BCMSWidgetHandler } from './widget';

export interface BCMSSocketHandlerConfig {
  cache: BCMSSdkCache;
  storage: BCMSStorage;
  throwable: BCMSThrowable;

  apiKeyHandler: BCMSApiKeyHandler;
  entryHandler: BCMSEntryHandler;
  groupHandler: BCMSGroupHandler;
  langHandler: BCMSLanguageHandler;
  mediaHandler: BCMSMediaHandler;
  statusHandler: BCMSStatusHandler;
  templateHandler: BCMSTemplateHandler;
  tempOrgHandler: BCMSTemplateOrganizerHandler;
  userHandler: BCMSUserHandler;
  widgetHandler: BCMSWidgetHandler;
}

export interface BCMSSocketHandler {
  id(): string | null;
  connect(): Promise<void>;
  disconnect(): void;
  connected(): boolean;
  emit(event: string, data: unknown): void;
  subscribe(
    event: BCMSSocketEventName | 'ANY',
    callback: BCMSSocketSubscriptionCallback,
  ): () => void;
}

export interface BCMSSocketSubscriptionCallback {
  (event: BCMSSocketEvent): Promise<void>;
}
