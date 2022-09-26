export const pagesPath = {
  "$403": {
    $url: (url?: { hash?: string }) => ({ pathname: '/403' as const, hash: url?.hash })
  },
  "$404": {
    $url: (url?: { hash?: string }) => ({ pathname: '/404' as const, hash: url?.hash })
  },
  "$500": {
    $url: (url?: { hash?: string }) => ({ pathname: '/500' as const, hash: url?.hash })
  },
  _slug: (slug: string | number) => ({
    $url: (url?: { hash?: string }) => ({ pathname: '/[slug]' as const, query: { slug }, hash: url?.hash })
  }),
  "admin": {
    $url: (url?: { hash?: string }) => ({ pathname: '/admin' as const, hash: url?.hash })
  },
  "news": {
    _slug: (slug: string | number) => ({
      $url: (url?: { hash?: string }) => ({ pathname: '/news/[slug]' as const, query: { slug }, hash: url?.hash })
    }),
    $url: (url?: { hash?: string }) => ({ pathname: '/news' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath
