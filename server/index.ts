import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

import {
  uploadImage,
  createMultiviewTask,
  getTask,
} from './services/tripo.js';

dotenv.config();

const app = express();

const PORT = 3001;

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 4,
  },
});

app.use(cors());

app.use(express.json());

/* =========================================
   HEALTH
========================================= */

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend do Caiment funcionando!',
  });
});

/* =========================================
   TRIPO STATUS
========================================= */

app.get('/api/tripo/status', (_req, res) => {
  const configured =
    Boolean(process.env.TRIPO_API_KEY);

  res.json({
    configured,

    message: configured
      ? 'Chave do Tripo configurada no backend.'
      : 'TRIPO_API_KEY não encontrada.',
  });
});

/* =========================================
   GERAR AVATAR
========================================= */

app.post(
  '/api/avatar/generate',

  upload.fields([
    {
      name: 'front',
      maxCount: 1,
    },

    {
      name: 'left',
      maxCount: 1,
    },

    {
      name: 'back',
      maxCount: 1,
    },

    {
      name: 'right',
      maxCount: 1,
    },
  ]),

  async (req, res) => {
    try {
      const files =
        req.files as {
          [fieldname: string]:
            Express.Multer.File[];
        };

      const front =
        files?.front?.[0];

      const left =
        files?.left?.[0];

      const back =
        files?.back?.[0];

      const right =
        files?.right?.[0];

      /* =====================================
         VALIDAR FOTOS
      ===================================== */

      if (
        !front ||
        !left ||
        !back ||
        !right
      ) {
        return res.status(400).json({
          success: false,

          error:
            'É necessário enviar as quatro fotos.',
        });
      }

      console.log('');
      console.log(
        '====================================',
      );
      console.log(
        '📸 FOTOS RECEBIDAS',
      );
      console.log(
        '====================================',
      );

      console.log(
        `Frontal: ${front.originalname}`,
      );

      console.log(
        `Esquerda: ${left.originalname}`,
      );

      console.log(
        `Traseira: ${back.originalname}`,
      );

      console.log(
        `Direita: ${right.originalname}`,
      );

      /* =====================================
         UPLOAD
      ===================================== */

      console.log('');
      console.log(
        '====================================',
      );
      console.log(
        '☁️ ENVIANDO PARA O TRIPO',
      );
      console.log(
        '====================================',
      );

      const frontToken =
        await uploadImage(front);

      const leftToken =
        await uploadImage(left);

      const backToken =
        await uploadImage(back);

      const rightToken =
        await uploadImage(right);

      const imageTokens = {
         front: frontToken,
         left: leftToken,
         back: backToken,
         right: rightToken,
    };

      /* =====================================
         CRIAR TAREFA
      ===================================== */

      console.log('');
      console.log(
        '====================================',
      );
      console.log(
        '🤖 CRIANDO AVATAR 3D',
      );
      console.log(
        '====================================',
      );

     const taskId =
    await createMultiviewTask(
    imageTokens,
  );

      /* =====================================
         RESPOSTA
      ===================================== */

      return res.json({
        success: true,

        taskId,

        message:
          'Avatar enviado para processamento.',
      });
    } catch (error) {
      console.error('');

      console.error(
        '❌ ERRO AO GERAR AVATAR',
      );

      console.error(error);

      return res.status(500).json({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : 'Erro interno ao gerar avatar.',
      });
    }
  },
);

/* =========================================
   CONSULTAR TASK
========================================= */

app.get(
  '/api/avatar/task/:taskId',

  async (req, res) => {
    try {
      const { taskId } =
        req.params;

      if (!taskId) {
        return res.status(400).json({
          success: false,

          error:
            'Task ID não informado.',
        });
      }

      const task =
        await getTask(taskId);

      return res.json({
        success: true,

        task,
      });
    } catch (error) {
      console.error(
        '❌ Erro ao consultar tarefa:',
        error,
      );

      return res.status(500).json({
        success: false,

        error:
          error instanceof Error
            ? error.message
            : 'Erro ao consultar tarefa.',
      });
    }
  },
);

/* =========================================
   START SERVER
========================================= */

app.listen(PORT, () => {
  console.log('');

  console.log(
    '====================================',
  );

  console.log(
    '🚀 CAIMENT BACKEND',
  );

  console.log(
    '====================================',
  );

  console.log(
    `Backend rodando em http://localhost:${PORT}`,
  );

  console.log('');
});