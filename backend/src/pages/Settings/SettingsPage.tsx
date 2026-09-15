import { useState } from 'react';
import { User, Ruler, ShieldCheck, Bell, SlidersHorizontal, Pencil, Phone, Mail as MailIcon, FileText, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { mockCurrentUser } from '@/data/mock/mockUsers';
import { mockMeasurements, measurementLabels } from '@/data/mock/mockMeasurements';
import { cn } from '@/utils/cn';

type Section = 'perfil' | 'medidas' | 'privacidade' | 'notificacoes' | 'preferencias';

const sections: { id: Section; label: string; icon: typeof User }[] = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'medidas', label: 'Dados do avatar', icon: Ruler },
  { id: 'privacidade', label: 'Privacidade', icon: ShieldCheck },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'preferencias', label: 'Preferências', icon: SlidersHorizontal },
];

function Toggle({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(!!defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-caiment-ink">{label}</p>
        <p className="text-xs text-caiment-ink-soft">{description}</p>
      </div>
      <button
        onClick={() => setChecked((v) => !v)}
        role="switch"
        aria-checked={checked}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-caiment-purple-600' : 'bg-caiment-purple-100',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>('perfil');
  const { show } = useToast();

  return (
    <DashboardLayout title="Configurações">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                'flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition-colors',
                active === id
                  ? 'bg-caiment-ink text-white'
                  : 'text-caiment-ink-soft hover:bg-caiment-purple-50 hover:text-caiment-ink',
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <Card padding={active === 'perfil' ? 'none' : 'md'}>
          {active === 'perfil' && (
            <div className="grid overflow-hidden rounded-3xl sm:grid-cols-2">
              <div className="bg-caiment-purple-700 p-7">
                <h3 className="font-display text-xl font-medium text-white">
                  <span className="italic">Meu</span>CAIMENT
                </h3>
                <div className="mt-6 space-y-3">
                  {[
                    { key: 'name', defaultValue: mockCurrentUser.name },
                    { key: 'email', defaultValue: mockCurrentUser.email },
                    { key: 'phone', defaultValue: '(11) 94433-9483' },
                    { key: 'password', defaultValue: '••••••••' },
                  ].map((field) => (
                    <div key={field.key} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5">
                      <input
                        defaultValue={field.defaultValue}
                        className="w-full bg-transparent text-sm text-caiment-ink focus:outline-none"
                      />
                      <Pencil size={13} className="shrink-0 text-caiment-ink-soft" />
                    </div>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-5"
                  onClick={() => show('Perfil atualizado com sucesso.')}
                >
                  Salvar alterações
                </Button>
              </div>

              <div className="space-y-4 bg-caiment-lime-soft p-7">
                <a href="#" className="flex items-center gap-2.5 text-sm text-caiment-ink hover:underline">
                  <FileText size={16} /> Termos de Uso
                </a>
                <div className="h-px bg-caiment-ink/10" />
                <p className="flex items-center gap-2.5 text-sm text-caiment-ink">
                  <Phone size={16} /> (11) 94433-9483
                </p>
                <p className="flex items-center gap-2.5 text-sm text-caiment-ink">
                  <MailIcon size={16} /> {mockCurrentUser.email}
                </p>
                <div className="pt-16">
                  <button className="flex items-center gap-2 text-xs font-medium text-caiment-ink/70 hover:text-caiment-ink">
                    <Trash2 size={13} /> Excluir conta
                  </button>
                </div>
              </div>
            </div>
          )}

          {active === 'medidas' && (
            <div>
              <h3 className="font-display text-lg font-medium text-caiment-ink">Dados do avatar</h3>
              <p className="mt-1 text-sm text-caiment-ink-soft">
                Estas medidas são usadas apenas para personalizar seu avatar 3D.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(mockMeasurements).map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-caiment-purple-50/60 px-3.5 py-2.5">
                    <p className="text-[11px] text-caiment-ink-soft">
                      {measurementLabels[key as keyof typeof measurementLabels]}
                    </p>
                    <p className="text-sm font-medium text-caiment-ink">{value} cm</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 'privacidade' && (
            <div className="divide-y divide-caiment-line">
              <h3 className="pb-2 font-display text-lg font-medium text-caiment-ink">Privacidade</h3>
              <Toggle
                label="Compartilhar dados de medidas com marcas parceiras"
                description="Ajuda a melhorar recomendações de tamanho em outras lojas."
              />
              <Toggle
                label="Manter fotos do avatar salvas"
                description="Suas fotos originais são usadas apenas para gerar o avatar."
                defaultChecked
              />
            </div>
          )}

          {active === 'notificacoes' && (
            <div className="divide-y divide-caiment-line">
              <h3 className="pb-2 font-display text-lg font-medium text-caiment-ink">Notificações</h3>
              <Toggle
                label="Novidades e lançamentos"
                description="Receba avisos sobre novas peças no catálogo."
                defaultChecked
              />
              <Toggle
                label="Lembretes da Caiment"
                description="Dicas e sugestões durante o uso do provador."
                defaultChecked
              />
              <Toggle label="E-mails promocionais" description="Ofertas e descontos especiais." />
            </div>
          )}

          {active === 'preferencias' && (
            <div className="divide-y divide-caiment-line">
              <h3 className="pb-2 font-display text-lg font-medium text-caiment-ink">Preferências</h3>
              <Toggle
                label="Unidade de medida em centímetros"
                description="Desative para usar polegadas."
                defaultChecked
              />
              <Toggle
                label="Animações reduzidas"
                description="Diminui transições e efeitos visuais."
              />
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
