import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { DollarSign, Eye, EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { User } from '../App';

interface AuthComponentProps {
  onLogin: (user: User) => void;
}

export function AuthComponent({ onLogin }: AuthComponentProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [securityChecks, setSecurityChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Validação de segurança para senhas
  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setSecurityChecks(checks);
    return Object.values(checks).every(Boolean);
  };

  // Sanitização de entrada para prevenir XSS
  const sanitizeInput = (input: string) => {
    return input
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  // Validação de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Validação em tempo real para senha
    if (field === 'password') {
      validatePassword(value);
    }
    
    // Limpar erros quando o usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validação de email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação de senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isLogin && !validatePassword(formData.password)) {
      newErrors.password = 'Senha não atende aos requisitos de segurança';
    }

    // Validação para cadastro
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulação de autenticação com delay
    setTimeout(() => {
      // Simulação de verificação de credenciais
      if (isLogin) {
        // Login simulado
        const user: User = {
          id: '1',
          email: formData.email,
          name: formData.email.split('@')[0]
        };
        onLogin(user);
      } else {
        // Cadastro simulado
        const user: User = {
          id: Date.now().toString(),
          email: formData.email,
          name: formData.name
        };
        onLogin(user);
      }
      setIsLoading(false);
    }, 1500);
  };

  const SecurityIndicator = ({ check, label }: { check: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {check ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-red-500" />
      )}
      <span className={check ? 'text-green-700' : 'text-red-700'}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Image and branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <DollarSign className="h-12 w-12 text-blue-600" />
            <h1 className="text-3xl text-gray-900">FinanceControl</h1>
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-xl text-gray-700">
              Controle Total das Suas Finanças
            </h2>
            <p className="text-gray-600">
              Organize suas receitas e despesas, acompanhe seus gastos e alcance seus objetivos financeiros de forma simples e segura.
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h3 className="text-lg mb-4 text-gray-800">💡 Principais Recursos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
              <div>✓ Controle de receitas e despesas</div>
              <div>✓ Relatórios visuais detalhados</div>
              <div>✓ Categorização automática</div>
              <div>✓ Metas e orçamentos</div>
              <div>✓ Anexar comprovantes</div>
              <div>✓ Dados sempre seguros</div>
            </div>
          </div>

          <ImageWithFallback
            src="https://images.unsplash.com/photo-1553801613-9b225d58f429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25leSUyMG1hbmFnZW1lbnQlMjBiYW5raW5nfGVufDF8fHx8MTc1ODg0MDM2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Financial Security"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right side - Authentication form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              {isLogin ? 'Entrar na Conta' : 'Criar Conta'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Entre com suas credenciais para acessar o sistema'
                : 'Crie uma nova conta para começar a gerenciar suas finanças'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Sua senha"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirme sua senha"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Password Security Indicators */}
                  {formData.password && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">Requisitos de segurança:</p>
                      <div className="grid grid-cols-1 gap-1">
                        <SecurityIndicator 
                          check={securityChecks.length} 
                          label="Mínimo 8 caracteres" 
                        />
                        <SecurityIndicator 
                          check={securityChecks.uppercase} 
                          label="Letra maiúscula" 
                        />
                        <SecurityIndicator 
                          check={securityChecks.lowercase} 
                          label="Letra minúscula" 
                        />
                        <SecurityIndicator 
                          check={securityChecks.number} 
                          label="Número" 
                        />
                        <SecurityIndicator 
                          check={securityChecks.special} 
                          label="Caractere especial" 
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    name: ''
                  });
                }}
              >
                {isLogin 
                  ? 'Não tem uma conta? Criar conta'
                  : 'Já tem uma conta? Entrar'
                }
              </Button>
            </div>

            {/* Demo credentials */}
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo:</strong> Use qualquer email válido e uma senha segura para testar o sistema.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}