declare module "@telegram-apps/sdk" {
  interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    is_premium?: boolean;
    allows_write_to_pm?: boolean;
  }

  interface InitData {
    user: User;
    hash: string;
    auth_date: Date;
    start_param: string;
    chat_type: string;
    chat_instance: string;
    query_id: string;
  }

  function initInitData(): InitData | null;
  function parseInitData(initDataRaw: string): InitData;
  function mockTelegramEnv(env: {
    themeParams: any;
    initData: InitData;
    initDataRaw: string;
    version: string;
    platform: string;
  }): void;
}
