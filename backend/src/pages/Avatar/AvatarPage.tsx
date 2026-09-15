
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, RefreshCw } from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AvatarViewer } from '@/components/avatar/AvatarViewer';
import { CaimentRobot } from '@/components/caiment/CaimentRobot';

import { mockAvatar } from '@/data/mock/mockAvatar';
import {
  mockMeasurements,
  measurementLabels,
} from '@/data/mock/mockMeasurements';

import { formatDate } from '@/utils/format';

export default function AvatarPage() {
  const [modelUrl, setModelUrl] =
    useState<string | null>(null);

  useEffect(() => {
    const savedModelUrl =
      sessionStorage.getItem(
        'caiment_avatar_model_url',
      );

    if (savedModelUrl) {
      setModelUrl(savedModelUrl);
    }
  }, []);

  const avatarModelUrl =
    modelUrl || mockAvatar.modelUrl;

  return (
    <DashboardLayout title="Meu Avatar">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card
          padding="none"
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="font-display text-xl font-medium text-caiment-ink">
              <span className="italic">
                Meu
              </span>
              CAIMENT
            </h2>

            <CaimentRobot
              pose="heart"
              size={56}
            />
          </div>

          <AvatarViewer
            modelUrl={avatarModelUrl}
            className="aspect-[4/5] w-full"
          />

          <div className="flex items-center justify-between border-t border-caiment-line px-6 py-4">
            <p className="text-xs text-caiment-ink-soft">
              {modelUrl
                ? 'Avatar gerado pelo Tripo AI'
                : `Atualizado em ${formatDate(
                    mockAvatar.updatedAt,
                  )}`}
            </p>

            <Link to="/avatar-criacao">
              <Button
                size="sm"
                variant="outline"
                icon={
                  <RefreshCw size={14} />
                }
              >
                Refazer fotos
              </Button>
            </Link>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-caiment-purple-50 text-caiment-purple-500">
                <Ruler size={17} />
              </span>

              <h3 className="font-display text-lg font-medium text-caiment-ink">
                Suas medidas
              </h3>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {Object.entries(
                mockMeasurements,
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-2xl bg-caiment-purple-50/60 px-3.5 py-2.5"
                >
                  <p className="text-[11px] text-caiment-ink-soft">
                    {
                      measurementLabels[
                        key as keyof typeof measurementLabels
                      ]
                    }
                  </p>

                  <p className="text-sm font-medium text-caiment-ink">
                    {value} cm
                  </p>
                </div>
              ))}
            </div>

            <Link to="/medidas">
              <Button
                fullWidth
                size="sm"
                variant="outline"
                className="mt-4"
              >
                Editar medidas
              </Button>
            </Link>
          </Card>

          <Card className="bg-caiment-purple-50/50">
            <p className="text-sm text-caiment-ink">
              Este modelo é uma representação
              aproximada do seu corpo, usada para
              recomendar tamanhos e simular o
              caimento das roupas.
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

