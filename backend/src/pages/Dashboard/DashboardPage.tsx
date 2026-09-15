import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  History as HistoryIcon,
  Scan,
  Shirt,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CaimentBubble } from '@/components/caiment/CaimentBubble';
import { AvatarViewer } from '@/components/avatar/AvatarViewer';

import { mockHistory } from '@/data/mock/mockHistory';
import { mockAvatar } from '@/data/mock/mockAvatar';
import { mockCurrentUser } from '@/data/mock/mockUsers';
import { getCaimentMessage } from '@/data/mock/mockCaiment';
import { formatDate } from '@/utils/format';

export default function DashboardPage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedModelUrl = sessionStorage.getItem(
      'caiment_avatar_model_url',
    );

    if (savedModelUrl) {
      setModelUrl(savedModelUrl);
    }
  }, []);

  const firstName = mockCurrentUser.name.split(' ')[0];

  const recentHistory = mockHistory.slice(0, 3);

  const avatarModelUrl = modelUrl || mockAvatar.modelUrl;

  return (
    <DashboardLayout title="Início">
      <div className="space-y-8">

        {/* ========================================= */}
        {/* CABEÇALHO */}
        {/* ========================================= */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-medium text-caiment-ink">
              Olá, {firstName}
            </h2>

            <p className="mt-1 text-sm text-caiment-ink-soft">
              Seu provador virtual está pronto para você.
            </p>
          </div>

          <CaimentBubble
            message={getCaimentMessage('general')}
            size="sm"
          />
        </div>

        {/* ========================================= */}
        {/* AVATAR + EXPERIÊNCIA */}
        {/* ========================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* AVATAR */}
          <Card
            className="lg:col-span-1"
            padding="none"
          >
            <div className="p-6 pb-0">
              <p className="text-xs font-medium uppercase tracking-wide text-caiment-ink-soft">
                Meu avatar
              </p>

              <h3 className="mt-1 font-display text-lg font-medium text-caiment-ink">
                Sua representação digital
              </h3>
            </div>

            <AvatarViewer
              modelUrl={avatarModelUrl}
              className="mx-4 mt-3 mb-4 aspect-[3/4]"
              showControls={false}
            />

            <div className="px-6 pb-6">
              <Link to="/avatar">
                <Button
                  fullWidth
                  size="sm"
                  variant="outline"
                  icon={<ArrowRight size={14} />}
                  iconPosition="right"
                >
                  Ver avatar completo
                </Button>
              </Link>
            </div>
          </Card>

          {/* ÁREA PRINCIPAL */}
          <div className="flex flex-col gap-4 lg:col-span-2">

            {/* CTA FITSENSE */}
            <div className="relative overflow-hidden rounded-[28px] bg-caiment-ink p-7 text-white shadow-lg">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-caiment-purple-600/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-caiment-lime/10 blur-3xl" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-caiment-purple-500 text-white">
                  <Shirt size={21} />
                </div>

                <h3 className="mt-5 font-display text-2xl font-medium">
                  Experimente antes de comprar.
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">
                  Escolha uma peça na Fitsense e visualize como ela fica
                  no seu avatar através do provador virtual Caiment.
                </p>

                <Link to="/fitsense">
                  <Button
                    className="mt-6 bg-caiment-lime text-caiment-ink hover:bg-caiment-lime-soft"
                    icon={<ShoppingBag size={16} />}
                  >
                    Explorar a Fitsense
                  </Button>
                </Link>
              </div>
            </div>

            {/* ATALHOS */}
            <div className="grid gap-4 sm:grid-cols-2">

              <Link to="/avatar">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-caiment-purple-900/8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-caiment-purple-50 text-caiment-purple-500">
                    <Scan size={20} />
                  </span>

                  <h3 className="mt-4 font-display text-lg font-medium text-caiment-ink">
                    Medidas & avatar
                  </h3>

                  <p className="mt-1 text-sm text-caiment-ink-soft">
                    Consulte seu avatar e mantenha suas medidas atualizadas.
                  </p>
                </Card>
              </Link>

              <Link to="/provador">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-caiment-purple-900/8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-caiment-purple-50 text-caiment-purple-500">
                    <Shirt size={20} />
                  </span>

                  <h3 className="mt-4 font-display text-lg font-medium text-caiment-ink">
                    Meu provador
                  </h3>

                  <p className="mt-1 text-sm text-caiment-ink-soft">
                    Visualize a peça selecionada no seu avatar.
                  </p>
                </Card>
              </Link>

              <Link to="/favoritos">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-caiment-purple-900/8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-caiment-purple-50 text-caiment-purple-500">
                    <Heart size={20} />
                  </span>

                  <h3 className="mt-4 font-display text-lg font-medium text-caiment-ink">
                    Favoritos
                  </h3>

                  <p className="mt-1 text-sm text-caiment-ink-soft">
                    Acesse suas peças favoritas.
                  </p>
                </Card>
              </Link>

              <Link to="/historico">
                <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-caiment-purple-900/8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-caiment-purple-50 text-caiment-purple-500">
                    <HistoryIcon size={20} />
                  </span>

                  <h3 className="mt-4 font-display text-lg font-medium text-caiment-ink">
                    Histórico
                  </h3>

                  <p className="mt-1 text-sm text-caiment-ink-soft">
                    Veja suas últimas experimentações.
                  </p>
                </Card>
              </Link>

            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* COMO FUNCIONA */}
        {/* ========================================= */}

        <div>
          <h3 className="font-display text-lg font-medium text-caiment-ink">
            Como funciona
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <Card>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caiment-purple-50 text-caiment-purple-600">
                <ShoppingBag size={18} />
              </span>

              <p className="mt-4 text-sm font-semibold text-caiment-ink">
                01. Escolha sua peça
              </p>

              <p className="mt-1 text-sm leading-relaxed text-caiment-ink-soft">
                Navegue pela Fitsense e escolha uma roupa que você gostaria
                de experimentar.
              </p>
            </Card>

            <Card>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caiment-purple-50 text-caiment-purple-600">
                <Sparkles size={18} />
              </span>

              <p className="mt-4 text-sm font-semibold text-caiment-ink">
                02. Experimente no Caiment
              </p>

              <p className="mt-1 text-sm leading-relaxed text-caiment-ink-soft">
                Clique em “Experimentar no Caiment” para levar a peça ao
                seu provador virtual.
              </p>
            </Card>

            <Card>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caiment-purple-50 text-caiment-purple-600">
                <Shirt size={18} />
              </span>

              <p className="mt-4 text-sm font-semibold text-caiment-ink">
                03. Veja no seu avatar
              </p>

              <p className="mt-1 text-sm leading-relaxed text-caiment-ink-soft">
                Visualize a experiência no seu avatar e confira as
                informações de tamanho.
              </p>
            </Card>

          </div>
        </div>

        {/* ========================================= */}
        {/* ATIVIDADE RECENTE */}
        {/* ========================================= */}

        <div>
          <h3 className="font-display text-lg font-medium text-caiment-ink">
            Atividade recente
          </h3>

          <Card
            className="mt-4 divide-y divide-caiment-line"
            padding="none"
          >
            {recentHistory.length > 0 ? (
              recentHistory.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-caiment-ink">
                      Tamanho {session.recommendedSize}
                    </p>

                    <p className="text-xs text-caiment-ink-soft">
                      {formatDate(session.date)}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-caiment-purple-600">
                    {session.result === 'aprovado'
                      ? 'Aprovado'
                      : session.result === 'ajustar'
                        ? 'Ajustar'
                        : 'Não recomendado'}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-caiment-ink-soft">
                  Suas experimentações aparecerão aqui.
                </p>
              </div>
            )}
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}