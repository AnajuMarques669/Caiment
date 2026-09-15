const TRIPO_API_URL = 'https://openapi.tripo3d.ai/v3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function apiKey() {
  const key = Deno.env.get('TRIPO_API_KEY');
  if (!key) throw new Error('TRIPO_API_KEY não configurada nos Secrets do Lovable Cloud.');
  return key;
}

async function uploadImage(file: File) {
  const form = new FormData();
  form.append('file', file, file.name);
  const response = await fetch(`${TRIPO_API_URL}/files`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });
  const data = await response.json();
  if (!response.ok || data.code !== 0 || !data.data?.file_token) {
    throw new Error(data.message || 'Falha ao enviar imagem para o Tripo.');
  }
  return data.data.file_token as string;
}

async function createTask(files: Record<string, File>) {
  const tokens: Record<string, string> = {};
  for (const angle of ['front', 'left', 'back', 'right']) {
    tokens[angle] = await uploadImage(files[angle]);
  }

  const response = await fetch(`${TRIPO_API_URL}/generation/multiview-to-model`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: [
        { front: tokens.front },
        { left: tokens.left },
        { back: tokens.back },
        { right: tokens.right },
      ],
      model: 'v3.1-20260211',
      texture: true,
      pbr: true,
      texture_quality: 'standard',
      geometry_quality: 'standard',
      export_uv: true,
    }),
  });

  const data = await response.json();
  if (!response.ok || data.code !== 0 || !data.data?.task_id) {
    throw new Error(data.message || 'O Tripo não criou a tarefa.');
  }
  return data.data.task_id as string;
}

async function getTask(taskId: string) {
  const response = await fetch(`${TRIPO_API_URL}/tasks/${encodeURIComponent(taskId)}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
  });
  const data = await response.json();
  if (!response.ok || data.code !== 0) {
    throw new Error(data.message || 'Não foi possível consultar a tarefa.');
  }
  return data.data;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (request.method === 'GET') {
      const taskId = new URL(request.url).searchParams.get('taskId');
      if (!taskId) return json({ success: false, error: 'taskId é obrigatório.' }, 400);
      return json({ success: true, task: await getTask(taskId) });
    }

    if (request.method === 'POST') {
      const form = await request.formData();
      const files: Record<string, File> = {};
      for (const angle of ['front', 'left', 'back', 'right']) {
        const file = form.get(angle);
        if (!(file instanceof File)) {
          return json({ success: false, error: `A foto ${angle} é obrigatória.` }, 400);
        }
        files[angle] = file;
      }
      const taskId = await createTask(files);
      return json({ success: true, taskId, message: 'Avatar enviado para processamento.' });
    }

    return json({ success: false, error: 'Método não suportado.' }, 405);
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error instanceof Error ? error.message : 'Erro interno.' }, 500);
  }
});
