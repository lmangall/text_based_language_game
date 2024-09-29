declare module "@telegram-apps/sdk" {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    languageCode: string;
    isPremium?: boolean;
    allowsWriteToPm?: boolean;
  }

  interface InitData {
    user: User;
    hash: string;
    authDate: Date;
    startParam: string;
    chatType: string;
    chatInstance: string;
    queryId: string;
  }

  interface TelegramInitData {
    initData: InitData;
  }
  //x
  function initInitData(): TelegramInitData | null;
  function parseInitData(initDataRaw: string): InitData;
  function mockTelegramEnv(env: {
    themeParams: any;
    initData: InitData;
    initDataRaw: string;
    version: string;
    platform: string;
  }): void;
}
