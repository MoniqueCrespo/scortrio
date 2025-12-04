<?php
/**
 * Plugin: ScortRio API
 * Description: API REST customizada para o frontend Next.js do ScortRio
 * Version: 1.0.0
 * 
 * INSTRUÇÕES:
 * 1. Crie uma pasta 'scortrio-api' em wp-content/plugins/
 * 2. Salve este arquivo como 'scortrio-api.php' dentro dessa pasta
 * 3. Ative o plugin no painel do WordPress
 * 
 * OU
 * 
 * Cole este código no functions.php do seu tema
 */

// Evita acesso direto
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Registrar endpoints da API REST
 */
add_action('rest_api_init', function () {
    
    // Endpoint: Listar acompanhantes com filtros
    register_rest_route('scortrio/v1', '/acompanhantes', [
        'methods' => 'GET',
        'callback' => 'scortrio_get_acompanhantes',
        'permission_callback' => '__return_true',
        'args' => [
            'page' => [
                'default' => 1,
                'sanitize_callback' => 'absint',
            ],
            'per_page' => [
                'default' => 12,
                'sanitize_callback' => 'absint',
            ],
            'cidade' => [
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'preco_min' => [
                'sanitize_callback' => 'absint',
            ],
            'preco_max' => [
                'sanitize_callback' => 'absint',
            ],
            'ordenar' => [
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'verificada' => [
                'sanitize_callback' => 'absint',
            ],
            'online' => [
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);
    
    // Endpoint: Acompanhante individual por slug
    register_rest_route('scortrio/v1', '/acompanhante/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods' => 'GET',
        'callback' => 'scortrio_get_acompanhante_single',
        'permission_callback' => '__return_true',
    ]);
    
    // Endpoint: Listar cidades
    register_rest_route('scortrio/v1', '/cidades', [
        'methods' => 'GET',
        'callback' => 'scortrio_get_cidades',
        'permission_callback' => '__return_true',
    ]);
    
    // Endpoint: Buscar cidades
    register_rest_route('scortrio/v1', '/cidades/search', [
        'methods' => 'GET',
        'callback' => 'scortrio_search_cidades',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Listar acompanhantes com filtros
 */
function scortrio_get_acompanhantes($request) {
    
    // Args base
    $args = [
        'post_type' => 'acompanhante', // AJUSTE para o slug do seu CPT
        'posts_per_page' => $request->get_param('per_page'),
        'paged' => $request->get_param('page'),
        'post_status' => 'publish',
    ];
    
    $meta_query = [];
    $tax_query = [];
    
    // Filtro por cidade (taxonomy)
    if ($cidade = $request->get_param('cidade')) {
        $tax_query[] = [
            'taxonomy' => 'cidade', // AJUSTE para o slug da sua taxonomy
            'field' => 'slug',
            'terms' => $cidade,
        ];
    }
    
    // Filtro por preço mínimo
    if ($preco_min = $request->get_param('preco_min')) {
        $meta_query[] = [
            'key' => 'valor_hora', // AJUSTE para o nome do seu campo ACF
            'value' => $preco_min,
            'compare' => '>=',
            'type' => 'NUMERIC',
        ];
    }
    
    // Filtro por preço máximo
    if ($preco_max = $request->get_param('preco_max')) {
        $meta_query[] = [
            'key' => 'valor_hora',
            'value' => $preco_max,
            'compare' => '<=',
            'type' => 'NUMERIC',
        ];
    }
    
    // Filtro: apenas verificadas
    if ($request->get_param('verificada')) {
        $meta_query[] = [
            'key' => 'verificada',
            'value' => '1',
            'compare' => '=',
        ];
    }
    
    // Filtro: apenas online
    if ($request->get_param('online')) {
        $meta_query[] = [
            'key' => 'online',
            'value' => '1',
            'compare' => '=',
        ];
    }
    
    // Aplicar meta_query
    if (!empty($meta_query)) {
        $args['meta_query'] = $meta_query;
        $args['meta_query']['relation'] = 'AND';
    }
    
    // Aplicar tax_query
    if (!empty($tax_query)) {
        $args['tax_query'] = $tax_query;
    }
    
    // Ordenação
    $ordenar = $request->get_param('ordenar');
    switch ($ordenar) {
        case 'preco_asc':
            $args['meta_key'] = 'valor_hora';
            $args['orderby'] = 'meta_value_num';
            $args['order'] = 'ASC';
            break;
        case 'preco_desc':
            $args['meta_key'] = 'valor_hora';
            $args['orderby'] = 'meta_value_num';
            $args['order'] = 'DESC';
            break;
        case 'mais_recentes':
            $args['orderby'] = 'date';
            $args['order'] = 'DESC';
            break;
        case 'online':
            $args['meta_key'] = 'online';
            $args['orderby'] = 'meta_value';
            $args['order'] = 'DESC';
            break;
        default:
            // Ordenação padrão: VIP primeiro, depois premium, depois por data
            $args['meta_key'] = 'plano';
            $args['orderby'] = [
                'meta_value' => 'DESC',
                'date' => 'DESC',
            ];
            break;
    }
    
    // Executar query
    $query = new WP_Query($args);
    $acompanhantes = [];
    
    foreach ($query->posts as $post) {
        $acompanhantes[] = scortrio_formatar_acompanhante($post);
    }
    
    return rest_ensure_response([
        'data' => $acompanhantes,
        'total' => (int) $query->found_posts,
        'pages' => (int) $query->max_num_pages,
        'current_page' => (int) $request->get_param('page'),
    ]);
}

/**
 * Obter acompanhante individual por slug
 */
function scortrio_get_acompanhante_single($request) {
    $slug = $request->get_param('slug');
    
    // Buscar post pelo slug
    $post = get_page_by_path($slug, OBJECT, 'acompanhante');
    
    if (!$post || $post->post_status !== 'publish') {
        return new WP_Error(
            'not_found',
            'Acompanhante não encontrada',
            ['status' => 404]
        );
    }
    
    return rest_ensure_response(
        scortrio_formatar_acompanhante($post, true)
    );
}

/**
 * Listar todas as cidades
 */
function scortrio_get_cidades($request) {
    $terms = get_terms([
        'taxonomy' => 'cidade',
        'hide_empty' => true,
        'orderby' => 'count',
        'order' => 'DESC',
    ]);
    
    if (is_wp_error($terms)) {
        return rest_ensure_response([]);
    }
    
    $cidades = array_map(function($term) {
        return [
            'id' => $term->term_id,
            'slug' => $term->slug,
            'name' => $term->name,
            'count' => $term->count,
        ];
    }, $terms);
    
    return rest_ensure_response($cidades);
}

/**
 * Buscar cidades por termo
 */
function scortrio_search_cidades($request) {
    $search = $request->get_param('q');
    
    if (empty($search)) {
        return rest_ensure_response([]);
    }
    
    $terms = get_terms([
        'taxonomy' => 'cidade',
        'hide_empty' => false,
        'search' => $search,
        'number' => 10,
    ]);
    
    if (is_wp_error($terms)) {
        return rest_ensure_response([]);
    }
    
    $cidades = array_map(function($term) {
        return [
            'id' => $term->term_id,
            'slug' => $term->slug,
            'name' => $term->name,
            'count' => $term->count,
        ];
    }, $terms);
    
    return rest_ensure_response($cidades);
}

/**
 * Formatar dados da acompanhante
 * 
 * @param WP_Post $post
 * @param bool $completo - Se true, retorna todos os campos
 * @return array
 */
function scortrio_formatar_acompanhante($post, $completo = false) {
    
    // Calcular idade
    $data_nascimento = get_field('data_nascimento', $post->ID);
    $idade = null;
    if ($data_nascimento) {
        $nascimento = new DateTime($data_nascimento);
        $hoje = new DateTime();
        $idade = $nascimento->diff($hoje)->y;
    }
    
    // Obter cidade (taxonomy)
    $cidade_terms = get_the_terms($post->ID, 'cidade');
    $cidade = (!empty($cidade_terms) && !is_wp_error($cidade_terms)) 
        ? $cidade_terms[0]->name 
        : '';
    
    // Dados básicos (listagem)
    $dados = [
        'id' => $post->ID,
        'slug' => $post->post_name,
        'nome' => $post->post_title,
        'idade' => $idade,
        'cidade' => $cidade,
        'estado' => get_field('estado', $post->ID) ?: 'RJ',
        'bairro' => get_field('bairro', $post->ID),
        'valor_hora' => (int) get_field('valor_hora', $post->ID),
        'headline' => get_field('headline', $post->ID) ?: wp_trim_words(get_the_excerpt($post->ID), 15),
        'foto_principal' => get_the_post_thumbnail_url($post->ID, 'large') ?: '',
        'verificada' => (bool) get_field('verificada', $post->ID),
        'plano' => get_field('plano', $post->ID) ?: 'free',
        'online' => (bool) get_field('online', $post->ID),
        'atende_local' => (bool) get_field('atende_local', $post->ID),
    ];
    
    // Dados completos (página individual)
    if ($completo) {
        $dados['descricao'] = apply_filters('the_content', $post->post_content);
        $dados['whatsapp'] = get_field('whatsapp', $post->ID);
        $dados['telefone'] = get_field('telefone', $post->ID);
        $dados['altura'] = get_field('altura', $post->ID);
        $dados['peso'] = get_field('peso', $post->ID);
        $dados['medidas'] = get_field('medidas', $post->ID);
        $dados['cor_olhos'] = get_field('cor_olhos', $post->ID);
        $dados['cor_cabelo'] = get_field('cor_cabelo', $post->ID);
        $dados['valor_meia_hora'] = (int) get_field('valor_meia_hora', $post->ID);
        $dados['valor_pernoite'] = (int) get_field('valor_pernoite', $post->ID);
        $dados['valor_diaria'] = (int) get_field('valor_diaria', $post->ID);
        $dados['aceita_cartao'] = (bool) get_field('aceita_cartao', $post->ID);
        $dados['horario_atendimento'] = get_field('horario_atendimento', $post->ID);
        
        // Serviços (pode ser checkbox, repeater ou taxonomy)
        $servicos = get_field('servicos', $post->ID);
        if (is_array($servicos)) {
            $dados['servicos'] = $servicos;
        } else {
            // Se for taxonomy
            $servicos_terms = get_the_terms($post->ID, 'servico');
            $dados['servicos'] = (!empty($servicos_terms) && !is_wp_error($servicos_terms))
                ? wp_list_pluck($servicos_terms, 'name')
                : [];
        }
        
        // Galeria de fotos
        $galeria = get_field('galeria', $post->ID);
        $dados['galeria'] = [];
        if ($galeria && is_array($galeria)) {
            foreach ($galeria as $img) {
                if (is_array($img) && isset($img['url'])) {
                    $dados['galeria'][] = $img['url'];
                } elseif (is_numeric($img)) {
                    $dados['galeria'][] = wp_get_attachment_url($img);
                }
            }
        }
    }
    
    return $dados;
}

/**
 * Habilitar CORS para a API
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        // Permitir qualquer origem (ajuste para seu domínio em produção)
        $origin = get_http_origin();
        if ($origin) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        } else {
            header('Access-Control-Allow-Origin: *');
        }
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        
        return $value;
    });
}, 15);

/**
 * Tratar requisições OPTIONS (preflight)
 */
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 86400');
        exit(0);
    }
});
