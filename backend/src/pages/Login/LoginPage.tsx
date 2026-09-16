import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shirt } from 'lucide-react';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CaimentRobot } from '@/components/caiment/CaimentRobot';
import {
  loginUser,
  resetPassword,
} from '@/services/firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      await loginUser(email, password);

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);

      switch (error?.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-mail ou senha incorretos.');
          break;

        case 'auth/invalid-email':
          setError('Digite um e-mail válido.');
          break;

        case 'auth/user-disabled':
          setError('Esta conta foi desativada.');
          break;

        case 'auth/too-many-requests':
          setError(
            'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
          );
          break;

        default:
          setError('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Digite seu e-mail antes de recuperar a senha.');
      return;
    }

    try {
      await resetPassword(email);

      setMessage(
        'Enviamos um link para redefinir sua senha. Verifique seu e-mail.'
      );
    } catch (error: any) {
      console.error('Erro ao recuperar senha:', error);

      switch (error?.code) {
        case 'auth/invalid-email':
          setError('Digite um e-mail válido.');
          break;

        case 'auth/user-not-found':
          setError('Não encontramos uma conta com esse e-mail.');
          break;

        default:
          setError(
            'Não foi possível enviar o e-mail de recuperação.'
          );
      }
    }
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Sua senha"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium text-caiment-purple-600"
              >
                Esqueceu a senha?
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="text-sm text-caiment-purple-600">
                {message}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Avançar'}
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

