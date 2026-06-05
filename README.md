# Anúncios que Vendem

Gerador de criativos para Meta Ads com IA (Claude Sonnet). Wizard de 4 etapas → copy completa para Imagem, Carrossel ou Vídeo.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (auth + banco)
- Anthropic Claude API

---

## Rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Em **Authentication > Settings**, habilite Email/Password sign-in
4. Copie a URL e a anon key do projeto para o `.env.local`

### 4. Rodar

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Deploy na Hostinger VPS

### Pré-requisitos no servidor

```bash
# Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 para processo persistente
npm install -g pm2

# Nginx
sudo apt install nginx -y
```

### 1. Clonar e instalar

```bash
git clone <seu-repositorio> /var/www/anuncios
cd /var/www/anuncios
npm install
```

### 2. Configurar variáveis

```bash
cp .env.example .env.local
nano .env.local  # preencher com as chaves reais
```

### 3. Build de produção

```bash
npm run build
```

### 4. Iniciar com PM2

```bash
pm2 start npm --name "anuncios" -- start
pm2 save
pm2 startup
```

### 5. Configurar Nginx

```nginx
# /etc/nginx/sites-available/anuncios
server {
    listen 80;
    server_name seu-dominio.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/anuncios /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL com Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seu-dominio.com.br
```

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/          # Login e cadastro
│   ├── (app)/           # Área logada
│   │   ├── dashboard/
│   │   ├── novo/        # Wizard de criativo
│   │   ├── resultado/[id]/
│   │   └── historico/
│   └── api/generate/    # Rota que chama Claude API
├── components/
│   ├── wizard/          # Steps 1–4
│   ├── AppNav.tsx
│   └── ResultadoClient.tsx
└── lib/
    ├── supabase.ts       # Client-side
    ├── supabase-server.ts
    ├── database.types.ts
    └── wizard-types.ts
supabase/
└── schema.sql
```
