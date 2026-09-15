import { type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shirt } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CaimentRobot } from '@/components/caiment/CaimentRobot';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <AuthLayout wide>
      <div className="grid items-center gap-8 sm:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-3xl font-medium leading-tight text-caiment-ink">
            Conecte-se
            <br />
            <span className="text-caiment-purple-600">CAIMENT</span>
          </h1>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Input
              label="Nome de usuário ou e-mail"
              type="email"
              placeholder="voce@email.com"
              icon={<Mail size={16} />}
              required
            />
            <Input label="Senha" type="password" placeholder="Sua senha" icon={<Lock size={16} />} required />

            <div className="flex justify-end">
              <button type="button" className="text-xs font-medium text-caiment-purple-600">
                Esqueceu a senha?
              </button>
            </div>

            <Button type="submit" fullWidth size="lg">
              Avançar
            </Button>
          </form>

          <p className="mt-6 text-sm text-caiment-ink-soft">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro">
              <Button variant="secondary" size="sm" className="ml-1">
                Cadastre-se
              </Button>
            </Link>
          </p>
        </div>

        <div className="relative hidden justify-self-center sm:flex">
          <div className="absolute -top-4 right-2 rounded-2xl rounded-br-sm bg-caiment-purple-50 px-3 py-2 shadow-sm">
            <Shirt size={18} className="text-caiment-purple-500" />
          </div>
          <CaimentRobot pose="point" size={160} />
        </div>
      </div>
    </AuthLayout>
  );
}
