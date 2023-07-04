export interface IPage {
  title: string;
  meta?: string;
}

const pages: Record<string, IPage> = {
  index: {
    title: 'Hello world',
    meta: 'This is meta description for index.html file'
  }
}

export default pages;
