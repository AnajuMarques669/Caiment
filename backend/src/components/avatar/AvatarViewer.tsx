import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Canvas,
  useThree,
} from '@react-three/fiber';

import {
  OrbitControls,
  ContactShadows,
  useGLTF,
} from '@react-three/drei';

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import {
  Box3,
  Vector3,
  Group,
  Mesh,
} from 'three';

import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { AvatarPlaceholderModel } from './AvatarPlaceholderModel';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface AvatarViewerProps {
  /** URL do modelo 3D do avatar */
  modelUrl?: string | null;

  /** URL do modelo 3D da roupa */
  clothingModelUrl?: string | null;

  className?: string;
  showControls?: boolean;
}

/* =========================================================
   AVATAR REAL
========================================================= */

function RealModel({
  url,
}: {
  url: string;
}) {
  const { scene } = useGLTF(url);

  const groupRef =
    useRef<Group | null>(null);

  useEffect(() => {
    const group =
      groupRef.current;

    if (!group) {
      return;
    }

    const box =
      new Box3().setFromObject(group);

    const size =
      new Vector3();

    box.getSize(size);

    const targetHeight = 3.4;

    if (size.y > 0) {
      const scale =
        targetHeight / size.y;

      group.scale.setScalar(scale);
    }

    const scaledBox =
      new Box3().setFromObject(group);

    const center =
      new Vector3();

    scaledBox.getCenter(center);

    group.position.x =
      -center.x;

    group.position.z =
      -center.z;

    group.position.y =
      -scaledBox.min.y - 0.8;

  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* =========================================================
   ROUPA REAL
========================================================= */

function ClothingModel({
  url,
}: {
  url: string;
}) {
  const { scene } = useGLTF(url);

  const groupRef =
    useRef<Group | null>(null);

  useEffect(() => {
    const group =
      groupRef.current;

    if (!group) {
      console.error(
        '❌ Grupo da roupa não encontrado.'
      );

      return;
    }

    console.log('');
    console.log(
      '========================================'
    );
    console.log(
      '        🔎 DIAGNÓSTICO DA ROUPA'
    );
    console.log(
      '========================================'
    );

    console.log(
      'Arquivo:',
      url
    );

    /* =====================================================
       PROCURAR TODAS AS MESHES
    ===================================================== */

    let meshCount = 0;

    scene.traverse((child) => {
     const object =
  child as Mesh;
      if (object.isMesh) {
        meshCount++;

        /*
         * Força a mesh a ficar visível.
         */

        object.visible = true;

        object.castShadow = true;
        object.receiveShadow = true;

        console.log(
          `🧩 MESH ${meshCount}:`,
          object.name || '(sem nome)'
        );

        console.log(
          '   posição:',
          {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
          }
        );

        console.log(
          '   escala:',
          {
            x: object.scale.x,
            y: object.scale.y,
            z: object.scale.z,
          }
        );

        console.log(
          '   visível:',
          object.visible
        );

        /*
         * Verifica os materiais.
         */

        const materials =
          Array.isArray(object.material)
            ? object.material
            : [object.material];

        materials.forEach(
          (material, index) => {

            console.log(
              `   material ${index + 1}:`,
              material.type
            );

            console.log(
              '   transparente:',
              material.transparent
            );

            console.log(
              '   opacidade:',
              material.opacity
            );

            /*
             * Força o material a aparecer.
             */

            material.transparent = false;
            material.opacity = 1;
            material.depthWrite = true;
            material.needsUpdate = true;
          }
        );
      }
    });

    console.log(
      '📦 TOTAL DE MESHES:',
      meshCount
    );

    /* =====================================================
       VERIFICAR SE EXISTE MESH
    ===================================================== */

    if (meshCount === 0) {
      console.error(
        '❌ O GLB foi carregado, mas não possui nenhuma Mesh.'
      );

      console.log(
        'Estrutura completa do modelo:',
        scene
      );

      return;
    }

    console.log(
      '✅ O GLB possui',
      meshCount,
      'mesh(es).'
    );

    /* =====================================================
       ATUALIZAR MATRIZES
    ===================================================== */

    scene.updateMatrixWorld(true);
    group.updateMatrixWorld(true);

    /* =====================================================
       TAMANHO ORIGINAL
    ===================================================== */

    const box =
      new Box3().setFromObject(group);

    const size =
      new Vector3();

    const center =
      new Vector3();

    box.getSize(size);
    box.getCenter(center);

    console.log('');
    console.log(
      '----- 📐 TAMANHO ORIGINAL -----'
    );

    console.log(
      'Largura X:',
      size.x
    );

    console.log(
      'Altura Y:',
      size.y
    );

    console.log(
      'Profundidade Z:',
      size.z
    );

    console.log(
      'Centro:',
      {
        x: center.x,
        y: center.y,
        z: center.z,
      }
    );

    console.log(
      'Mínimo:',
      {
        x: box.min.x,
        y: box.min.y,
        z: box.min.z,
      }
    );

    console.log(
      'Máximo:',
      {
        x: box.max.x,
        y: box.max.y,
        z: box.max.z,
      }
    );

    /* =====================================================
       NORMALIZAR ALTURA
    ===================================================== */

    const targetHeight = 1.65;

    if (size.y > 0) {

      const scale =
        targetHeight / size.y;

      group.scale.setScalar(scale);

      console.log('');
      console.log(
        '----- 📏 ESCALA -----'
      );

      console.log(
        'Altura desejada:',
        targetHeight
      );

      console.log(
        'Escala aplicada:',
        scale
      );

    } else {

      console.error(
        '❌ A altura da roupa é 0.'
      );

      return;
    }

    /* =====================================================
       ATUALIZAR APÓS ESCALA
    ===================================================== */

    group.updateMatrixWorld(true);

    /* =====================================================
       NOVA BOUNDING BOX
    ===================================================== */

    const scaledBox =
      new Box3().setFromObject(group);

    const scaledSize =
      new Vector3();

    const scaledCenter =
      new Vector3();

    scaledBox.getSize(
      scaledSize
    );

    scaledBox.getCenter(
      scaledCenter
    );

    console.log('');
    console.log(
      '----- 📐 APÓS ESCALA -----'
    );

    console.log(
      'Largura:',
      scaledSize.x
    );

    console.log(
      'Altura:',
      scaledSize.y
    );

    console.log(
      'Profundidade:',
      scaledSize.z
    );

    console.log(
      'Centro:',
      {
        x: scaledCenter.x,
        y: scaledCenter.y,
        z: scaledCenter.z,
      }
    );

    /* =====================================================
       CENTRALIZAR X
    ===================================================== */

    group.position.x =
      -scaledCenter.x;

    /* =====================================================
       CENTRALIZAR Z
    ===================================================== */

    group.position.z =
      -scaledCenter.z;

    /* =====================================================
       POSICIONAR NO TRONCO
    ===================================================== */

    /*
     * O avatar foi normalizado para
     * aproximadamente 3.4 unidades.
     *
     * A camiseta deve ficar no centro
     * da região superior do corpo.
     */

    const targetCenterY = 0.95;

    group.position.y =
      targetCenterY -
      scaledCenter.y;

    /* =====================================================
       PEQUENO AJUSTE PARA FRENTE
    ===================================================== */

    group.position.z += 0.08;

    /* =====================================================
       ROTAÇÃO INICIAL
    ===================================================== */

    group.rotation.set(
      0,
      0,
      0
    );

    /* =====================================================
       ATUALIZAR MATRIZ FINAL
    ===================================================== */

    group.updateMatrixWorld(true);

    /* =====================================================
       RESULTADO FINAL
    ===================================================== */

    console.log('');
    console.log(
      '----- 🎯 POSIÇÃO FINAL -----'
    );

    console.log({
      x: group.position.x,
      y: group.position.y,
      z: group.position.z,
    });

    console.log(
      'Rotação:',
      {
        x: group.rotation.x,
        y: group.rotation.y,
        z: group.rotation.z,
      }
    );

    console.log('');
    console.log(
      '========================================'
    );

    console.log(
      '✅ ROUPA PROCESSADA'
    );

    console.log(
      'Meshes encontradas:',
      meshCount
    );

    console.log(
      '========================================'
    );

  }, [scene, url]);

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
      />
    </group>
  );
}

/* =========================================================
   CENA
========================================================= */

function Scene({
  modelUrl,
  clothingModelUrl,
}: {
  modelUrl?: string | null;
  clothingModelUrl?: string | null;
}) {
  return (
    <>
      {/* =================================================
          ILUMINAÇÃO
      ================================================= */}

      <hemisphereLight
        args={[
          '#F4F1FC',
          '#6E42D1',
          0.55,
        ]}
      />

      <ambientLight
        intensity={0.4}
      />

      <directionalLight
        position={[
          3,
          5,
          4,
        ]}
        intensity={1.2}
        castShadow
      />

      <directionalLight
        position={[
          -3,
          2,
          -3,
        ]}
        intensity={0.4}
      />

      <pointLight
        position={[
          0,
          2.5,
          -2,
        ]}
        intensity={0.3}
        color="#C6F24E"
      />

      {/* =================================================
          MODELOS
      ================================================= */}

      <Suspense fallback={null}>

        {/* AVATAR */}

        {modelUrl ? (
          <RealModel
            url={modelUrl}
          />
        ) : (
          <AvatarPlaceholderModel />
        )}

        {/* ROUPA */}

        {clothingModelUrl && (
          <ErrorBoundary
            fallback={
              <ClothingError />
            }
          >
            <ClothingModel
              key={clothingModelUrl}
              url={clothingModelUrl}
            />
          </ErrorBoundary>
        )}

      </Suspense>

      {/* =================================================
          SOMBRA
      ================================================= */}

      <ContactShadows
        position={[
          0,
          -1.55,
          0,
        ]}
        opacity={0.35}
        scale={4}
        blur={2.4}
        far={2}
      />
    </>
  );
}

/* =========================================================
   ERRO DA ROUPA
========================================================= */

function ClothingError() {
  return (
    <group>
      {/*
        Se a roupa apresentar algum erro,
        o avatar continua funcionando.
      */}
    </group>
  );
}

/* =========================================================
   CÂMERA
========================================================= */

function CameraController() {
  const { camera } =
    useThree();

  useEffect(() => {

    camera.position.set(
      0,
      0.35,
      5.2,
    );

    camera.lookAt(
      0,
      0.15,
      0,
    );

  }, [camera]);

  return null;
}

/* =========================================================
   AVATAR VIEWER
========================================================= */

export function AvatarViewer({
  modelUrl,
  clothingModelUrl,
  className,
  showControls = true,
}: AvatarViewerProps) {

  const controlsRef =
    useRef<OrbitControlsImpl | null>(
      null,
    );

  const [ready, setReady] =
    useState(false);

  /* =====================================================
     RESETAR CÂMERA
  ===================================================== */

  const handleReset = () => {
    controlsRef.current?.reset();
  };

  /* =====================================================
     ZOOM
  ===================================================== */

  const handleZoom = (
    dir: 1 | -1,
  ) => {

    const controls =
      controlsRef.current;

    if (!controls) {
      return;
    }

    const camera =
      controls.object;

    const factor =
      dir === 1
        ? 0.85
        : 1.15;

    camera.position.multiplyScalar(
      factor,
    );

    controls.update();
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-caiment-purple-50 to-white ${
        className ?? ''
      }`}
    >

      {/* =================================================
          LOADING
      ================================================= */}

      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">

          <LoadingState
            label="Carregando avatar..."
          />

        </div>
      )}

      {/* =================================================
          CENA 3D
      ================================================= */}

      <ErrorBoundary
        fallback={
          <div className="flex h-full min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">

            <p className="text-sm text-caiment-ink-soft">
              Não foi possível exibir o avatar 3D agora.
            </p>

          </div>
        }
      >

        <Canvas
          shadows
          camera={{
            position: [
              0,
              0.35,
              5.2,
            ],
            fov: 30,
          }}
          onCreated={() =>
            setReady(true)
          }
        >

          {/* CÂMERA */}

          <CameraController />

          {/* CENA */}

          <Scene
            modelUrl={modelUrl}
            clothingModelUrl={
              clothingModelUrl
            }
          />

          {/* CONTROLES */}

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            minDistance={3.2}
            maxDistance={8}
            minPolarAngle={
              Math.PI / 3.2
            }
            maxPolarAngle={
              Math.PI / 1.7
            }
            target={[
              0,
              0.15,
              0,
            ]}
          />

        </Canvas>

      </ErrorBoundary>

      {/* =================================================
          BOTÕES
      ================================================= */}

      {showControls && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full glass px-2 py-2">

          {/* ZOOM OUT */}

          <button
            onClick={() =>
              handleZoom(-1)
            }
            aria-label="Diminuir zoom"
            className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
          >
            <ZoomOut size={15} />
          </button>

          {/* RESET */}

          <button
            onClick={handleReset}
            aria-label="Resetar câmera"
            className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
          >
            <RotateCcw size={15} />
          </button>

          {/* ZOOM IN */}

          <button
            onClick={() =>
              handleZoom(1)
            }
            aria-label="Aumentar zoom"
            className="flex h-8 w-8 items-center justify-center rounded-full text-caiment-ink-soft hover:bg-white/70"
          >
            <ZoomIn size={15} />
          </button>

        </div>
      )}

    </div>
  );
}