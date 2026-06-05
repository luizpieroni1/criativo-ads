import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { WizardData } from '@/lib/wizard-types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Você é um especialista em criação de anúncios para Meta Ads (Facebook e Instagram). Gere criativos completos e personalizados com base nas informações fornecidas.

Adapte os entregáveis ao formato escolhido:

Se IMAGEM ÚNICA, entregue:
- 3 variações de copy completa (headline até 40 caracteres, texto principal até 125 caracteres, descrição/CTA até 30 caracteres, texto longo expandido)
- Use gatilhos diferentes: V1 = Dor/Problema, V2 = Desejo/Transformação, V3 = Prova social/Autoridade
- Sugestão de direção visual detalhada (tipo de imagem, cores, elementos, o que evitar)

Se CARROSSEL, entregue:
- Título da capa (slide 1) com gancho forte
- Texto de cada slide em sequência com micro-tensão entre eles
- CTA no último slide
- Sugestão visual para cada slide

Se VÍDEO, entregue em DOIS BLOCOS SEPARADOS:

BLOCO 1 — HOOKS + SCRIPT COMPLETO
- 5 opções de hook para os primeiros 3 segundos (apenas fala/narração, uma por linha)
- Roteiro completo com marcação de tempo (respeitando os segundos informados) contendo apenas as falas, narração ou texto em tela — sem descrever cena:
  [0–3s] GANCHO: <fala/narração>
  [3–Xs] DESENVOLVIMENTO: <fala/narração>
  [Xs–Ys] PROVA/CREDIBILIDADE: <fala/narração>
  [Ys–fim] CTA: <fala/narração>

BLOCO 2 — DESCRIÇÃO DE CENA
- Para cada parte do roteiro acima, descreva a cena correspondente de forma objetiva e concisa
- Inclua: o que aparece na tela, enquadramento sugerido (close, plano médio, etc.) e atmosfera/mood
- Foque na ideia da cena, sem ser excessivamente detalhista
- Formato: [0–3s], [3–Xs], [Xs–Ys], [Ys–fim] com a descrição visual de cada parte

Regras:
- Nunca use linguagem genérica — personalize com os dados fornecidos
- Se não houver prova social, use linguagem de promessa, não de resultado
- Para nichos sensíveis (saúde, jurídico, financeiro), use "pode", "tem potencial", "resultados variam"
- Priorize copy que gera ação imediata`

function buildUserPrompt(data: WizardData): string {
  const { step1, step2, step3, step4 } = data

  let prompt = `## DADOS DO ANÚNCIO

### Empresa
- Nome: ${step1.companyName}
- Nicho: ${step1.niche}
- Produtos/Serviços: ${step1.products}
- Região: ${step1.region}
- Público-alvo: ${step1.targetAudience}

### Oferta
- Produto anunciado: ${step2.advertised}
- Preço: ${step2.price}
- Promessa principal: ${step2.mainPromise}
- Diferencial: ${step2.differentials}
- Prova social: ${step2.socialProof || 'Não informado'}

### Anúncio
- Objetivos: ${step3.objectives.join(', ')}
- CTA: ${step3.cta}
- Tom: ${step3.tone}

### Formato
- Formato: ${step4.format.toUpperCase()}`

  if (step4.format === 'carrossel') {
    prompt += `\n- Número de slides: ${step4.carouselSlides ?? 5}`
  }
  if (step4.format === 'video') {
    prompt += `\n- Duração: ${step4.videoDuration ?? 30} segundos`
  }

  if (step4.brandColors === 'sim') {
    prompt += `\n- Identidade visual: ${step4.brandColorsValue}`
  } else if (step4.brandColors === 'sugestao') {
    prompt += '\n- Identidade visual: Sugerir paleta de cores adequada ao nicho'
  } else {
    prompt += '\n- Identidade visual: Não definida'
  }

  if (step4.slogan) {
    prompt += `\n- Slogan: ${step4.slogan}`
  }

  prompt += '\n\nGere o criativo completo agora.'
  return prompt
}

export async function POST(req: NextRequest) {
  try {
    const data: WizardData = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(data) }],
    })

    const result = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('\n')

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Erro ao gerar criativo' }, { status: 500 })
  }
}
