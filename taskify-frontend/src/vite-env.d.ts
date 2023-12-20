/// <reference types="vite/client" />

// 使用 import.meta.env 時可以出現提示
interface ImportMetaEnv {
  readonly VITE_API_URL_PREFIX: string;
}
