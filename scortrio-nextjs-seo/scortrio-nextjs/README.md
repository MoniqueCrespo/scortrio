# ScortRio - Frontend Next.js

Frontend moderno estilo FatalModel/LogLove para o site ScortRio, usando Next.js 14 + Tailwind CSS.

## 🚀 Quick Start

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
- `NEXT_PUBLIC_WP_API_URL`: URL da API do seu WordPress
- `NEXT_PUBLIC_USE_MOCK`: `true` para usar dados fake, `false` para conectar ao WP

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 4. Build para produção

```bash
npm run build
npm start
```

---

## 📁 Estrutura do Projeto

```
scortrio-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout principal
│   │   ├── page.tsx             # Home (redireciona)
│   │   ├── globals.css          # Estilos globais
│   │   ├── acompanhantes/
│   │   │   └── page.tsx         # Listagem
│   │   └── acompanhante/
│   │       └── [slug]/
│   │           └── page.tsx     # Perfil individual
│   ├── components/
│   │   ├── Header.tsx           # Cabeçalho
│   │   ├── Footer.tsx           # Rodapé
│   │   ├── BottomNav.tsx        # Menu mobile
│   │   ├── ProfileCard.tsx      # Card de perfil
│   │   └── Filters.tsx          # Filtros
│   ├── lib/
│   │   └── api.ts               # Funções de API + dados mock
│   └── types/
│       └── index.ts             # Tipos TypeScript
├── public/                       # Arquivos estáticos
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 🔌 Conectar ao WordPress

### Passo 1: Instalar plugins no WordPress

1. **ACF to REST API** - Expõe campos ACF na API
2. **JWT Authentication** - Para autenticação (opcional)

### Passo 2: Adicionar endpoints customizados

Cole este código no `functions.php` do seu tema ou crie um plugin:

```php
<?php
/**
 * API REST customizada para ScortRio
 */

add_action('rest_api_init', function () {
    
    // Listar acompanhantes
    register_rest_route('scortrio/v1', '/acompanhantes', [
        'methods' => 'GET',
        'callback' => 'scortrio_get_acompanhantes',
        'permission_callback' => '__return_true'
    ]);
    
    // Acompanhante individual
    register_rest_route('scortrio/v1', '/acompanhante/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => 'scortrio_get_acompanhante_single',
        'permission_callback' => '__return_true'
    ]);
});

function scortrio_get_acompanhantes($request) {
    $args = [
        'post_type' => 'acompanhante', // Ajuste para seu CPT
        'posts_per_page' => $request->get_param('per_page') ?: 12,
        'paged' => $request->get_param('page') ?: 1,
        'post_status' => 'publish',
    ];
    
    // Filtro por cidade
    if ($cidade = $request->get_param('cidade')) {
        $args['tax_query'][] = [
            'taxonomy' => 'cidade',
            'field' => 'slug',
            'terms' => $cidade
        ];
    }
    
    // Filtro por preço
    if ($preco_min = $request->get_param('preco_min')) {
        $args['meta_query'][] = [
            'key' => 'valor_hora',
            'value' => $preco_min,
            'compare' => '>=',
            'type' => 'NUMERIC'
        ];
    }
    
    if ($preco_max = $request->get_param('preco_max')) {
        $args['meta_query'][] = [
            'key' => 'valor_hora',
            'value' => $preco_max,
            'compare' => '<=',
            'type' => 'NUMERIC'
        ];
    }
    
    // Ordenação
    $ordenar = $request->get_param('ordenar');
    if ($ordenar === 'preco_asc') {
        $args['meta_key'] = 'valor_hora';
        $args['orderby'] = 'meta_value_num';
        $args['order'] = 'ASC';
    } elseif ($ordenar === 'preco_desc') {
        $args['meta_key'] = 'valor_hora';
        $args['orderby'] = 'meta_value_num';
        $args['order'] = 'DESC';
    }
    
    $query = new WP_Query($args);
    $acompanhantes = [];
    
    foreach ($query->posts as $post) {
        $acompanhantes[] = formatar_acompanhante($post);
    }
    
    return [
        'data' => $acompanhantes,
        'total' => $query->found_posts,
        'pages' => $query->max_num_pages,
        'current_page' => $request->get_param('page') ?: 1,
    ];
}

function scortrio_get_acompanhante_single($request) {
    $slug = $request->get_param('slug');
    
    $post = get_page_by_path($slug, OBJECT, 'acompanhante');
    
    if (!$post) {
        return new WP_Error('not_found', 'Acompanhante não encontrada', ['status' => 404]);
    }
    
    return formatar_acompanhante($post, true);
}

