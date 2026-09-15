import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/verificacao');
  };

  return (
    <AuthLayout wide>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-3xl font-medium leading-tight text-caiment-ink">
            Cadastre-se
            <br />
            <span className="text-caiment-purple-600">CAIMENT</span>
          </h1>
          <p className="mt-3 max-w-xs text-sm text-caiment-ink-soft">
            O seu provador virtual está a poucos passos. Crie sua conta para começar.
          </p>

          <p className="mt-8 text-sm text-caiment-ink-soft">
            Já tem uma conta?{' '}
            <Link to="/login">
              <Button variant="secondary" size="sm" className="ml-1">
                Entrar
              </Button>
            </Link>
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-medium text-caiment-ink">Crie sua conta</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <Input placeholder="Nome" icon={<User size={16} />} required />
            <Input placeholder="E-mail" type="email" icon={<Mail size={16} />} required />
            <Input placeholder="Senha" type="password" icon={<Lock size={16} />} required />
            <Input placeholder="Confirmar senha" type="password" icon={<Lock size={16} />} required />

            <label className="flex items-start gap-2.5 pt-1 text-xs text-caiment-ink-soft">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-caiment-line text-caiment-purple-600 focus:ring-caiment-purple-400"
                required
              />
              Li e aceito a{' '}
              <span className="font-medium text-caiment-purple-600 underline underline-offset-2">
                política de privacidade
              </span>{' '}
              do CAIMENT.
            </label>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg">
                Avançar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
