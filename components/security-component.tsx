import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Globe,
  Smartphone,
  RefreshCw,
  Download,
  Key,
  User
} from 'lucide-react';
import type { SecurityLog, User as UserType, Transaction } from '../App';

interface SecurityComponentProps {
  securityLogs: SecurityLog[];
  user: UserType;
  transactions: Transaction[];
  onUpdateUser: (user: UserType) => void;
}

export function SecurityComponent({ securityLogs, user, transactions, onUpdateUser }: SecurityComponentProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email
  });

  // Atualizar profileData quando user mudar
  React.useEffect(() => {
    setProfileData({
      name: user.name,
      email: user.email
    });
  }, [user]);

  const securityScore = 85; // Simulado

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'blocked':
        return <Shield className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Sucesso</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Falhou</Badge>;
      case 'blocked':
        return <Badge className="bg-orange-100 text-orange-800">Bloqueado</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const securityFeatures = [
    {
      title: 'Autenticação Segura',
      description: 'Senhas com critérios de segurança rigorosos',
      status: 'active',
      details: 'Validação de força de senha, hash bcrypt, timeout de sessão'
    },
    {
      title: 'Proteção XSS',
      description: 'Sanitização de entrada e Content Security Policy',
      status: 'active',
      details: 'Escape de HTML, validação de entrada, headers de segurança'
    },
    {
      title: 'Prevenção SQL Injection',
      description: 'Queries parametrizadas e ORM seguro',
      status: 'active',
      details: 'Prepared statements, validação de tipos, sanitização'
    },
    {
      title: 'Proteção CSRF',
      description: 'Tokens anti-CSRF em todas as operações',
      status: 'active',
      details: 'Tokens únicos por sessão, validação de origem'
    },
    {
      title: 'Validação de Upload',
      description: 'Verificação de tipo e tamanho de arquivo',
      status: 'active',
      details: 'Whitelist de tipos, limite de tamanho, scan de malware'
    },
    {
      title: 'Auditoria de Segurança',
      description: 'Log completo de atividades do sistema',
      status: 'active',
      details: 'Monitoramento em tempo real, alertas automáticos'
    }
  ];

  const recentThreats = [
    {
      type: 'Tentativa de Login Suspeita',
      time: '2 horas atrás',
      details: 'IP 203.0.113.1 tentou 5 logins consecutivos',
      severity: 'high',
      action: 'IP bloqueado automaticamente'
    },
    {
      type: 'Upload de Arquivo Suspeito',
      time: '1 dia atrás',
      details: 'Tentativa de upload de arquivo .exe',
      severity: 'medium',
      action: 'Upload rejeitado, usuário alertado'
    },
    {
      type: 'Acesso de Localização Incomum',
      time: '3 dias atrás',
      details: 'Login detectado de país diferente',
      severity: 'low',
      action: 'Notificação enviada por email'
    }
  ];

  const handlePasswordChange = () => {
    // Simulação de mudança de senha
    alert('Senha alterada com sucesso! (Demo)');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleProfileUpdate = () => {
    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email
    };
    onUpdateUser(updatedUser);
    setIsEditingProfile(false);
  };

  const exportSecurityReport = () => {
    const report = {
      user: user.email,
      timestamp: new Date().toISOString(),
      securityScore,
      logs: securityLogs,
      features: securityFeatures
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `security_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header com score de segurança */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8" />
                <h2 className="text-2xl">Minha Conta</h2>
              </div>
              <p className="text-blue-100">
                Configurações de conta e preferências pessoais
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">{securityScore}%</div>
              <div className="text-blue-100">Score de Segurança</div>
              <Progress value={securityScore} className="w-32 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Perfil</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="logs">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Informações do perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Seus dados pessoais e informações da conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">Membro desde janeiro de 2025</p>
                  </div>
                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Editar Perfil</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                        <DialogDescription>
                          Altere suas informações pessoais aqui.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nome Completo</Label>
                          <Input
                            id="edit-name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Digite seu nome completo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">E-mail</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Digite seu e-mail"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleProfileUpdate}>
                          Salvar Alterações
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas da conta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Transações</p>
                    <p className="text-2xl text-blue-600">{transactions.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Categorias Usadas</p>
                    <p className="text-2xl text-green-600">
                      {new Set(transactions.map(t => t.category)).size}
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Anexos Enviados</p>
                    <p className="text-2xl text-purple-600">
                      {transactions.filter(t => t.attachment).length}
                    </p>
                  </div>
                  <Smartphone className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Último Acesso</p>
                    <p className="text-2xl text-gray-600">Hoje</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atividade da Conta
                  </CardTitle>
                  <CardDescription>
                    Histórico de atividades recentes na sua conta
                  </CardDescription>
                </div>
                <Button onClick={exportSecurityReport} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Histórico
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {securityLogs.length > 0 ? (
                <div className="space-y-4">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(log.status)}
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-sm text-gray-500">{formatDateTime(log.timestamp)}</p>
                        </div>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma atividade recente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="settings" className="space-y-6">
          {/* Alteração de senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                      placeholder="Digite sua senha atual"
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    placeholder="Digite sua nova senha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    placeholder="Confirme sua nova senha"
                  />
                </div>

                <Button onClick={handlePasswordChange} className="w-full">
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle>Preferências da Conta</CardTitle>
              <CardDescription>
                Configure suas preferências e opções de privacidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Notificações por Email</h4>
                    <p className="text-sm text-gray-600">
                      Receba resumos semanais e alertas importantes
                    </p>
                  </div>
                  <Button variant="outline">Ativado</Button>
                </div>



                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Backup Automático</h4>
                    <p className="text-sm text-gray-600">
                      Backup automático dos seus dados financeiros
                    </p>
                  </div>
                  <Button variant="outline">Ativado</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Exportar Dados</h4>
                    <p className="text-sm text-gray-600">
                      Baixe uma cópia de todos os seus dados
                    </p>
                  </div>
                  <Button variant="outline">Baixar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informação sobre privacidade */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>🔒 Privacidade:</strong> Seus dados financeiros são protegidos com criptografia avançada 
              e mantidos em total sigilo. Nunca compartilhamos suas informações pessoais com terceiros.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}