function formatar_acompanhante($post, $completo = false) {
    $data_nascimento = get_field('data_nascimento', $post->ID);
    $idade = $data_nascimento ? calcular_idade($data_nascimento) : null;
    
    $dados = [
        'id' => $post->ID,
        'slug' => $post->post_name,
        'nome' => $post->post_title,
        'idade' => $idade,
        'cidade' => get_the_terms($post->ID, 'cidade')[0]->name ?? '',
        'estado' => get_field('estado', $post->ID) ?: 'RJ',
        'bairro' => get_field('bairro', $post->ID),
        'valor_hora' => (int) get_field('valor_hora', $post->ID),
        'headline' => get_field('headline', $post->ID) ?: get_the_excerpt($post->ID),
        'foto_principal' => get_the_post_thumbnail_url($post->ID, 'large'),
        'verificada' => (bool) get_field('verificada', $post->ID),
        'plano' => get_field('plano', $post->ID) ?: 'free',
        'online' => (bool) get_field('online', $post->ID),
    ];
    
    if ($completo) {
        $dados['descricao'] = get_the_content(null, false, $post->ID);
        $dados['whatsapp'] = get_field('whatsapp', $post->ID);
        $dados['telefone'] = get_field('telefone', $post->ID);
        $dados['altura'] = get_field('altura', $post->ID);
        $dados['peso'] = get_field('peso', $post->ID);
        $dados['medidas'] = get_field('medidas', $post->ID);
        $dados['valor_meia_hora'] = get_field('valor_meia_hora', $post->ID);
        $dados['valor_pernoite'] = get_field('valor_pernoite', $post->ID);
        $dados['atende_local'] = (bool) get_field('atende_local', $post->ID);
        $dados['aceita_cartao'] = (bool) get_field('aceita_cartao', $post->ID);
        $dados['servicos'] = get_field('servicos', $post->ID) ?: [];
        $dados['galeria'] = [];
        
        // Galeria de fotos
        $galeria = get_field('galeria', $post->ID);
        if ($galeria) {
            foreach ($galeria as $img) {
                $dados['galeria'][] = $img['url'];
            }
        }
    }
    
    return $dados;
}

function calcular_idade($data_nascimento) {
    $nascimento = new DateTime($data_nascimento);
    $hoje = new DateTime();
    return $nascimento->diff($hoje)->y;
}
```

### Passo 3: Configurar CORS (se necessário)

Adicione ao `functions.php`:

```php
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        return $value;
    });
}, 15);
```

### Passo 4: Testar a API

Acesse no navegador:
- `https://seu-site.com/wp-json/scortrio/v1/acompanhantes`
- `https://seu-site.com/wp-json/scortrio/v1/acompanhante/slug-da-acompanhante`

### Passo 5: Conectar o Next.js

1. Edite `.env.local`:
```
NEXT_PUBLIC_WP_API_URL=https://seu-site.com/wp-json
NEXT_PUBLIC_USE_MOCK=false
```

2. Reinicie o servidor Next.js

---

## 🚀 Deploy na Vercel

1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Configure as variáveis de ambiente
5. Deploy!

---

## 🎨 Customização

### Cores
Edite `tailwind.config.ts`:
```ts
colors: {
  primary: "#FF9416",      // Cor principal (laranja)
  "primary-dark": "#E58514",
  "dark-gray": "#373737",
}
```

### Logo
Substitua ou adicione em `src/components/Header.tsx`

### Fontes
Edite `src/app/globals.css`

---

## 📝 Campos ACF necessários no WordPress

Para o CPT `acompanhante`:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| data_nascimento | Date | Data de nascimento |
| headline | Text | Frase de destaque |
| whatsapp | Text | Número do WhatsApp |
| telefone | Text | Telefone |
| estado | Text | UF (ex: RJ) |
| bairro | Text | Bairro |
| valor_hora | Number | Valor por hora |
| valor_meia_hora | Number | Valor 30 min |
| valor_pernoite | Number | Valor pernoite |
| altura | Number | Altura em cm |
| peso | Number | Peso em kg |
| medidas | Text | Medidas |
| verificada | True/False | Perfil verificado |
| online | True/False | Online agora |
| plano | Select | free/premium/vip |
| atende_local | True/False | Tem local |
| aceita_cartao | True/False | Aceita cartão |
| servicos | Checkbox/Repeater | Lista de serviços |
| galeria | Gallery | Fotos adicionais |

---

## ❓ Suporte

Qualquer dúvida, estou à disposição!
