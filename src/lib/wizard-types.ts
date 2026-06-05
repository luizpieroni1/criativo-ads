export interface Step1Data {
  companyName: string
  niche: string
  products: string
  region: string
  targetAudience: string
}

export interface Step2Data {
  advertised: string
  price: string
  mainPromise: string
  differentials: string
  socialProof: string
}

export interface Step3Data {
  objectives: string[]
  cta: string
  tone: string
}

export interface Step4Data {
  format: 'imagem' | 'carrossel' | 'video'
  carouselSlides?: number
  videoDuration?: number
  brandColors: 'sim' | 'nao' | 'sugestao'
  brandColorsValue?: string
  slogan?: string
}

export interface WizardData {
  step1: Step1Data
  step2: Step2Data
  step3: Step3Data
  step4: Step4Data
}

export const OBJECTIVES = [
  'Ganhar seguidores',
  'Gerar mensagens WhatsApp/Direct',
  'Engajamento',
  'Comentários',
  'Viralizar',
  'Salvamentos',
  'Clique no site',
  'Gerar leads',
  'Venda direta',
]

export const CTA_OPTIONS = [
  'Fale comigo no WhatsApp',
  'Agende sua consulta',
  'Acesse o site',
  'Saiba mais',
  'Compre agora',
  'Baixe grátis',
  'Inscreva-se',
  'Outro',
]

export const TONE_OPTIONS = [
  'Profissional e sério',
  'Descontraído e direto',
  'Empático e acolhedor',
  'Urgente e persuasivo',
  'Educativo e informativo',
  'Inspiracional e motivacional',
  'Bem-humorado / leve',
]
