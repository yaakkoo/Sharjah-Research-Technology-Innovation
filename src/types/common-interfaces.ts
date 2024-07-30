export interface IId {
  id: number
}

export interface ILang {
  en: string,
  ar: string
}

export interface ILigalDataLang {
  name: {
    en: string,
    ar: string
  },
  verified: boolean,
}

export interface ILigalDataString {
  name: string,
  verified: boolean,
}

export interface IOptionalLang {
  en?: string,
  ar?: string
}

export interface IGeo {
  longitude: string,
  latitude: string
}

export interface IName {
  name?: string
}