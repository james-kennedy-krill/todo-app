declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HEROKU_API_KEY?: string
      NEXTAPIURL: string
      APIURL: string

      NEXT_PUBLIC_HEROKU_API_KEY: string
      NEXT_PUBLIC_NEXTAPIURL: string
      NEXT_PUBLIC_APIURL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
