export  interface Comment {
  id: any
  img?: string;
  name: string;
  targetName: string;
  createTime: string;
  content: string;
}


export  interface Emoji {
  title: string;
  src: string;
}

export interface TagOption{
  id: number,
  name: string
}


interface CodeLang {
  text: string;
  value: string;
}

interface CodeSelectLang {
  codeLangs: CodeLang[];
}

interface MenuConf {
  codeSelectLang: CodeSelectLang;
}

export interface EditorConfig {
  MENU_CONF: MenuConf;
}