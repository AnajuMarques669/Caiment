const TRIPO_API_URL = 'https://openapi.tripo3d.ai/v3';

function getApiKey(): string {
  const apiKey = process.env.TRIPO_API_KEY;

  if (!apiKey) {
    throw new Error(
      'TRIPO_API_KEY não encontrada no arquivo .env',
    );
  }

  return apiKey;
}

interface TripoUploadResponse {
  code: number;
  message?: string;
  data?: {
    file_token?: string;
  };
}

interface TripoTaskResponse {
  code: number;
  message?: string;
  data?: {
    task_id?: string;
  };
}

export async function uploadImage(
  file: Express.Multer.File,
): Promise<string> {
  const apiKey = getApiKey();

  const formData = new FormData();

  const blob = new Blob([file.buffer], {
    type: file.mimetype,
  });

  formData.append(
    'file',
    blob,
    file.originalname,
  );

  console.log(
    `⬆️ Enviando imagem para o Tripo V3: ${file.originalname}`,
  );

  const response = await fetch(
    `${TRIPO_API_URL}/files`,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${apiKey}`,
      },

      body: formData,
    },
  );

  const text = await response.text();

  console.log(
    `📡 Resposta upload ${file.originalname}:`,
    response.status,
    text,
  );

  if (!response.ok) {
    throw new Error(
      `Erro no upload da imagem para o Tripo (${response.status}): ${text}`,
    );
  }

  let data: TripoUploadResponse;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `O Tripo retornou uma resposta inválida no upload: ${text}`,
    );
  }

  if (
    data.code !== 0 ||
    !data.data?.file_token
  ) {
    throw new Error(
      `Tripo não retornou file_token: ${text}`,
    );
  }

  console.log(
    `✅ File token recebido para ${file.originalname}: ${data.data.file_token}`,
  );

  return data.data.file_token;
}

export async function createMultiviewTask(
  imageTokens: {
    front: string;
    left: string;
    back: string;
    right: string;
  },
): Promise<string> {
  const apiKey = getApiKey();

  console.log(
    '🧠 Criando tarefa multiview no Tripo V3...',
  );

  const body = {
    inputs: [
      { front: imageTokens.front },
      { left: imageTokens.left },
      { back: imageTokens.back },
      { right: imageTokens.right },
    ],

    model: 'v3.1-20260211',

    texture: true,

    pbr: true,

    texture_quality: 'standard',

    geometry_quality: 'standard',

    export_uv: true,
  };

  console.log(
    '📦 Configuração enviada ao Tripo V3:',
    JSON.stringify(body, null, 2),
  );

  const response = await fetch(
    `${TRIPO_API_URL}/generation/multiview-to-model`,
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(body),
    },
  );

  const text = await response.text();

  console.log(
    '📡 Resposta da criação da tarefa:',
    response.status,
    text,
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao criar avatar no Tripo (${response.status}): ${text}`,
    );
  }

  let data: TripoTaskResponse;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `O Tripo retornou uma resposta inválida: ${text}`,
    );
  }

  if (
    data.code !== 0 ||
    !data.data?.task_id
  ) {
    throw new Error(
      `Tripo não retornou task_id: ${text}`,
    );
  }

  console.log(
    `🎯 Task criada no Tripo V3: ${data.data.task_id}`,
  );

  return data.data.task_id;
}

export async function getTask(
  taskId: string,
) {
  const apiKey = getApiKey();

  const response = await fetch(
    `${TRIPO_API_URL}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  const text = await response.text();

  console.log(
    `📡 Consulta da task ${taskId}:`,
    response.status,
    text,
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao consultar tarefa (${response.status}): ${text}`,
    );
  }

  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Resposta inválida do Tripo: ${text}`,
    );
  }

  if (data.code !== 0) {
    throw new Error(
      `Erro do Tripo ao consultar tarefa: ${text}`,
    );
  }

  return data.data;
}