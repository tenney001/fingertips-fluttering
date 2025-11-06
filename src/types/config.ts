/**
 * 语言配置接口
 */
export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  characters: string;
  keyboardLayout: string;
  fontFamily: string;
  textDirection: 'ltr' | 'rtl';
  caseSensitive: boolean;
}

/**
 * 用户配置接口
 */
export interface UserConfig {
  language: 'english';
  caseSensitive: boolean;
  soundEnabled: boolean;
  autoStart: boolean;
  defaultDuration: number;
}
